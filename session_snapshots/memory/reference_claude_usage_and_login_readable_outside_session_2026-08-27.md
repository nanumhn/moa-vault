---
name: reference_claude_usage_and_login_readable_outside_session_2026-08-27
description: 클로 로그인 상태·주간 한도·토큰 만료를 세션 밖에서 토큰 0으로 읽는 법 (2026-08-27 실측)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1f399be5-626c-4bf5-a30d-583d4552a391
  modified: 2026-08-26T23:19:13.657Z
---

형 질문(2026-08-27): *"클로pc 의 클로 cli 가 로그인이 해제 되었다던가, 토큰사용량이 만료 되었을때, 나에게 공유되면 좋겠는데 방법이 있을까?"* → **셋 다 세션 밖에서 읽힌다. 토큰 비용 0.**

## ① 로그인 상태 — `claude auth status --json`
```
C:\Users\user\.local\bin\claude.exe auth status --json
→ { "loggedIn": true, "authMethod": "claude.ai", "apiProvider": "firstParty",
    "email": "...", "orgId": "...", "subscriptionType": "max" }
```
로컬 자격증명만 읽는다. 세션을 안 거치고, 돌고 있는 세션도 안 건드린다.

## ② ★주간 한도·5시간 한도 — 형이 보는 `claude.ai/#settings/usage` 와 같은 값
```
GET https://api.anthropic.com/api/oauth/usage
Authorization: Bearer <claudeAiOauth.accessToken>   ← .credentials.json 안의 그 토큰 그대로
anthropic-beta: oauth-2025-04-20
User-Agent: claude-cli/1.0
→ 200
{ "five_hour": {"utilization":7.0,"resets_at":"...Z"},
  "seven_day": {"utilization":1.0,"resets_at":"...Z"},
  "extra_usage": {...}, "spend": {...} }
```
- **API 키를 따로 만들 필요 없다** — 로그인 토큰이 그대로 먹는다.
- `utilization` 은 **퍼센트**(0~100). `limit_dollars`/`used_dollars` 는 이 계정에선 전부 null.
- ★**주간(`seven_day`)이 먼저 찬다.** 5시간짜리는 기다리면 풀리지만 주간은 안 풀린다 ([[reference_usage_limit_weekly_is_binding]]).
- 안 되는 것: `/api/organizations/{orgId}/usage` = **403**, `/api/claude_code/usage` = **404**.
- `/api/oauth/profile` 도 200 (has_claude_max 등).

## ③ 토큰 만료 시각 — `~/.claude/.credentials.json`
`claudeAiOauth.expiresAt`(접속 토큰, ms) · `refreshTokenExpiresAt`(재발급 토큰, ms) · `subscriptionType` · `rateLimitTier`.
**토큰 값은 안 읽고 시각 숫자만 정규식으로 꺼내면 된다** — `"expiresAt"\s*:\s*(\d+)`.
★`expiresAt` 키는 파일에 **두 번** 나온다(앞은 MCP OAuth). 큰 값을 써야 claudeAiOauth 것이다.

## 못 찾은 것
로컬 파일 중 사용량을 적어두는 곳은 **없다**(`~/.claude` 최상위·`cache/` 직접 확인). 반드시 위 API를 불러야 한다.

## 어디에 쓰고 있나
`C:\Users\user\.moa\moa_status_board.ps1` (예약작업 `MoaStatusBoard`, 5분 간격) → 디스코드 `1517010882570485871` 채널의 **메시지 하나를 계속 고쳐 쓴다**. 초록에서 벗어날 때만 형 멘션으로 새 글 1회.
관련: [[reference_ack_bot_silenced_watchdog_2026-08-27]]
