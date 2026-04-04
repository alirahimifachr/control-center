# Cross-Platform Build

One Angular build → `dist/control-center/browser/` → served by Web, Capacitor WebView, or Electron BrowserWindow.

## Detection

Electron: `window.myAppDesktop` · Capacitor: `Capacitor.isNativePlatform()` · Web: fallback

## Builds

- **Web**: serve `dist/` directly
- **Android**: `npm run build && npx cap sync && cd android && ./gradlew assembleDebug`
- **Windows**: `npm run build && npm run desktop:dist:win`

Platform-specific code stays in services behind interfaces. Everything else is platform-agnostic Angular.
