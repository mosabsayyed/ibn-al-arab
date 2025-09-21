# System Patterns

## Architectural Patterns

- Pattern 1: Description

## Design Patterns

- Pattern 1: Description

## Common Idioms

- Idiom 1: Description

## Dev Server Port Management Protocol

Always use port 8080 for development to match Supabase configuration. Before starting new servers: 1) Kill existing processes with `pkill -f "vite"`, 2) Verify ports are free, 3) Start server with `pnpm dev --port 8080`, 4) Never allow port auto-switching that leads to localhost:8081, 8082, etc.

### Examples

- pkill -f vite && pnpm dev --port 8080
- Always check lsof -i :8080 before starting
- Use --host 0.0.0.0 for network access if needed


## Dev Server Management Protocol

Universal dev server management script provides safe, non-destructive server lifecycle management with PID tracking, background execution, and clear user feedback. Prevents AI assistants from accidentally killing user processes.


## Supabase Authentication Headers

Supabase v2 authentication requires only 'apikey' header for REST API calls. Do not send 'Authorization: Bearer <token>' headers as they cause 401 errors. Use custom fetch function to intercept and modify headers if needed.
