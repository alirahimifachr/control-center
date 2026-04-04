# Control Center

Personal productivity app. Web + Android + Windows. Angular 21, Supabase, Bootstrap 5.

## Quick Start

```bash
npm install
npx supabase start       # local dev DB (needs Docker)
./run.sh web             # dev server :4200
```

## Commands

| Command                   | Description    |
| ------------------------- | -------------- |
| `./run.sh web`            | Dev server     |
| `./run.sh desktop`        | Electron       |
| `./run.sh android`        | Android deploy |
| `./run.sh stop`           | Stop all       |
| `npm test`                | Vitest         |
| `npx supabase start/stop` | Local Supabase |

## Docs

- [Setup Guide](docs/setup-guide.md) — install, Supabase local/prod, project creation history
- [Cross-Platform Build](docs/cross-platform-build.md) — web, Android, Windows builds
