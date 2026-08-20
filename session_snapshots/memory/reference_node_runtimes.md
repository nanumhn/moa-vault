---
name: Node.js runtime locations on this PC
description: node v24+npm 11 설치됨(2026-08-20 정정). bun/LM Studio node는 대안으로 유효
type: reference
originSessionId: 6d056bc2-1444-43e6-921c-39ae15de982f
---
**★2026-08-20 정정: 시스템 Node.js가 이제 설치돼 있다.** `node -v` = v24.18.0, `npm -v` = 11.16.0 (둘 다 PATH에 잡힘). 아래 서술은 그 이전 상태다 — `npm install -g ...` 같은 지시를 보고 미리 포기하지 말 것.

~~This Windows PC does NOT have system Node.js installed.~~ The `node` command is not in PATH and `C:\Program Files\nodejs` is missing. To run JavaScript/TypeScript files outside of an npm project context, use one of:

- **Bun** at `C:\Users\user\.bun\bin\bun.exe` — preferred (fast, runs TS natively, OpenAI-compatible)
  - Run JS: `"C:/Users/user/.bun/bin/bun.exe" run script.mjs`
  - Run TS: `"C:/Users/user/.bun/bin/bun.exe" run script.ts`
- **LM Studio's bundled Node** at `C:\Users\user\.lmstudio\.internal\utils\node.exe` — fallback for plain JS

`/c/Users/user/.bun/bin` is already in PATH (visible via `echo $PATH` in Git Bash) so plain `bun` works in the Bash tool.

Suno Helper (Next.js project at `D:\Develop\suno-helper`) currently has no `node_modules` installed locally — running `next dev` would require either `bun install` or installing Node.js first.
