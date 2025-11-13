# Hardware Setup Guide - Light Intensity Monitoring System

## Component List

### Required Components for Optical Inspection Monitoring

| Component | Quantity | Purpose |
|-----------|----------|---------|
| **ESP32-WROOM-32E Development Board** | 1 | Main microcontroller with WiFi |
| **Photoresistor (LDR)** | 1 | Light intensity sensor |
| **10kΩ Resistor** | 1 | Voltage divider for photoresistor |
| **RGB LED (Common Cathode)** | 1 | Visual alert indicator |
| **220Ω Resistors** | 3 | Current limiting for RGB LED |
| **Breadboard (830 tie points)** | 1 | Prototyping platform |
| **Jumper Wires (M-M, M-F)** | 1 pack | Component connections |
| **USB-C Cable** | 1 | Power and programming |

**Total Cost**: ~$15-20 (budget-friendly for industrial deployment)

## Pin Connections

### ESP32 Pinout Reference
```
ESP32 Pin Layout:
- GPIO 25: RGB LED Red (with 220Ω resistor)
- GPIO 26: RGB LED Green (with 220Ω resistor)
- GPIO 27: RGB LED Blue (with 220Ω resistor)
- GPIO 34: Light Sensor (ADC - Input Only)
- 3.3V: Sensor Power
- GND: Common Ground
```

## Wiring Diagram

### Photoresistor (Light Sensor) - Voltage Divider Circuit

```
Photoresistor + 10kΩ Resistor (Voltage Divider)
-----          -----
One end   →    3.3V
Other end →    GND
            |
            └→ GPIO 34 (ADC)
            (Connect to junction of photoresistor and 10kΩ resistor)
```

**Detailed Connection:**
1. Connect one leg of photoresistor to **3.3V** rail on breadboard
2. Connect other leg of photoresistor to a breadboard row (junction point)
3. Connect one leg of **10kΩ resistor** to the same breadboard row (junction)
4. Connect other leg of **10kΩ resistor** to **GND** rail
5. Connect a jumper wire from the junction point to **GPIO 34** on ESP32

**How it works:**
- Photoresistor resistance decreases with more light
- Voltage divider creates analog voltage proportional to light
- ESP32 ADC reads voltage (0-3.3V) and converts to digital (0-4095)

### RGB LED (Alert Indicator)

```
RGB LED          ESP32
------           -----
Red    →         GPIO 25 (with 220Ω resistor)
Green  →         GPIO 26 (with 220Ω resistor)
Blue   →         GPIO 27 (with 220Ω resistor)
Common →         GND (common cathode)
```

**Detailed Connection:**
1. Connect **Red** pin of RGB LED to **GPIO 25** through a **220Ω resistor**
2. Connect **Green** pin of RGB LED to **GPIO 26** through a **220Ω resistor**
3. Connect **Blue** pin of RGB LED to **GPIO 27** through a **220Ω resistor**
4. Connect **Common (Cathode)** pin to **GND**

**Alert Behavior:**
- **RED** when light < 1800 (Alert - below threshold)
- **GREEN** when light ≥ 1800 (Normal operation)

## Power Requirements

- **ESP32**: 5V via USB-C cable (500mA minimum)
- **Photoresistor**: 3.3V from ESP32 (minimal current)
- **RGB LED**: 3.3V from ESP32 via PWM (controlled current)

**Important**: Use a common ground (GND) for all components.

## Assembly Steps

### Step 1: Prepare Breadboard
1. Place ESP32 on breadboard
2. Connect power rails: 3.3V and GND from ESP32 to breadboard rails

### Step 2: Connect Light Sensor
1. Wire photoresistor voltage divider circuit
2. Connect junction to GPIO 34 (ADC input)
3. Verify connections: 3.3V → Photoresistor → Junction → GPIO 34
4. Verify: Junction → 10kΩ Resistor → GND

### Step 3: Connect RGB LED
1. Wire RGB LED Red to GPIO 25 (with 220Ω resistor)
2. Wire RGB LED Green to GPIO 26 (with 220Ω resistor)
3. Wire RGB LED Blue to GPIO 27 (with 220Ω resistor)
4. Connect RGB LED Common to GND

### Step 4: Power Up
1. Connect ESP32 to computer via USB-C
2. Verify all GND connections are common
3. Check that RGB LED is properly connected (common cathode)

## Testing

### Test Light Sensor
1. Upload firmware to ESP32
2. Open Serial Monitor (115200 baud)
3. Cover/uncover photoresistor
4. Observe ADC values changing (0-4095 range)
5. Verify values increase with more light

### Test RGB LED
1. System automatically tests LED on startup
2. Should cycle: RED → GREEN → BLUE → WHITE → OFF
3. During operation:
   - Cover photoresistor (light < 1800) → LED turns RED
   - Uncover photoresistor (light ≥ 1800) → LED turns GREEN

### Test Firebase Connection
1. Check Serial Monitor for WiFi connection status
2. Verify Firebase connection messages
3. Check Firebase Console → Realtime Database
4. Verify `/sensors/light` updates every 2 seconds

### Test Alert System
1. Cover photoresistor to drop light below 1800
2. Verify RGB LED turns RED
3. Check email inbox for alert notification
4. Uncover photoresistor (light ≥ 1800)
5. Verify RGB LED turns GREEN

## Common Issues

### Light Sensor Reading 0 or Constant Value
- **Check wiring**: Verify voltage divider circuit connections
- **Check power**: Ensure 3.3V rail is connected
- **Check ADC pin**: Verify GPIO 34 connection
- **Test with multimeter**: Measure voltage at junction (should vary with light)

### RGB LED Not Working
- **Check common pin**: Verify common cathode connected to GND
- **Check resistors**: Ensure 220Ω resistors are in series with each color
- **Check PWM pins**: Verify GPIO 25/26/27 connections
- **Test individually**: Try setting each color separately

### WiFi Connection Failed
- **Check credentials**: Verify SSID and password in code
- **Check signal strength**: Ensure ESP32 is within WiFi range
- **Check network**: Verify WiFi network allows IoT devices
- **Check Serial Monitor**: Look for specific error messages

### Firebase Connection Failed
- **Check credentials**: Verify FIREBASE_HOST and FIREBASE_AUTH
- **Check database rules**: Ensure read/write permissions are set
- **Check internet**: Verify ESP32 has internet connectivity
- **Check Serial Monitor**: Look for Firebase error messages

## Safety Notes

- Double-check all connections before powering on
- Ensure proper voltage levels (3.3V for sensors, not 5V)
- Use appropriate current ratings for resistors
- Verify common ground connections
- Do not exceed ESP32 GPIO current limits (40mA per pin)

## Deployment Considerations

### Production Environment
- **Mounting**: Secure ESP32 and sensors near inspection system
- **Protection**: Consider enclosure for dust/moisture protection
- **Power**: Use reliable power source (USB power adapter or dedicated supply)
- **Network**: Connect to production floor WiFi network
- **Calibration**: Adjust threshold (1800) based on actual lighting conditions

### Maintenance
- **Regular checks**: Verify sensor readings weekly
- **Cleaning**: Clean photoresistor surface if dust accumulates
- **Calibration**: Recalibrate threshold if lighting system changes
- **Logs**: Monitor Firebase logs for connection issues

---

**Last Updated**: 2025
