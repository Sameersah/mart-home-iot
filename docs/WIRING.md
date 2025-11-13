# Wiring Reference Guide

## Quick Pin Reference

| Component | ESP32 Pin | Notes |
|-----------|-----------|-------|
| DHT22 Data | GPIO 4 | Requires 10kΩ pull-up to 3.3V |
| DHT22 VCC | 3.3V | |
| DHT22 GND | GND | |
| Light Sensor | GPIO 34 | ADC input only |
| RGB LED Data | GPIO 2 | WS2812B data line |
| RGB LED Power | External 5V | 2A power supply |
| RGB LED GND | GND | Common ground |
| Relay IN | GPIO 5 | Control pin |
| Relay VCC | 5V or 3.3V | Check module specs |
| Relay GND | GND | |
| Buzzer + | GPIO 18 | |
| Buzzer - | GND | |
| OLED VCC | 3.3V | |
| OLED GND | GND | |
| OLED SDA | GPIO 21 | I2C data |
| OLED SCL | GPIO 22 | I2C clock |

## Visual Wiring Layout

```
                    ESP32
        ┌─────────────────────────┐
        │                         │
        │  [GPIO 2]  ←─── RGB LED Data
        │  [GPIO 4]  ←─── DHT22 Data
        │  [GPIO 5]  ←─── Relay IN
        │  [GPIO 18] ←─── Buzzer +
        │  [GPIO 21] ←─── OLED SDA
        │  [GPIO 22] ←─── OLED SCL
        │  [GPIO 34] ←─── Light Sensor
        │  [3.3V]    ←─── Sensors Power
        │  [5V]      ←─── Relay Power
        │  [GND]     ←─── Common Ground
        └─────────────────────────┘
```

## Component-Specific Wiring

### DHT22 Connection
```
3.3V ──┬── DHT22 VCC
       │
       └── 10kΩ Resistor ──┬── DHT22 DATA ── GPIO 4
                            │
                            └── DHT22 GND ── GND
```

### Light Sensor (Voltage Divider)
```
3.3V ── Photoresistor ──┬── GPIO 34 (ADC)
                         │
                         └── 10kΩ Resistor ── GND
```

### Relay Module
```
ESP32 GPIO 5 ── Relay IN
ESP32 5V ── Relay VCC
ESP32 GND ── Relay GND

Relay NO ── Device Positive
Relay COM ── Power Supply +
Device Negative ── Power Supply -
```

### RGB LED Strip
```
External 5V (2A) ── LED Strip VCC
External GND ── LED Strip GND ── ESP32 GND (common)
ESP32 GPIO 2 ── LED Strip Data
```

## Power Distribution

### Power Rails Setup
```
Breadboard Power Rails:
  ┌─────────────┐
  │ 3.3V Rail    │ ← ESP32 3.3V
  │ GND Rail     │ ← ESP32 GND
  │ 5V Rail      │ ← External 5V (for LED)
  └─────────────┘
```

### Common Ground Connection
**CRITICAL**: All components must share a common ground:
- ESP32 GND
- External power supply GND
- All sensor GND connections
- LED strip GND
- Relay module GND

## Breadboard Layout Example

```
    Power Rails          Component Area
┌──────────────┐    ┌──────────────────┐
│ 3.3V │ GND  │    │                  │
│      │      │    │  [ESP32]        │
│      │      │    │                  │
│      │      │    │  [DHT22]         │
│      │      │    │                  │
│      │      │    │  [Relay Module]  │
│      │      │    │                  │
│      │      │    │  [Buzzer]        │
│      │      │    │                  │
│      │      │    │  [OLED]          │
└──────────────┘    └──────────────────┘
```

## Testing Checklist

Before powering on, verify:

- [ ] All GND connections are common
- [ ] DHT22 has pull-up resistor
- [ ] Light sensor voltage divider is correct
- [ ] LED strip has external power supply
- [ ] Relay module power matches specification
- [ ] No short circuits
- [ ] All connections are secure
- [ ] Power supply ratings are correct

## Troubleshooting

### No sensor readings
- Check wiring connections
- Verify power to sensors (3.3V)
- Check pull-up resistor on DHT22
- Verify pin numbers in code

### LED strip not working
- Verify external power supply (5V, 2A)
- Check data pin connection
- Ensure common ground
- Test with single LED first

### Relay not switching
- Verify control pin connection
- Check relay module power (5V or 3.3V)
- Test relay with multimeter
- Verify device connections

### OLED not displaying
- Check I2C connections (SDA, SCL)
- Verify I2C address (usually 0x3C)
- Check power (3.3V)
- Use I2C scanner to find address

