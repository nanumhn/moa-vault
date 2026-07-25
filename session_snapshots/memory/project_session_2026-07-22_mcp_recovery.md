---
name: project-session-2026-07-22-mcp-recovery
description: 2026-07-22 재부팅 후 Discord MCP 미부착 상태와 복구 절차 — 재시작 후 재개용
metadata: 
  node_type: memory
  type: project
  originSessionId: f1674c7e-a416-4de4-82ed-a199d9795c3f
  modified: 2026-07-21T21:16:43.363Z
---

2026-07-22 05:43 서버 재부팅 → 세션은 자동 복귀했으나 **Discord MCP(reply/fetch 도구)가 세션에 안 붙음**. 06:14 respawn 1회 실행했으나 동일 증상 재발.

**[확인] 진단 결과**
- 플러그인 자체는 정상. `discord/0.0.4`에서 `bun run --shell=bun --silent start`를 stdin 열어둔 채 수동 실행 → `discord channel: gateway connected as 달려라 클로#7541` 정상 출력. node_modules 105개 정상.
- fakechat은 `false`(충돌 아님). settings.json의 discord 플러그인 enabled.
- 즉 근본원인은 **세션 기동 시점(06:12~06:14)의 일시적 실패로 server.ts가 exit → 그 세션 수명 내내 MCP 없음**. [[reference_discord_mcp_connect_fail]] 패턴과 동일.

**복구법**: 세션 재시작만이 유일. MCP는 세션 중간에 붙일 수 없다.
**임시 발신**: `powershell -File C:\Users\user\.moa\moa_webhook_send.ps1 -Message "..."` (healthcheck.config.json의 webhook 사용, 2000자 자동 분할). 2026-07-22 신규 작성.

**재시작 후 할 일**
1. reply 도구 존재 확인 → 없으면 또 웹훅으로 보고하고 respawn 반복 금지(루프 위험), 형에게 판단 요청.
2. `fetch_messages`로 다운타임(05:43~) 유실 메시지 회수. `session_boot.flag` 삭제.
3. cron 2개 재등록(라이브 저장 03:55 일·수 / 수신 워치독 5분).
4. 열린 작업은 [[project_session_2026-07-21_snapshot]] 참조.
