# GC Helper Tool 🚀

A specialized utility for Galactic Conquest players to automate repetitive tasks like ship building and colony clustering.

## ✨ Features

- **Draggable UI Overlay:** A sleek, dark-themed panel that remembers its position on your screen.
- **Global Colony Clustering:** Upgrade your bottom 5 colonies into Level 1, 2, or 3 clusters from **any page** via background POST requests.
- **Ship Construction Presets:**
  - **Save:** Configure your build on the ship page and **Right-Click** a preset button (P1-P5) to save.
  - **Execute:** Click a button to build the saved fleet instantly.
  - **Smart Tooltips:** Hover over a button to see exactly what ships are stored in that preset.
- **Session Auto-Sync:** Automatically detects your Session ID (SID) to ensure links never break.
- **Navigation Shortcuts:** Quick access to Command, Build, Fleet Management, and Rankings.

## 🛠 Installation

1. **Clone/Download** this repository to your local machine.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the folder containing these files.
6. Refresh your Galactic Conquest game tab.

## 🎮 How to Use

### Clustering Colonies
Click **Upgrade Lvl 1, 2, or 3**. The status indicator will show `⏳ Upgrading...`. Once finished, the tool will display a success message and refresh the page to update your stats.

### Managing Presets
1. Navigate to the **Build Ships** page.
2. Enter the desired quantities for your fleet.
3. **Right-Click** a preset button (e.g., `P1`). The button will turn **Green** if successful.
4. From any page, **Left-Click** that button to build that exact fleet configuration again.

## 📝 Technical Notes
- **Language:** JavaScript (Vanilla)
- **Permissions:** Uses `chrome.storage.local` to persist UI position and ship presets across sessions.
- **Compatibility:** Built for Chrome Manifest V3.

---
*Disclaimer: This tool is a third-party helper. Use in accordance with the game's Terms of Service.*
