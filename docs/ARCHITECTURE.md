# System Architecture

## Overview

The IoT Smart Home Control System uses a three-tier architecture:

1. **Hardware Layer**: ESP32 with sensors and actuators
2. **Cloud Layer**: Firebase Realtime Database
3. **Presentation Layer**: React.js web dashboard

## Architecture Diagram

```
┌─────────────────────────────────────┐
│   ESP32 Node (Sensor + Actuator)    │
│                                     │
│  SENSORS:              ACTUATORS:   │
│  - DHT22 (Temp/Hum)    - RGB LED    │
│  - Light Sensor        - Relay      │
│                        - Buzzer     │
│                        - OLED       │
│                        - DC Fan     │
└──────────┬──────────────────────────┘
           │
           │ WiFi (Bidirectional)
           │ ↑ Sensor Data
           │ ↓ Control Commands
           │
┌──────────▼──────────────────────────┐
│   Firebase Realtime Database       │
│                                     │
│   /sensors/                         │
│     - temperature: float            │
│     - humidity: float               │
│     - light: int                    │
│     - timestamp: int                │
│                                     │
│   /controls/                        │
│     - led_color: string (#RRGGBB)   │
│     - led_brightness: int (0-100)   │
│     - relay_state: bool             │
│     - buzzer: bool                  │
└──────────┬──────────────────────────┘
           │
           │ Real-time Sync (WebSocket)
           │
┌──────────▼──────────────────────────┐
│  React.js Web Dashboard            │
│                                     │
│  DISPLAY:              CONTROL:    │
│  - Sensor Cards        - LED Color  │
│  - Gauges              - Brightness │
│  - Charts              - Relay Toggle│
│  - Statistics          - Buzzer     │
└─────────────────────────────────────┘
```

## Data Flow

### Sensor Data Flow (ESP32 → Cloud → Dashboard)

1. **ESP32 reads sensors** (every 2 seconds)
   - DHT22: Temperature, Humidity
   - Photoresistor: Light level (ADC)

2. **ESP32 publishes to Firebase**
   - Path: `/sensors/temperature`
   - Path: `/sensors/humidity`
   - Path: `/sensors/light`
   - Path: `/sensors/timestamp`

3. **Firebase Realtime Database** stores data

4. **React Dashboard** listens to Firebase
   - Uses `onValue()` listener
   - Updates UI in real-time
   - Updates charts with new data points

### Control Command Flow (Dashboard → Cloud → ESP32)

1. **User interacts with dashboard**
   - Changes LED color
   - Adjusts brightness
   - Toggles relay
   - Clicks buzzer

2. **Dashboard writes to Firebase**
   - Path: `/controls/led_color`
   - Path: `/controls/led_brightness`
   - Path: `/controls/relay_state`
   - Path: `/controls/buzzer`

3. **ESP32 polls Firebase** (every 0.5 seconds)
   - Reads control values
   - Compares with current state
   - Updates actuators if changed

4. **Actuators respond**
   - LED changes color/brightness
   - Relay switches on/off
   - Buzzer beeps
   - OLED updates display

## Component Details

### ESP32 Firmware

**Main Loop:**
- Read sensors (2s interval)
- Publish sensor data to Firebase
- Check control commands (0.5s interval)
- Update actuators
- Update OLED display

**Libraries Used:**
- `WiFi.h` - WiFi connectivity
- `FirebaseESP32.h` - Firebase client
- `DHT.h` - DHT22 sensor
- `FastLED.h` - WS2812B LED control
- `Adafruit_SSD1306.h` - OLED display

### Firebase Realtime Database

**Structure:**
```json
{
  "sensors": {
    "temperature": 23.5,
    "humidity": 45.2,
    "light": 2048,
    "timestamp": 1234567890
  },
  "controls": {
    "led_color": "#FF0000",
    "led_brightness": 100,
    "relay_state": false,
    "buzzer": false
  }
}
```

**Security Rules:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

*Note: For production, implement proper authentication and rules.*

### React Dashboard

**Components:**
- `App.js` - Main application component
- `SensorCard.jsx` - Display sensor values
- `Chart.jsx` - Real-time line charts
- `Gauge.jsx` - Circular gauge meters
- `LEDControl.jsx` - RGB LED color/brightness control
- `DeviceControl.jsx` - Relay and buzzer controls

**State Management:**
- Local React state for sensor data
- Firebase listeners for real-time updates
- Direct Firebase writes for control commands

## Communication Protocols

### WiFi
- **Protocol**: IEEE 802.11 (WiFi)
- **Security**: WPA2
- **Frequency**: 2.4 GHz
- **Range**: ~30-50m indoors

### Firebase Realtime Database
- **Protocol**: WebSocket over HTTPS
- **Latency**: < 100ms typical
- **Reliability**: Automatic reconnection
- **Security**: Authentication-based (configured)

## Timing Considerations

- **Sensor Reading**: 2 seconds (DHT22 requires ~2s between readings)
- **Control Polling**: 0.5 seconds (for responsive control)
- **Dashboard Updates**: Real-time (Firebase push notifications)
- **Chart Updates**: Every new data point (2s intervals)

## Scalability

### Current Design
- Single ESP32 node
- Single dashboard instance
- Suitable for demo/personal use

### Potential Enhancements
- Multiple ESP32 nodes (different rooms)
- User authentication
- Historical data storage
- Mobile app
- MQTT broker for local network
- Edge computing for local automation

## Error Handling

### ESP32
- WiFi reconnection on disconnect
- Firebase reconnection logic
- Sensor error detection (NaN checks)
- Graceful degradation if components fail

### Dashboard
- Connection status indicator
- Error messages for failed operations
- Fallback values if data unavailable
- Retry logic for Firebase operations

## Security Considerations

### Current Implementation
- Open read/write (for demo purposes)
- WiFi password protection
- Firebase project isolation

### Production Recommendations
- Implement Firebase Authentication
- Use Firebase Security Rules
- Encrypt sensitive data
- Use HTTPS for all communications
- Implement rate limiting

## Performance Metrics

- **Sensor Update Rate**: 0.5 Hz (every 2 seconds)
- **Control Response Time**: < 1 second
- **Dashboard Latency**: < 100ms (Firebase real-time)
- **Memory Usage**: 
  - ESP32: ~40% (with all libraries)
  - Dashboard: ~50MB (React app)

## Future Enhancements

1. **Local Automation**: Rule-based automation on ESP32
2. **Historical Storage**: Cloud Functions to store historical data
3. **Mobile App**: React Native version
4. **Multi-Node Support**: Multiple ESP32 nodes
5. **ML Integration**: Predictive analytics
6. **Voice Control**: Integration with voice assistants

