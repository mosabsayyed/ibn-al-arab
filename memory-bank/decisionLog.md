# Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-09-20 | Assessed rewrite vs. repair approach for corrupted codebase | Codebase analysis reveals 27 core files (1,723 lines) of actual business logic excluding UI library. Most corruption is isolated to meals.ts data file. Clean rewrite would be overkill given small scope and localized damage. |
| 2025-09-20 | Configured Supabase client to send only 'apikey' header instead of both 'apikey' and 'Authorization' headers for authentication requests | Testing revealed that Supabase v2 requires only the apikey header for authentication. Sending both headers was causing 401 errors. This simplifies the authentication flow and prevents header conflicts. |
| 2025-09-20 | Created universal dev server management script with start/stop/status/logs commands to prevent AI assistants from accidentally killing user processes | AI assistants frequently run terminal commands that kill running dev servers. This script provides safe, non-destructive server management with proper PID tracking, background execution, and clear user feedback. Includes package manager auto-detection and port conflict detection. |
