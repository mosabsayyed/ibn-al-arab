# Dev Server Script - AI Assistant Standard

This `dev` script is the **standardized way** for AI assistants to manage development servers across all projects.

## Why This Script Exists

- **Prevents accidentally killing running dev servers** when AI assistants run terminal commands
- **Standardizes dev server management** across all projects
- **Provides safe background process handling** with nohup and proper logging
- **Auto-detects package managers** (pnpm, yarn, npm)

## How AI Assistants Should Use This

### ✅ **ALWAYS use this script instead of:**
```bash
# ❌ DON'T do this - kills running servers
pnpm dev --port 8080 &
npm run dev

# ❌ DON'T do this - interferes with running processes  
pkill -f vite
killall node
```

### ✅ **ALWAYS do this instead:**
```bash
# ✅ Safe way to start dev server
./dev

# ✅ Safe way to check status
./dev status

# ✅ Safe way to stop server
./dev stop

# ✅ Safe way to view logs
./dev logs
```

## Script Features

- **Background execution** with `nohup` - survives terminal disconnects
- **PID tracking** - saves process ID for management
- **Port conflict detection** - warns if server already running
- **Package manager auto-detection** - works with pnpm/yarn/npm
- **Custom port support** - `DEV_PORT=3000 ./dev`
- **Comprehensive logging** - all output goes to `dev.log`

## Commands

```bash
./dev              # Start dev server
./dev status       # Check if running
./dev stop         # Stop dev server
./dev logs         # View logs (tail -f dev.log)
DEV_PORT=3000 ./dev  # Start on custom port
```

## Files Created

- `.dev.pid` - Contains the process ID of running server
- `dev.log` - Contains all server output/logs

## For AI Assistants: Protocol

1. **Before running any terminal commands** that might affect processes:
   - Check `./dev status` first
   - If server is running, ask user permission before stopping

2. **To start dev server safely:**
   - Use `./dev` instead of direct package manager commands
   - This prevents conflicts and accidental server killing

3. **Never use** `pkill`, `killall`, or similar commands that might kill user processes

## Example Workflow

```bash
# Check current status
./dev status

# Start server safely
./dev

# Do your work...
# Run commands, make changes, etc.

# Check logs if needed
./dev logs

# Stop when done
./dev stop
```

This script should be created in **every project** by AI assistants to ensure safe development server management.
