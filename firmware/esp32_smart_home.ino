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

// Firebase Objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Sensor Values
int lightLevel = 0;

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
  
  // Initial sensor reading
  readPhotoresistor();
  publishSensorData();
  
  Serial.println("=== System Ready ===\n");
}

void loop() {
  // Read sensor periodically
  if (millis() - lastSensorUpdate >= SENSOR_INTERVAL) {
    readPhotoresistor();
    publishSensorData();
    lastSensorUpdate = millis();
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
