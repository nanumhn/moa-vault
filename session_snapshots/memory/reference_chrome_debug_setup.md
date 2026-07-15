---
name: chrome-debug-setup
description: chrome-devtools MCP runs in attach mode — Claude launches Chrome itself with debug port when needed
metadata: 
  node_type: memory
  type: reference
  originSessionId: c9c1686d-2947-457c-bacf-28082cda1c5b
---

**MCP 등록 형태** (2026-05-15 업데이트, `claude mcp list`에서 확인):
```
chrome-devtools: C:/Users/user/.lmstudio/.internal/utils/node.exe D:/tools/chrome-devtools-mcp/node_modules/chrome-devtools-mcp/build/src/bin/chrome-devtools-mcp.js --browserUrl http://127.0.0.1:9222
```

**원래는 `bun x -y chrome-devtools-mcp@latest`로 등록했지만** bun + ws 라이브러리 조합에서 Chrome의 WebSocket 핸드셰이크가 `Unexpected server response: 101`로 죽음. `claude mcp list`는 Connected라고 거짓말함. 그래서 LM Studio 번들 node.exe로 우회. 패키지는 `D:\tools\chrome-devtools-mcp`에 `bun add`로 미리 깔아둠 (LM Studio 노드엔 npm/npx가 없어서).

**왜 attach 방식**:
- MCP가 직접 Chrome을 띄우면 Puppeteer의 자동화 플래그가 붙어서 Google 로그인이 거부됨 ([[google-login-popup]] 관련 이슈와 같은 카테고리).
- 그래서 평범한 Chrome을 별도로 띄우고 거기에 attach하는 방식.

**Chrome 실행 책임은 클로드한테 있음** (형이 손대지 않게). MCP 툴 호출 전에 9222 포트 안 떠있으면 클로드가 띄움:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList '--remote-debugging-port=9222','--user-data-dir=C:\chrome-debug-profile'
```
포트 체크: `Test-NetConnection -ComputerName 127.0.0.1 -Port 9222 -InformationLevel Quiet` 또는 그냥 MCP 툴 한 번 호출해보고 실패하면 띄움.

**프로필 경로**: `C:\chrome-debug-profile` — Google 로그인 세션이 여기 저장됨. 절대 지우지 말 것. 지우면 로그인 다시 해야 함.

**최초 셋업 (2026-05-15에 안내함)**:
1. 형이 위 Start-Process 명령으로 Chrome 한 번 띄움
2. Chrome 창에서 Google 계정 로그인 (audioUrl 자동회수에 필요한 그 계정으로)
3. Chrome 닫지 말고 켜둔 상태로 클로드한테 작업 지시

**이후 세션**: 클로드가 작업할 때 알아서 Chrome 켜고 attach. 형은 손 안 댐. Google 세션 만료(보통 수주~수개월) 시에만 다시 로그인.
