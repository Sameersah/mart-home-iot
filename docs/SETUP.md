# Hardware Setup Guide

## Component List

### Required Components
- ESP32 Development Board (1x)
- DHT22 Temperature & Humidity Sensor (1x)
- Photoresistor (1x)
- 10kΩ Resistor (1x)
- WS2812B RGB LED Strip, 1m, 60 LEDs (1x)
- 5V Relay Module, 2-channel (1x)
- Mini DC Fan, 5V (1x)
- Active Buzzer Module (1x)
- OLED Display, 0.96" I2C (1x)
- Breadboard, 830 tie points (1x)
- Jumper Wires (M-M, M-F) (assorted)
- USB-C Cable (1x)
- 5V Power Supply, 2A (1x)
- Resistor Pack (assorted)

## Pin Connections

### ESP32 Pinout Reference
```
ESP32 Pin Layout:
- GPIO 2: RGB LED Data
- GPIO 4: DHT22 Data
- GPIO 5: Relay Control
- GPIO 18: Buzzer
- GPIO 21: OLED SDA (I2C)
- GPIO 22: OLED SCL (I2C)
- GPIO 34: Light Sensor (ADC - Input Only)
- 3.3V: Sensor Power
- 5V: Relay Power (if needed)
- GND: Common Ground
```

## Wiring Diagram

### DHT22 Temperature/Humidity Sensor
```
DHT22          ESP32
-----          -----
VCC    →       3.3V
DATA   →       GPIO 4
GND    →       GND
(Add 10kΩ pull-up resistor between DATA and 3.3V)
```

### Photoresistor (Light Sensor)
```
Photoresistor + 10kΩ Resistor (Voltage Divider)
-----          -----
One end   →    3.3V
Other end →    GND
            |
            └→ GPIO 34 (ADC)
            (Connect to junction of photoresistor and 10kΩ resistor)
```

### WS2812B RGB LED Strip
```
LED Strip       ESP32
--------        -----
Data    →       GPIO 2
VCC     →       5V (External Power Supply)
GND     →       GND (Common with ESP32)
```

**Important**: LED strip requires external 5V power supply (2A recommended). Connect GND of power supply to ESP32 GND.

### Relay Module
```
Relay Module    ESP32
-----------     -----
IN1     →       GPIO 5
VCC     →       5V (or 3.3V depending on relay module)
GND     →       GND
NO/COM  →       Connect to device (fan, light, etc.)
```

### DC Fan
```
Fan             Relay
---             -----
Positive →      Relay NO (Normally Open)
Negative →      GND
```

### Buzzer
```
Buzzer          ESP32
------          -----
Positive →      GPIO 18
Negative →      GND
```

### OLED Display (I2C)
```
OLED            ESP32
----            -----
VCC     →       3.3V
GND     →       GND
SDA     →       GPIO 21
SCL     →       GPIO 22
```

## Power Requirements

- **ESP32**: 5V via USB or external power supply (500mA minimum)
- **LED Strip**: 5V, 2A external power supply (60 LEDs × ~60mA = ~3.6A at full brightness, but 2A is sufficient for demo)
- **Relay Module**: 5V or 3.3V (check module specifications)
- **Sensors**: 3.3V from ESP32

**Important**: Use a common ground (GND) for all components.

## Assembly Steps

1. **Prepare Breadboard**
   - Place ESP32 on breadboard
   - Connect power rails: 3.3V and GND

2. **Connect Sensors**
   - Wire DHT22 to GPIO 4 with pull-up resistor
   - Wire photoresistor voltage divider to GPIO 34

3. **Connect Actuators**
   - Wire RGB LED data line to GPIO 2
   - Connect LED power to external 5V supply
   - Wire relay control to GPIO 5
   - Connect fan to relay output
   - Wire buzzer to GPIO 18

4. **Connect Display**
   - Wire OLED I2C connections (SDA, SCL)

5. **Power Up**
   - Connect ESP32 to computer via USB
   - Connect LED strip to external power supply
   - Verify all GND connections are common

## Testing

### Test Each Component

1. **DHT22**: Upload test code, check serial monitor for temperature/humidity
2. **Light Sensor**: Cover/uncover sensor, check ADC values
3. **RGB LED**: Send test color commands via Firebase
4. **Relay**: Toggle relay, verify fan turns on/off
5. **Buzzer**: Send buzzer command, verify beep
6. **OLED**: Verify display shows sensor data

### Common Issues

- **LED Strip not working**: Check power supply, verify data pin connection
- **DHT22 reading NaN**: Check wiring, add pull-up resistor
- **Relay not switching**: Verify power supply, check control pin
- **OLED not displaying**: Check I2C address (usually 0x3C), verify SDA/SCL connections

## Safety Notes

- Double-check all connections before powering on
- Ensure proper voltage levels (3.3V vs 5V)
- Use appropriate current ratings for power supplies
- Be careful with relay connections (AC devices require additional safety measures)

