# Color Picker - Simple, Fast & Privacy-First 🎨

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ieeiahhjkjfmgmokejcehfblhemegicl?style=flat-square&color=4f46e5)](https://chromewebstore.google.com/detail/color-picker-simple-fast/ieeiahhjkjfmgmokejcehfblhemegicl)
[![License](https://img.shields.io/github/license/your-username/color-picker?style=flat-square&color=7c3aed)](LICENSE)

A minimalist, high-performance, and **100% privacy-first** browser extension for developers and designers to pick colors from any webpage instantly. Built entirely with Vanilla JS, HTML, and CSS (no heavy frameworks, zero dependencies).

Official website and more tools: [heretool.com](https://heretool.com)

[简体中文](./README.zh-CN.md) | [Chrome Web Store](https://chromewebstore.google.com/detail/color-picker-simple-fast/ieeiahhjkjfmgmokejcehfblhemegicl)

---

## ✨ Features

* **Instant Color Picking:** Harnesses the native `EyeDropper` API for precision pixel color selection.
* **Smart Fallback:** Automated script injection fallback ensuring seamless picking on older pages or specific frames.
* **Format Variety:** One-click copying for **HEX**, **RGB**, and **HSL** formats.
* **Auto-Copy & Intelligent Smart UI:** Copies HEX to clipboard immediately after picking. Contrast text adjusts dynamically based on the color's luminance.
* **Color History:** Persist and preview up to your last 16 picked colors via `chrome.storage.local`.
* **Privacy-First:** 100% client-side operation. Zero tracking codes, zero external analytics scripts, zero database uploads. Powered securely alongside tools on [heretool.com](https://heretool.com).

## 🚀 Installation

### Official Web Stores
* **Chrome / Chromium:** [Install from Chrome Web Store](https://chromewebstore.google.com/detail/color-picker-simple-fast/ieeiahhjkjfmgmokejcehfblhemegicl)

### Developer Mode (Local Install)
1. Clone or download this repository.
2. Open your browser and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root directory containing `manifest.json`.

## 🛠️ Architecture & Tech Stack

This project is curated for extreme performance and absolute simplicity:
* **UI Style:** Modern minimalist interface with a hint of clean, subtle shadows.
* **Core:** Vanilla JavaScript (`Manifest V3`).
* **Permissions Used:**
  * `activeTab`: To inject the color picker interaction safely on user command.
  * `scripting`: Required for robust fallback eye-dropper functionality.
  * `storage`: Locally caches color history securely within your browser profile.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Maintained by the team at [heretool.com](https://heretool.com).*