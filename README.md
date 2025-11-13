# IoT Smart Home Control System

A comprehensive IoT system featuring **bidirectional control** - sensors monitor environment, dashboard displays data, and **actuators respond to user commands** in real-time. Perfect for an interactive, attention-grabbing demo!

## 🎯 Project Overview

This project demonstrates a complete IoT solution with:
- **Real-time sensor monitoring** (temperature, humidity, light)
- **Interactive device control** (RGB LED, relay, buzzer)
- **Beautiful web dashboard** with live visualizations
- **Cloud-based bidirectional communication** using Firebase
- **Professional UI/UX** with smooth animations

## ✨ Features

### Sensors
- 🌡️ **DHT11** - Temperature and humidity monitoring
- 💡 **Photoresistor** - Light level detection

### Actuators
- 🎨 **RGB LED Strip (WS2812B)** - Colorful visual feedback
- ⚡ **Relay Module** - Control devices (fan, lights)
- 🔊 **Buzzer** - Audio feedback
- 📺 **I2C LCD 1602 Display** - Local status display (2 rows × 16 characters)

### Dashboard
- 📊 Real-time charts and graphs
- 🎛️ Interactive control panel
- 📱 Mobile-responsive design
- 🎨 Beautiful modern UI
- ⚡ Instant hardware response

### Notifications
- 📧 **Email Alerts** - Automatic email notifications when light level drops below threshold (1800)
- 🔔 Real-time monitoring via Firebase Cloud Functions

## 🏗️ System Architecture

```
ESP32 (Sensors + Actuators)
    ↕ WiFi
Firebase Realtime Database
    ↕ WebSocket
React.js Dashboard
```

## 📋 Hardware Requirements

See [Hardware Shopping List](PROJECT_PLAN.md#hardware-shopping-list-50-budget---with-actuators) in PROJECT_PLAN.md

**Essential Components (~$50):**
- ESP32 Development Board
- DHT11 Temperature/Humidity Sensor (or DHT22)
- Photoresistor + 10kΩ Resistor
- WS2812B RGB LED Strip (1m, 60 LEDs)
- 5V Relay Module (2-channel)
- Mini DC Fan (5V)
- Buzzer Module
- I2C LCD 1602 Display (2 rows × 16 characters)
- Breadboard, jumper wires, resistors

## 🚀 Quick Start

### 1. Hardware Setup

1. Wire components according to pin definitions in `firmware/esp32_smart_home.ino`
2. Connect ESP32 to computer via USB

### 2. Firmware Setup

1. Install [Arduino IDE](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install
3. Install required libraries:
   - Tools → Manage Libraries → Install:
     - DHT sensor library (by Adafruit)
     - FastLED (by FastLED)
     - Firebase ESP32 Client (by Mobizt)
     - LiquidCrystal_I2C (by Frank de Brabander)
   - See [Library Setup Guide](docs/LIBRARY_SETUP.md) for detailed instructions
4. Update WiFi credentials and Firebase config in `firmware/esp32_smart_home.ino`
5. **Note:** Code is configured for DHT11 and I2C LCD 1602. See [Code Changes](docs/CODE_CHANGES.md) if using different hardware.
6. Upload to ESP32

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

### 5. Email Notifications Setup (Optional)

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
│   └── esp32_smart_home.ino    # ESP32 Arduino code
├── functions/
│   ├── index.js                # Firebase Cloud Functions (email notifications)
│   └── package.json
├── web-dashboard/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.js             # Main app
│   │   └── firebase.js        # Firebase config
│   └── package.json
├── docs/                       # Documentation
├── firebase.json               # Firebase configuration
├── PROJECT_PLAN.md            # Detailed project plan
└── README.md                   # This file
```

## 🎮 Usage

1. **Monitor Sensors**: View real-time temperature, humidity, and light levels
2. **Control LED**: Use color picker or presets to change RGB LED color
3. **Control Devices**: Toggle relay to turn fan/lights on/off
4. **Test Buzzer**: Click buzzer button for audio feedback
5. **View Charts**: See historical data trends

## 📸 Screenshots

_Add screenshots of your dashboard here_

## 🔧 Configuration

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

- [Project Plan](PROJECT_PLAN.md) - Detailed implementation plan
- [Hardware Setup Guide](docs/SETUP.md) - Wiring diagrams and pin configurations
- [Architecture Documentation](docs/ARCHITECTURE.md) - System design
- [Code Changes](docs/CODE_CHANGES.md) - Hardware-specific code modifications
- [Library Setup Guide](docs/LIBRARY_SETUP.md) - Arduino library installation instructions
- [Email Setup Guide](docs/EMAIL_SETUP.md) - Email notification configuration

## 🛠️ Technologies Used

- **Hardware**: ESP32, DHT11, WS2812B, Relay Module, I2C LCD 1602
- **Firmware**: Arduino Framework
- **Cloud**: Firebase Realtime Database, Firebase Cloud Functions
- **Backend**: Node.js, Nodemailer (email notifications)
- **Frontend**: React.js, Chart.js, React Color
- **Styling**: CSS3 with modern design patterns

## 📝 License

This project is for educational purposes.

## 👤 Author

IoT Final Project - CMPE 286

## 🙏 Acknowledgments

- Firebase for cloud infrastructure
- Arduino/ESP32 community for libraries and support
- React and Chart.js communities

---

**Status**: ✅ Implementation in Progress  
**Last Updated**: [Current Date]
