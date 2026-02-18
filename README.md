# Chefyai Mobile App

## Setup & Running

This project is a **React Native CLI** project.

### 🚀 Quick Start (Windows)

I have created batch scripts in the root folder for you:

1. **Run on Android**: Double-click `run-android.bat` (or run `.\run-android.bat` in terminal).
2. **Start Metro**: Double-click `start-metro.bat` (or run `.\start-metro.bat` in terminal).

### 🛠 Manual Commands

If you prefer running commands manually, you **must** navigate to the `Chefyai` folder first:

```powershell
cd Chefyai
```

Then run:

- **Start Bundler**: `npm start`
- **Run Android**: `npm run android`

### 🔧 Troubleshooting

- **Powershell Policy Errors**: If you see red text about scripts being disabled, run this command in PowerShell as Admin:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- **Emulator**: Ensure you have an Android Emulator running in Android Studio before running `npm run android`.
