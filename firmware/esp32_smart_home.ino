/*
 * IoT Smart Home Sensors - ESP32 Firmware
 * 
 * Features:
 * - Reads photoresistor light sensor with detailed debug logging
 * - Uploads data to Firebase via WiFi
 * 
 * Hardware Connections:
 * - Light Sensor: Pin 34 (ADC)
 *   - Photoresistor leg 1 → 3.3V
 *   - Photoresistor leg 2 → Breadboard row (junction)
 *   - 10kΩ Resistor leg 1 → Same breadboard row (junction)
 *   - 10kΩ Resistor leg 2 → GND
 *   - Wire from junction → GPIO 34
 * 
 * - RGB LED:
 *   - Common Cathode: Red/Green/Blue → GPIO 25/26/27 (with 220Ω resistors each)
 *   - Common Anode: Red/Green/Blue → GPIO 25/26/27 (with 220Ω resistors each)
 *   - Common pin → GND (cathode) or 3.3V (anode)
 */

 #include <WiFi.h>
 #include <FirebaseESP32.h>
 
 // WiFi Credentials - UPDATE THESE
 const char* ssid = "Diversity";
 const char* password = "acpsst@2026";
 
 // Firebase Configuration - UPDATE THESE
 #define FIREBASE_HOST "iot-smart-home-fb391-default-rtdb.firebaseio.com"
 #define FIREBASE_AUTH "CezOAJlBvcIKHdFH9LNhcJH3jSmbH1rHl4iCEst7"
 
 // Pin Definitions
 #define LIGHT_PIN 34
 
 // RGB LED Pins
 #define RED_PIN 25
 #define GREEN_PIN 26
 #define BLUE_PIN 27
 
 // PWM Configuration for RGB LED
 #define PWM_FREQ 5000
 #define PWM_RESOLUTION 8  // 8-bit resolution (0-255)
 
 // Try setting this to true if LED doesn't work (for common anode LEDs)
 #define COMMON_ANODE false  // Set to true if your RGB LED is common anode
 
 // Option to disable auto color update (for testing)
 #define AUTO_UPDATE_LED true  // Set to false to disable automatic color changes
 
 // Firebase Objects
 FirebaseData fbdo;
 FirebaseAuth auth;
 FirebaseConfig config;
 
 // Sensor Values
 int lightLevel = 0;
 
 // RGB LED Values
 int redValue = 0;
 int greenValue = 0;
 int blueValue = 0;
 
 // Timing
 unsigned long lastSensorUpdate = 0;
 const unsigned long SENSOR_INTERVAL = 2000;  // 2 seconds
 
 void setup() {
   Serial.begin(115200);
   delay(1000);
   
   Serial.println("\n=== IoT Smart Home Sensors Starting ===");
   Serial.println("Reading sensor: Photoresistor (GPIO 34)");
   
   // Connect to WiFi
   WiFi.begin(ssid, password);
   Serial.print("Connecting to WiFi");
   int wifiAttempts = 0;
   while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
     delay(500);
     Serial.print(".");
     wifiAttempts++;
   }
   
   if (WiFi.status() == WL_CONNECTED) {
     Serial.println("\nWiFi connected!");
     Serial.print("IP address: ");
     Serial.println(WiFi.localIP());
   } else {
     Serial.println("\nWiFi connection failed!");
     return;
   }
   
   // Initialize Firebase
   config.host = FIREBASE_HOST;
   config.signer.tokens.legacy_token = FIREBASE_AUTH;
   Firebase.begin(&config, &auth);
   Firebase.reconnectWiFi(true);
   
   // Set buffer sizes
   fbdo.setBSSLBufferSize(1024, 1024);
   fbdo.setResponseSize(1024);
   
   Serial.println("Firebase initialized");
   
   // Initialize RGB LED PWM (ESP32 Core 2.0.0+ API)
   Serial.println("\nInitializing RGB LED...");
   Serial.printf("   - RED_PIN: GPIO %d\n", RED_PIN);
   Serial.printf("   - GREEN_PIN: GPIO %d\n", GREEN_PIN);
   Serial.printf("   - BLUE_PIN: GPIO %d\n", BLUE_PIN);
   Serial.printf("   - PWM Frequency: %d Hz\n", PWM_FREQ);
   Serial.printf("   - PWM Resolution: %d bits\n", PWM_RESOLUTION);
   Serial.printf("   - Common Anode: %s\n", COMMON_ANODE ? "YES" : "NO");
   
   // Attach PWM to pins
   if (ledcAttach(RED_PIN, PWM_FREQ, PWM_RESOLUTION)) {
     Serial.println("   ✅ RED_PIN PWM attached successfully");
   } else {
     Serial.println("   ❌ RED_PIN PWM attach failed!");
   }
   
   if (ledcAttach(GREEN_PIN, PWM_FREQ, PWM_RESOLUTION)) {
     Serial.println("   ✅ GREEN_PIN PWM attached successfully");
   } else {
     Serial.println("   ❌ GREEN_PIN PWM attach failed!");
   }
   
   if (ledcAttach(BLUE_PIN, PWM_FREQ, PWM_RESOLUTION)) {
     Serial.println("   ✅ BLUE_PIN PWM attached successfully");
   } else {
     Serial.println("   ❌ BLUE_PIN PWM attach failed!");
   }
   
   // Test RGB LED with different colors
   Serial.println("\n🔍 Testing RGB LED...");
   
   // Test RED
   Serial.println("   Testing RED...");
   setRGBColor(255, 0, 0);
   delay(1000);
   
   // Test GREEN
   Serial.println("   Testing GREEN...");
   setRGBColor(0, 255, 0);
   delay(1000);
   
   // Test BLUE
   Serial.println("   Testing BLUE...");
   setRGBColor(0, 0, 255);
   delay(1000);
   
   // Test WHITE
   Serial.println("   Testing WHITE...");
   setRGBColor(255, 255, 255);
   delay(1000);
   
   // Turn OFF
   Serial.println("   Turning OFF...");
   setRGBColor(0, 0, 0);
   delay(500);
   
   Serial.println("RGB LED test complete");
   
   // Initial sensor reading
   readPhotoresistor();
   
   // Show current light level and what color it will trigger
   Serial.printf("\n📊 Current Light Level: %d\n", lightLevel);
   Serial.println("   This will determine the LED color:");
   if (lightLevel < 500) {
     Serial.println("   → Very Dark (< 500) → BLUE");
   } else if (lightLevel < 1000) {
     Serial.println("   → Dark (< 1000) → PURPLE");
   } else if (lightLevel < 2000) {
     Serial.println("   → Moderate (< 2000) → GREEN");
   } else if (lightLevel < 3000) {
     Serial.println("   → Bright (< 3000) → YELLOW");
   } else {
     Serial.println("   → Very Bright (>= 3000) → RED");
   }
   
   if (AUTO_UPDATE_LED) {
     updateRGBBasedOnLight();
   } else {
     Serial.println("   ⚠️  Auto-update disabled - LED will stay off");
     setRGBColor(0, 0, 0);
   }
   
   publishSensorData();
   
   Serial.println("=== System Ready ===\n");
 }
 
 void loop() {
   // Read sensor periodically
   if (millis() - lastSensorUpdate >= SENSOR_INTERVAL) {
     readPhotoresistor();
     if (AUTO_UPDATE_LED) {
       updateRGBBasedOnLight();  // Update RGB LED based on light level
     }
     publishSensorData();
     lastSensorUpdate = millis();
   }
 }
 
 void setRGBColor(int red, int green, int blue) {
   // Clamp values to 0-255
   red = constrain(red, 0, 255);
   green = constrain(green, 0, 255);
   blue = constrain(blue, 0, 255);
   
   // Invert values if common anode LED
   if (COMMON_ANODE) {
     red = 255 - red;
     green = 255 - green;
     blue = 255 - blue;
   }
   
   // Store values
   redValue = red;
   greenValue = green;
   blueValue = blue;
   
   // Set PWM duty cycle (ESP32 Core 2.0.0+ uses pin numbers directly)
   ledcWrite(RED_PIN, red);
   ledcWrite(GREEN_PIN, green);
   ledcWrite(BLUE_PIN, blue);
   
   Serial.printf("🎨 RGB LED set to: R=%d, G=%d, B=%d", red, green, blue);
   if (COMMON_ANODE) {
     Serial.println(" (inverted for common anode)");
   } else {
     Serial.println(" (common cathode)");
   }
 }
 
 void updateRGBBasedOnLight() {
   Serial.println("\n[Updating RGB LED based on light level...]");
   Serial.printf("   📊 Current light level: %d\n", lightLevel);
   
   // Map light level to different colors
   // Adjusted thresholds based on typical photoresistor readings
   if (lightLevel < 1800) {
     // Dark -> red
     setRGBColor(255, 0, 0);
     Serial.printf("   💡 Condition: Dark (< 1800) -> RED | Light Level: %d\n", lightLevel);
   } else if (lightLevel >= 1800) {
     // bright -> green
     setRGBColor(0, 255, 0);
     Serial.printf("   💡 Condition: bright (>= 1800) -> GREEN | Light Level: %d\n", lightLevel);
   } 
 }
 
 void readPhotoresistor() {
   Serial.println("\n[Reading Photoresistor...]");
   
   // ========== PHOTORESISTOR DEBUG LOGGING ==========
   Serial.println("🔍 [PHOTORESISTOR DEBUG] Starting read...");
   Serial.printf("   - GPIO Pin: %d (LIGHT_PIN)\n", LIGHT_PIN);
   Serial.printf("   - Pin Mode: INPUT (ADC)\n");
   
   // Read raw ADC value
   int rawValue = analogRead(LIGHT_PIN);
   Serial.printf("   - Raw ADC Value: %d (range: 0-4095)\n", rawValue);
   
   // Calculate voltage (ESP32 ADC is 12-bit, 0-3.3V)
   float voltage = (rawValue / 4095.0) * 3.3;
   Serial.printf("   - Calculated Voltage: %.3fV (out of 3.3V max)\n", voltage);
   
   // Calculate percentage
   int percentage = (rawValue * 100) / 4095;
   Serial.printf("   - Light Percentage: %d%% (0% = dark, 100% = bright)\n", percentage);
   
   // Determine light condition
   String lightCondition;
   if (rawValue < 500) {
     lightCondition = "Very Dark";
   } else if (rawValue < 1000) {
     lightCondition = "Dark";
   } else if (rawValue < 2000) {
     lightCondition = "Moderate";
   } else if (rawValue < 3000) {
     lightCondition = "Bright";
   } else {
     lightCondition = "Very Bright";
   }
   Serial.printf("   - Light Condition: %s\n", lightCondition.c_str());
   
   // Store value
   lightLevel = rawValue;
   
   // Summary
   Serial.printf("📈 [PHOTORESISTOR SUMMARY] Value: %d | Voltage: %.3fV | Condition: %s\n", 
                 lightLevel, voltage, lightCondition.c_str());
   Serial.println("✅ Photoresistor read complete");
 }
 
 void publishSensorData() {
   Serial.println("\n[Publishing to Firebase...]");
   
   // Publish photoresistor data
   Serial.printf("📤 Publishing light level: %d\n", lightLevel);
   if (Firebase.setInt(fbdo, "/sensors/light", lightLevel)) {
     Serial.printf("✅ Light level published successfully: %d\n", lightLevel);
   } else {
     Serial.printf("❌ Light publish failed (value: %d)\n", lightLevel);
     Serial.printf("   Error reason: %s\n", fbdo.errorReason().c_str());
     Serial.printf("   Error code: %d\n", fbdo.httpCode());
   }
   
   // Publish RGB LED values
   Serial.printf("📤 Publishing RGB values: R=%d, G=%d, B=%d\n", redValue, greenValue, blueValue);
   if (Firebase.setInt(fbdo, "/sensors/rgb/red", redValue)) {
     Serial.printf("✅ Red value published: %d\n", redValue);
   } else {
     Serial.printf("❌ Red publish failed: %s\n", fbdo.errorReason().c_str());
   }
   
   if (Firebase.setInt(fbdo, "/sensors/rgb/green", greenValue)) {
     Serial.printf("✅ Green value published: %d\n", greenValue);
   } else {
     Serial.printf("❌ Green publish failed: %s\n", fbdo.errorReason().c_str());
   }
   
   if (Firebase.setInt(fbdo, "/sensors/rgb/blue", blueValue)) {
     Serial.printf("✅ Blue value published: %d\n", blueValue);
   } else {
     Serial.printf("❌ Blue publish failed: %s\n", fbdo.errorReason().c_str());
   }
   
   // Add timestamp
   unsigned long timestamp = millis() / 1000;
   Serial.printf("📤 Publishing timestamp: %lu seconds\n", timestamp);
   if (Firebase.setInt(fbdo, "/sensors/timestamp", timestamp)) {
     Serial.printf("✅ Timestamp published: %lu seconds\n", timestamp);
   } else {
     Serial.printf("❌ Timestamp publish failed: %s\n", fbdo.errorReason().c_str());
   }
   
   Serial.println("---");  // Separator for readability
 }