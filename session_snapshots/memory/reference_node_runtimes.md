---
name: Node.js runtime locations on this PC
description: System node not in PATH; use bun or LM Studio's bundled node for JS/TS execution
type: reference
originSessionId: 6d056bc2-1444-43e6-921c-39ae15de982f
---
This Windows PC does NOT have system Node.js installed. The `node` command is not in PATH and `C:\Program Files\nodejs` is missing. To run JavaScript/TypeScript files outside of an npm project context, use one of:

- **Bun** at `C:\Users\user\.bun\bin\bun.exe` — preferred (fast, runs TS natively, OpenAI-compatible)
  - Run JS: `"C:/Users/user/.bun/bin/bun.exe" run script.mjs`
  - Run TS: `"C:/Users/user/.bun/bin/bun.exe" run script.ts`
- **LM Studio's bundled Node** at `C:\Users\user\.lmstudio\.internal\utils\node.exe` — fallback for plain JS

`/c/Users/user/.bun/bin` is already in PATH (visible via `echo $PATH` in Git Bash) so plain `bun` works in the Bash tool.

Suno Helper (Next.js project at `D:\Develop\suno-helper`) currently has no `node_modules` installed locally — running `next dev` would require either `bun install` or installing Node.js first.
