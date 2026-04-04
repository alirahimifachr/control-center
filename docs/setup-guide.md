# Setup Guide

## Prerequisites

- Node.js, npm
- Docker (for local Supabase)

## Install

```bash
npm install
```

## Supabase

### Local (dev)

```bash
npx supabase init          # first time only
npx supabase start         # starts local Postgres, Auth, Storage via Docker
npx supabase db pull       # pull schema from cloud (optional)
npx supabase stop          # stop containers
```

Output gives you local URL + keys. Copy the example and fill in your keys:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Then set `supabaseUrl` and `supabaseAnonKey` from the `supabase start` output.

Local Studio dashboard: `http://127.0.0.1:54323`

### Production

Configure in `src/environments/environment.prod.ts` with your Supabase cloud project URL and anon key.

## How This Project Was Created

```bash
ng new control-center --style=scss --ssr=false
npm install bootstrap bootstrap-icons @ng-bootstrap/ng-bootstrap
npm install @supabase/supabase-js
npm install -D vitest jsdom prettier
```

`angular.json` styles: `bootstrap.min.css`, `bootstrap-icons.css`, `styles.scss`. Scripts: `bootstrap.bundle.min.js`. Test builder: `@angular/build:unit-test`.

### Capacitor (Android)

```bash
npm install @capacitor/core @capacitor/android @capacitor/app @capacitor/filesystem
npm install -D @capacitor/cli
npx cap init control-center com.controlcenter.app --web-dir dist/control-center/browser
npx cap add android
```

Android SDK (WSL): Java 21, `sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"`.

### Electron (Windows)

```bash
npm install -D electron electron-builder concurrently wait-on
```

Entry: `electron/main.cjs` + `electron/preload.cjs`. Config: `electron-builder.yml`.
