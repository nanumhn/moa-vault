---
name: npx-alternative
description: "This PC has no system node/npx — MCP servers using `npx ...` must be rewritten to `bun x ...`"
metadata: 
  node_type: memory
  type: reference
  originSessionId: c9c1686d-2947-457c-bacf-28082cda1c5b
---

이 PC에는 시스템 `node` / `npx`가 PATH에 없음 ([[node-runtimes]] 참고). `npx -y <pkg>` 형식으로 등록된 MCP 서버는 stdio 실행이 실패함 (claude mcp list에서 `Failed to connect` 또는 `-32000`으로 노출됨).

해결: `claude mcp add <name> -s local -- bun x -y <pkg>` 으로 재등록. `bun x`는 `npx`와 동일하게 동작하며 PATH의 bun으로 실행됨.

확인된 사례:
- 2026-05-15: `chrome-devtools-mcp@latest` — `npx`로 실패 → `bun x`로 재등록 후 정상 연결.
