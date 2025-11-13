# Library Setup Guide for Arduino IDE

## Step-by-Step Library Installation

### Prerequisites
1. Arduino IDE installed
2. ESP32 board support installed
   - If not installed: File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install

### Installing Libraries

#### Method 1: Library Manager (Recommended)

1. Open Arduino IDE
2. Go to **Tools → Manage Libraries...**
3. For each library below, search and install:

##### Library 1: DHT sensor library
- **Search:** "DHT sensor library"
- **Author:** Adafruit
- **Version:** Latest
- **Click:** Install

##### Library 2: FastLED
- **Search:** "FastLED"
- **Author:** FastLED
- **Version:** Latest
- **Click:** Install

##### Library 3: Firebase ESP32 Client
- **Search:** "Firebase ESP32"
- **Author:** Mobizt
- **Version:** Latest
- **Click:** Install
- **Note:** This is a large library, download may take time

##### Library 4: LiquidCrystal_I2C
- **Search:** "LiquidCrystal_I2C"
- **Author:** Frank de Brabander
- **Version:** Latest
- **Click:** Install

#### Method 2: Manual Installation (If Library Manager doesn't work)

1. Download library ZIP files
2. Go to **Sketch → Include Library → Add .ZIP Library...**
3. Select the downloaded ZIP file
4. Library will be installed

### Verifying Installation

1. Go to **Sketch → Include Library**
2. You should see all libraries listed:
   - DHT sensor library
   - FastLED
   - Firebase ESP32 Client
   - LiquidCrystal_I2C

### Library Links (for manual download if needed)

- **DHT sensor library:** https://github.com/adafruit/DHT-sensor-library
- **FastLED:** https://github.com/FastLED/FastLED
- **Firebase ESP32 Client:** https://github.com/mobizt/Firebase-ESP32
- **LiquidCrystal_I2C:** https://github.com/johnrickman/LiquidCrystal_I2C

## Troubleshooting

### Problem: Library not found after installation
**Solution:**
- Restart Arduino IDE
- Check if library appears in Sketch → Include Library menu
- Try reinstalling the library

### Problem: Compilation errors about missing libraries
**Solution:**
- Make sure all 4 libraries are installed
- Check library names match exactly
- Restart Arduino IDE

### Problem: Firebase library is very large
**Solution:**
- This is normal, Firebase library is large
- Wait for download to complete
- May take several minutes depending on internet speed

### Problem: ESP32 board not found
**Solution:**
- Install ESP32 board support first (see Prerequisites)
- Restart Arduino IDE after installation
- Select correct board: Tools → Board → ESP32 Arduino → Your ESP32 Board

## Quick Checklist

Before uploading code, verify:
- [ ] ESP32 board support installed
- [ ] DHT sensor library installed
- [ ] FastLED library installed
- [ ] Firebase ESP32 Client installed
- [ ] LiquidCrystal_I2C library installed
- [ ] Correct board selected (Tools → Board)
- [ ] Correct port selected (Tools → Port)
- [ ] WiFi credentials updated in code
- [ ] Firebase credentials updated in code

## Next Steps

After installing libraries:
1. Open `firmware/esp32_smart_home.ino` in Arduino IDE
2. Update WiFi credentials (lines 37-38)
3. Update Firebase credentials (lines 41-42)
4. Select your ESP32 board
5. Select the correct COM port
6. Upload the code

You're ready to go!

