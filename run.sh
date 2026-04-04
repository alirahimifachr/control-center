#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APK_PATH="$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

usage() {
  cat <<'EOF'
Usage:
  run web            Run web dev server (port 4200)
  run desktop        Run Electron desktop app
  run android        Deploy Android with live reload
  run stop           Stop dev processes and free port 4200
  run build:apk      Build standalone Android APK
  run build:linux    Build Linux AppImage
EOF
}

port_4200_in_use() {
  lsof -i :4200 >/dev/null 2>&1
}

ensure_web_server() {
  if ! port_4200_in_use; then
    echo "Starting web server in background..."
    cd "$ROOT_DIR"
    npm start -- --host 0.0.0.0 --port 4200 &
    npx wait-on http://localhost:4200
  fi
}

ensure_supabase() {
  echo "Starting Supabase..."
  cd "$ROOT_DIR"
  npx supabase start
}

stop_all() {
  if [ -f "$ROOT_DIR/src/environments/environment.ts.orig" ]; then
    mv "$ROOT_DIR/src/environments/environment.ts.orig" "$ROOT_DIR/src/environments/environment.ts"
  fi
  npx supabase stop >/dev/null 2>&1 || true
  pkill -f "ng serve" >/dev/null 2>&1 || true
  pkill -f "wait-on http://localhost:4200" >/dev/null 2>&1 || true
  pkill -f "node_modules/electron/dist/electron" >/dev/null 2>&1 || true
  pkill -f "electron ." >/dev/null 2>&1 || true
  if command -v fuser >/dev/null 2>&1; then
    fuser -k 4200/tcp >/dev/null 2>&1 || true
  fi
}

android_deploy() {
  local ip
  ip="$(hostname -I 2>/dev/null | awk '{print $1}')"

  # Patch Supabase URL for Android (127.0.0.1 = device, not host)
  cp "$ROOT_DIR/src/environments/environment.ts" "$ROOT_DIR/src/environments/environment.ts.orig"
  sed -i "s|http://127.0.0.1:54321|http://${ip}:54321|g" "$ROOT_DIR/src/environments/environment.ts"

  ensure_web_server
  echo "Live reload: http://${ip}:4200"
  cd "$ROOT_DIR"
  CAP_DEV_URL="http://${ip}:4200" npx cap sync android
  cd "$ROOT_DIR/android" && ./gradlew assembleDebug
  adb install -r "$APK_PATH"
  adb shell monkey -p com.controlcenter.app -c android.intent.category.LAUNCHER 1
}

build_apk() {
  cd "$ROOT_DIR"
  npx ng build --base-href ./
  npx cap sync android
  cd "$ROOT_DIR/android" && ./gradlew assembleDebug
  echo ""
  echo "APK ready: $APK_PATH"
}

build_linux() {
  cd "$ROOT_DIR"
  npx ng build --base-href ./
  npm run desktop:dist
  echo ""
  echo "AppImage ready in: $ROOT_DIR/release/"
}

case "${1:-}" in
  web)
    ensure_supabase
    cd "$ROOT_DIR"
    exec npm start -- --host 0.0.0.0 --port 4200
    ;;
  desktop)
    ensure_web_server
    cd "$ROOT_DIR"
    exec npm run electron:start
    ;;
  android)
    android_deploy
    ;;
  build:apk)
    build_apk
    ;;
  build:linux)
    build_linux
    ;;
  stop)
    stop_all
    ;;
  help|--help|-h|"")
    usage
    ;;
  *)
    echo "Unknown command: ${1}" >&2
    usage
    exit 1
    ;;
esac
