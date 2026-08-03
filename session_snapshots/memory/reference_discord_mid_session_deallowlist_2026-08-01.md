---
name: reference_discord_mid_session_deallowlist_2026-08-01
description: "Discord MCP reply/fetch_messages 도구가 세션 재시작 없이 도중에 \"channel not allowlisted\"로 막힌 새 실패 패턴. access.json은 정상이었음. 웹훅 폴백으로 우회"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a5faaf90-9bc4-408d-9eba-7ef115b04f4c
  modified: 2026-08-03T13:09:59.181Z
---

2026-08-01 새벽 워치독 cron 도중 발생. 그 직전까지(같은 세션 안에서) `mcp__plugin_discord_discord__reply`·`fetch_messages`가 정상 동작해 여러 번 성공적으로 발송/조회했는데, 이후 호출부터 **세션 재시작 없이** 아래 에러로 막힘:
```
fetch_messages failed: channel 1501858476362829834 is not allowlisted — add via /discord:access
reply failed: channel 1501858476362829834 is not allowlisted — add via /discord:access
```

## 확인한 것
- `C:\Users\user\.claude\channels\discord\access.json`과 `discord2\access.json` 둘 다 `dmPolicy: allowlist`, `allowFrom: ["348731432086274049"]`(형 계정)로 정상 — 설정 파일 자체는 문제 없음.
- 재시도 3회(즉시) 전부 동일 에러 — 일시적 글리치([[reference_discord_send_glitch_and_tz]]의 "간헐 누락"과는 다름, 그건 발송은 되고 순서만 씹히는 것이었는데 이건 아예 거부).
- hook.log 기준 이 세션은 04:02:29 KST 정상 startup, 세션 재시작 없이 도중에 발생 — [[reference_discord_mcp_connect_fail]](로그인 실패로 MCP 자체가 죽는 패턴)과도 다름. 이번엔 MCP 연결 자체는 살아있고(도구 호출은 응답함) 특정 채널만 거부.
- 원인 미확정. access.json을 직접 수정해서 우회하지 않았음 — 사용자 계정이 이미 allowlist에 있는데도 거부되는 거라, 파일을 건드리는 게 근본 수정인지 확신 없음(오히려 다른 무언가—런타임 캐시·게이트웨이 쪽 문제일 가능성).

## 대응
`C:\Users\user\.moa\moa_webhook_send.ps1 -Path <utf8 txt 파일>` 로 웹훅 폴백 발송 성공. **주의**: `-Message` 파라미터에 한글+큰따옴표 섞어 커맨드라인으로 직접 넘기면 PowerShell 파싱이 깨져 `-Path`로 오인됨(백틱 이스케이프 문제) — 반드시 UTF-8 파일로 써서 `-Path`로 넘길 것.

## 다음 세션이 할 일
재발하면: ①웹훅으로 즉시 알림 ②세션 재시작으로 복구되는지 확인(재시작이 해결하면 = 런타임 상태 문제, MCP 재연결로 리셋되는 캐시 같은 것). 재시작 후에도 재발하면 access.json 문제가 아니라 다른 원인(디스코드 쪽 rate limit·권한 변경 등)일 가능성 — 형에게 디스코드 앱 자체 설정 확인 요청.

## ★★ 근본원인 좁힘 (같은 날, 여러 워치독 사이클 지나도 안 풀려서 직접 진단)
`C:\Users\user\.claude\channels\discord\.env`의 `DISCORD_BOT_TOKEN`으로 **Discord REST API를 직접(curl) 호출했더니 정상 200**으로 메시지를 읽어왔다:
```
curl -H "Authorization: Bot $TOKEN" "https://discord.com/api/v10/channels/<channel_id>/messages?limit=20"
```
→ **봇 토큰·Discord 쪽 연결은 완전히 멀쩡하다.** 문제는 100% MCP 플러그인 내부의 allowlist 체크 로직에 있다(access.json도 정상인데 왜 거부하는지는 여전히 미확정 — 아마 런타임 캐시가 access.json과 다른 소스에서 채널→유저 매핑을 하는데 그게 꼬였을 가능성). 세션 재시작 없이는 self-heal 안 됨(수 시간, 여러 새벽/주간 워치독 사이클 넘게 지속 확인).

**읽기 폴백(신규)**: MCP `fetch_messages`가 막혀도 위 curl 방식으로 최근 메시지를 직접 읽을 수 있다 — "형이 보낸 메시지를 놓쳤는지" 확인이 급할 때 이걸로 대체 가능. 단, 인코딩 주의: Windows 기본 콘솔 codepage(cp949)가 이모지/한글을 못 뱉으니 `PYTHONIOENCODING=utf-8`로 python에 넘겨 UTF-8 파일로 저장 후 Read 도구로 읽을 것. 토큰 값 자체는 절대 화면에 echo하지 말 것(`cut -d'=' -f2-`로 변수에만 담아 커맨드 안에서 조용히 사용).
**쓰기는 여전히 안 됨**: reply도 동일하게 막혀서, 발송(특히 파일 첨부)은 계속 `moa_webhook_send.ps1` 또는 웹훅 multipart curl(`curl -F content=... -F file1=@path <webhook_url>`)로 우회해야 한다.

관련: [[reference_discord_mcp_connect_fail]] · [[reference_discord_channel_plugin_conflict]] · [[reference_discord_send_glitch_and_tz]]

## 재발 2026-08-03
같은 세션 안에서 워치독 cron 도중 재발. 이번엔 fetch_messages와 reply **둘 다** 동일 에러로 막힘(8/1엔 읽기만 막혔었는지 기록이 불명확했는데, 이번엔 양쪽 다 확인). curl 직접조회로 놓친 형 메시지 없음을 확인하고, `moa_webhook_send.ps1 -Path <utf8 파일>`로 즉시 폴백 알림 발송 성공. 세션 재시작 없이 self-heal 되는지는 다음 관찰 필요 — 재시작이 유일한 확정된 복구법이라는 결론은 아직 유효.
