# Control Center

Angular 21 · TS 5.9 strict · Bootstrap 5 · Capacitor 8 · Electron · Vitest · Supabase

## Commands

`./run.sh web` · `./run.sh desktop` · `./run.sh android` · `./run.sh stop` · `npm test`

## Rules

- Zoneless, standalone. Use `signal()`, `computed()`, `linkedSignal()`, `effect()`, `resource()`, signal-forms, `@if`/`@for`/`@let`. No NgModules, no constructors, no Zone.js, no `any`.
- Supabase is the sole data store.
- Bootstrap utilities first. Custom CSS only as last resort.
- Use `ng g` for new components/services/pipes. Never create Angular files manually.
- Secrets in `src/environments/`, never committed.
- No build/packaging unless asked. No scope creep.
- Features import from core/ and shared/, never from other features.
- Always use best practices and well-known approaches. No clever shortcuts or obscure patterns.
