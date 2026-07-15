---
name: Plugin code edits need full session restart, not /reload-plugins
description: After modifying a cached plugin's source (e.g., server.ts), /reload-plugins is unreliable — recommend full session exit/restart
type: feedback
originSessionId: 17102dda-ea2c-4f31-9ede-37485de66407
---
If you've edited a cached plugin's source file (e.g., `~/.claude/plugins/cache/.../server.ts`), do NOT trust `/reload-plugins` to pick up the changes — recommend the user fully exit (`exit` / Ctrl+D) and restart the `claude` session instead.

**Why:** Observed in this project — patched the Discord plugin's `server.ts` to add a 4th button, ran `/reload-plugins`, but the bot kept serving the pre-edit button layout. Verified via `grep` that the source file had the new code, yet Discord still showed the old button row. The MCP server process likely wasn't fully killed by the reload, or some module-level cache survived. Full session restart fixed it.

**How to apply:**
- After any change to plugin source files, tell the user the verification path is "exit and re-`claude`," not `/reload-plugins`
- Before suggesting restart, do a quick handoff: list saved files, point at long-running services that survive (ComfyUI was on a separate process and kept running fine), and give the user the exact phrase to resume in the new session
- Don't waste time debugging "why didn't reload work" — just hand off and continue
