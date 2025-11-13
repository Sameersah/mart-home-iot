# IoT-Based Light Intensity Monitoring System for Food and Beverage Optical Inspection

A real-time IoT monitoring system designed for food and beverage manufacturing facilities to ensure consistent illumination in optical inspection systems. This system continuously tracks light intensity, provides visual alerts, and sends email notifications when illumination drops below safe operational thresholds.

## 🎯 Project Overview

In modern food and beverage manufacturing, automated optical inspection and sorting systems are critical for detecting contaminants, defects, or irregularities in products such as grains, fruits, packaged goods, and beverages. These systems rely on machine vision and imaging sensors that require **consistent illumination** to operate accurately.

**The Problem:**
- Even minor fluctuations in light intensity can lead to false defect detection, missed contaminants, reduced sorting accuracy, and regulatory non-compliance
- Current inspection systems often lack real-time monitoring and feedback for illumination intensity
- Lighting degradation may go unnoticed until sorting accuracy degrades or quality issues arise

**Our Solution:**
An IoT-based Light Intensity Monitoring System that:
- Tracks illumination levels continuously using photoresistor sensors
- Activates RED indicator LED when light drops below threshold (< 1800)
- Sends email alerts to operators/maintenance personnel
- Provides real-time visualization on a web dashboard
- Enables proactive maintenance before inspection processes are compromised

## ✨ Key Features

### Real-Time Monitoring
- **Photoresistor Sensor** - Continuous light intensity measurement (0-4095 ADC range)
- **2-second sampling interval** - High-frequency monitoring for production line environments
- **Real-time data streaming** to Firebase cloud platform

### Visual Alert System
- **RGB LED Indicator** - On-site visual feedback
  - **RED** when light intensity < 1800 (Alert - below threshold)
  - **GREEN** when light intensity ≥ 1800 (Normal operation)
- **Automatic color updates** based on real-time sensor readings

### Email Notifications
- **Automated email alerts** when light drops below threshold (1800)
- **Firebase Cloud Functions** trigger email notifications
- **Recipient**: sameersah7365@gmail.com (configurable)
- **Alert details**: Current light level, previous level, threshold, timestamp

### Web Dashboard
- **Real-time light level display** with status indicators
- **Interactive charts** showing light intensity trends over time
- **Status badges** (Very Dark, Dark, Moderate, Bright, Very Bright)
- **Modern, responsive UI** optimized for production floor monitoring
- **Mobile-friendly** design for remote monitoring

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│   ESP32 Microcontroller            │
│                                     │
│   SENSOR:              ACTUATOR:   │
│   - Photoresistor      - RGB LED    │
│     (GPIO 34)            (GPIO 25/26/27)
│                                     │
│   Logic:                            │
│   - Read light every 2s             │
│   - If light < 1800 → RED LED       │
│   - If light ≥ 1800 → GREEN LED     │
│   - Publish to Firebase             │
└──────────┬──────────────────────────┘
           │
           │ WiFi Connection
           │
┌──────────▼──────────────────────────┐
│   Firebase Realtime Database        │
│                                     │
│   /sensors/                         │
│     - light (0-4095)                │
│     - timestamp                     │
│                                     │
│   Cloud Function:                   │
│     - sendLightAlert                │
│       (triggers on light < 1800)    │
└──────────┬──────────────────────────┘
           │
           │ Real-time Sync
           │
┌──────────▼──────────────────────────┐
│  React.js Web Dashboard             │
│                                     │
│  - Real-time light display          │
│  - Historical trend charts          │
│  - Status indicators                │
│  - Mobile-responsive UI             │
└─────────────────────────────────────┘
```

## 📋 Hardware Requirements

**Essential Components:**
- **ESP32-WROOM-32E Development Board** - Main microcontroller with WiFi
- **Photoresistor (LDR)** - Light intensity sensor
- **10kΩ Resistor** - Voltage divider for photoresistor
- **RGB LED (Common Cathode)** - Visual alert indicator
  - Red: GPIO 25
  - Green: GPIO 26
  - Blue: GPIO 27
- **220Ω Resistors (3x)** - Current limiting for RGB LED
- **Breadboard** - Prototyping platform
- **Jumper Wires** - Component connections
- **USB-C Cable** - Power and programming

**Total Cost**: ~$15-20 (budget-friendly for industrial applications)

## 🚀 Quick Start

### 1. Hardware Setup

**Photoresistor Connection:**
```
Photoresistor leg 1 → 3.3V
Photoresistor leg 2 → Breadboard row (junction)
10kΩ Resistor leg 1 → Same breadboard row (junction)
10kΩ Resistor leg 2 → GND
Wire from junction → GPIO 34
```

**RGB LED Connection:**
```
RGB LED Red → GPIO 25 (with 220Ω resistor)
RGB LED Green → GPIO 26 (with 220Ω resistor)
RGB LED Blue → GPIO 27 (with 220Ω resistor)
RGB LED Common → GND (common cathode)
```

### 2. Firmware Setup

1. Install [Arduino IDE](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install
3. Install required libraries:
   - **Firebase ESP32 Client** (by Mobizt) - For Firebase connectivity
4. Update WiFi credentials in `firmware/esp32_smart_home.ino`:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
5. Update Firebase configuration:
   ```cpp
   #define FIREBASE_HOST "YOUR_PROJECT.firebaseio.com"
   #define FIREBASE_AUTH "YOUR_FIREBASE_AUTH_KEY"
   ```
6. Upload firmware to ESP32

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Realtime Database
3. Set database rules:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Copy Firebase config to `web-dashboard/src/firebase.js`

### 4. Web Dashboard Setup

```bash
cd web-dashboard
npm install
npm start
```

Dashboard will open at `http://localhost:3000`

### 5. Email Notifications Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Install dependencies: `cd functions && npm install`
4. Configure email in `functions/index.js` (Gmail App Password required)
5. Deploy: `firebase deploy --only functions`

See [Email Setup Guide](docs/EMAIL_SETUP.md) for detailed instructions.

## 📁 Project Structure

```
project/
├── firmware/
│   └── esp32_smart_home.ino    # ESP32 firmware for light monitoring
├── functions/
│   ├── index.js                # Firebase Cloud Functions (email alerts)
│   └── package.json
├── web-dashboard/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── SensorCard.jsx  # Light level display card
│   │   │   └── Chart.jsx      # Historical trend chart
│   │   ├── App.js             # Main dashboard application
│   │   └── firebase.js        # Firebase configuration
│   └── package.json
├── docs/                       # Documentation
│   ├── SETUP.md               # Hardware setup guide
│   ├── EMAIL_SETUP.md         # Email notification setup
│   └── ARCHITECTURE.md        # System architecture
├── firebase.json               # Firebase configuration
└── README.md                   # This file
```

## 🎮 Usage

### Monitoring Light Intensity

1. **Real-time Display**: View current light level on the dashboard
2. **Status Indicators**: 
   - Very Dark (< 500)
   - Dark (< 1000)
   - Moderate (< 2000)
   - Bright (< 3000)
   - Very Bright (≥ 3000)
3. **Visual Alert**: RGB LED turns RED when light < 1800
4. **Email Alert**: Automatic notification sent when threshold crossed
5. **Historical Trends**: View light level changes over time on chart

### Alert Threshold

- **Threshold**: 1800 (ADC value, 0-4095 range)
- **Alert Condition**: Light level drops from ≥ 1800 to < 1800
- **Visual Indicator**: RGB LED changes to RED
- **Email Notification**: Sent to configured recipient

## 🔧 Configuration

### Threshold Adjustment

To change the alert threshold, edit `functions/index.js`:

```javascript
// Line 55: Main threshold check
if (newValue < 1800 && previousValue >= 1800) {
  // Change 1800 to your desired threshold
}
```

Also update the RGB LED threshold in `firmware/esp32_smart_home.ino`:

```cpp
// Line 243: RGB LED threshold
if (lightLevel < 1800) {
  setRGBColor(255, 0, 0);  // RED alert
} else {
  setRGBColor(0, 255, 0);  // GREEN normal
}
```

### WiFi Credentials

Update in `firmware/esp32_smart_home.ino`:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### Firebase Configuration

Update in `firmware/esp32_smart_home.ino` and `web-dashboard/src/firebase.js`:
```cpp
#define FIREBASE_HOST "YOUR_PROJECT.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_AUTH_KEY"
```

## 📚 Documentation

- [Hardware Setup Guide](docs/SETUP.md) - Detailed wiring diagrams and pin configurations
- [Architecture Documentation](docs/ARCHITECTURE.md) - System design and data flow
- [Email Setup Guide](docs/EMAIL_SETUP.md) - Email notification configuration
- [Library Setup Guide](docs/LIBRARY_SETUP.md) - Arduino library installation

## 🛠️ Technologies Used

- **Hardware**: ESP32-WROOM-32E, Photoresistor (LDR), RGB LED
- **Firmware**: Arduino Framework (C++)
- **Cloud**: Firebase Realtime Database, Firebase Cloud Functions
- **Backend**: Node.js, Nodemailer (email notifications)
- **Frontend**: React.js, Chart.js
- **Styling**: Modern CSS3 with responsive design

## 🎯 Use Cases

### Food & Beverage Manufacturing
- **Optical Sorting Systems**: Monitor illumination for grain, fruit, vegetable sorting
- **Quality Control**: Ensure consistent lighting for defect detection
- **Packaging Inspection**: Maintain proper lighting for label verification
- **Contaminant Detection**: Critical for food safety compliance

### Benefits
- **Preventive Maintenance**: Catch lighting issues before they affect production
- **Quality Assurance**: Maintain consistent inspection accuracy
- **Regulatory Compliance**: Meet FDA, ISO 22000 requirements
- **Cost Savings**: Reduce false rejects and improve yield
- **Safety**: Early detection of lighting degradation

## 📝 License

This project is for educational purposes.

## 👤 Author

IoT Final Project - CMPE 286

## 🙏 Acknowledgments

- Firebase for cloud infrastructure
- Arduino/ESP32 community for libraries and support
- React and Chart.js communities

---

**Status**: ✅ Production Ready  
**Last Updated**: 2025
