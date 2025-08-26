# 🚗 Smart Car Parking System  

🏆 **Winner of College Tech Fest 2025**  

A real-time **Smart Car Parking System** that integrates **Arduino (IR Sensors)** with **Three.js 3D visualization**.  
Using the **Web Serial API**, our system communicates live with the Arduino board, updating the **parking model in the browser** whenever a car enters or leaves.  

---

## ✨ Features  
- 🔧 **IR Sensors + Arduino** for car detection  
- 🌐 **Web Serial API** → Direct browser-to-Arduino communication (no external server needed)  
- 🖼️ **3D Parking Lot Model with Three.js**  
- 📊 **Live Slot Updates** → Occupied / Free shown in real time  
- 🏆 **Winner of our College Tech Fest 2025**  

---

## 🛠️ Tech Stack  
- **Frontend:** Three.js, HTML, CSS, JavaScript  
- **Hardware:** Arduino Uno + IR Sensors  
- **Communication:** Web Serial API (Browser ↔ Arduino)  

---

## ⚙️ How It Works  
1. **IR Sensors** detect whether a car is present in a slot.  
2. Arduino processes sensor signals.  
3. Via the **Web Serial API**, data is sent directly to the browser.  
4. The **3D model in Three.js** updates instantly to show the current status.  
