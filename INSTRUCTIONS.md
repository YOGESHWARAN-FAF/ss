# Smart Space Configuration Instructions

## 1. Web Dashboard Setup

This dashboard controls 8 devices (Fans 1-4, Lights 1-4) via ThingSpeak.

### Step 1: Run the Dashboard
1. Open a terminal in the project folder.
2. Run `npm install` (if not done yet).
3. Run `npm run dev`.
4. Open the link (e.g., `http://localhost:5173`).

### Step 2: Configure Settings
1. Click the **Gear/Settings Icon** in the top right of the dashboard.
2. You will see configuration for **Set 1** and **Set 2**.
3. Enter your **ThingSpeak Channel ID**, **Read API Key**, and **Write API Key**.
4. Click **Save**.

The dashboard will now control your specific ThingSpeak channel.

---

## 2. ESP8266 (NodeMCU) Setup

The ESP8266 reads the commands from the same ThingSpeak channel and turns relays ON/OFF.

### Prerequisites
1. **Arduino IDE**: Download and install from [arduino.cc](https://www.arduino.cc/en/software).
2. **ESP8266 Board Support**:
   - In Arduino IDE, go to `File > Preferences`.
   - Add this URL to "Additional Boards Manager URLs": `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Go to `Tools > Board > Boards Manager`, search for `esp8266`, and install.
3. **ThingSpeak Library**:
   - Go to `Sketch > Include Library > Manage Libraries`.
   - Search for `ThingSpeak` by MathWorks.
   - Install the latest version.

### Flashing the Code
1. Navigate to the `arduino/SmartSpaceESP8266` folder in this project.
2. Open `SmartSpaceESP8266.ino` with Arduino IDE.
3. **Edit the Configuration Section** (lines 20-27) with your details:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   unsigned long channelID = 123456;    // YOUR CHANNEL ID
   const char* readAPIKey = "ABCDEF..."; // YOUR READ API KEY
   ```
4. Connect your ESP8266 via USB.
5. Select your board (e.g., "NodeMCU 1.0 (ESP-12E Module)") in `Tools > Board`.
6. Select the correct Port in `Tools > Port`.
7. Click **Upload** (Arrow icon).

---

## 3. Hardware Connections

Connect your 8-Channel Relay Module to the NodeMCU as follows:

| ThingSpeak Field | Device  | NodeMCU Pin | GPIO |
|------------------|---------|-------------|------|
| Field 1          | Fan 1   | D0          | 16   |
| Field 2          | Fan 2   | D1          | 5    |
| Field 3          | Fan 3   | D2          | 4    |
| Field 4          | Fan 4   | D3          | 0    |
| Field 5          | Light 1 | D4          | 2    |
| Field 6          | Light 2 | D5          | 14   |
| Field 7          | Light 3 | D6          | 12   |
| Field 8          | Light 4 | D7          | 13   |

**Note:**
- **Power:** Ensure your Relay Module has external 5V power if all relays are on, as the ESP8266 3.3V pin cannot drive 8 relay coils.
- **Booting:** If Pins D3, D4, or D8 are held in the wrong state during boot (due to relay wiring), the ESP8266 might fail to start. If this happens, disconnect the relays on those pins while plugging in power, then reconnect.
