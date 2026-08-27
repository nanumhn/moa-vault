---
name: reference_ack_bot_silenced_watchdog_2026-08-27
description: "안전망이 안전망을 껐다 — ack봇 '작업 중' 글이 워치독을 잠재워 형이 56분 방치됨 (수리완료)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1f399be5-626c-4bf5-a30d-583d4552a391
  modified: 2026-08-26T23:19:35.688Z
---

2026-08-27 새벽, 형이 세 번 부르는 동안 **경보가 한 번도 안 울렸다.** 클로 CLI는 그 시간 내내 **로그아웃** 상태였다.

```
06:56  형: "쟀습니다 무슨 뜻이야?"
07:00  ack봇: "🤖 작업 중이에요, 끝나는 대로 보고할게요"   ← 거짓
07:02  워치독: "OK - 봇 응답이 더 최근"                  ← 경보 사망
07:32  형: "클로????"
07:38  ack봇: "🤖 작업 중이에요"                          ← 또
07:52  형: "무슨일이지.."                                 ← 56분간 무알림
```

## 두 겹이었다

**① `moa_ack_bot.ps1` 이 로그인을 안 봤다.**
`mcp_health.json` 이 `up` 이면 홀딩 문구를 보낸다. 그 판정은 **claude.exe 생존 + 디스코드 연결**만 본다. **로그인은 검사 항목에 없었다.** 프로세스도 살아있고 게이트웨이도 붙어 있었으므로 `up` 이 나왔다.
> 아이러니: 그 스크립트 주석에 *"2026-07-26 48분간 죽은 세션에 '작업 중'이라 답했다 — 그 답은 침묵보다 나쁘다"* 라고 본인이 적어놨다. 그때 막은 건 **MCP만**이었다.

**② `moa_discord_watchdog_external.ps1` 33~34행이 봇 글을 가리지 않았다.**
```powershell
$lastBot = $messages | Where-Object { $_.author.id -eq $BotId } | Select-Object -First 1
# 형 글보다 이게 나중이면 무조건 OK → ack봇 글도, 🚀 시동 알림도 전부 "응답"
```
**ack봇과 클로가 같은 봇 토큰을 쓴다.** 그래서 ack봇이 울릴 때마다 워치독이 잠들었다.

## 수리 (2026-08-27, 형 지시)
- ack봇: `Get-LoginState` 신설(`claude auth status --json`) → **로그인 판정이 MCP보다 우선**. `out` → `ack_bot_message_loggedout.txt`("🔴 로그아웃, 형이 로그인해 주세요"), `unknown` → uncertain 문구(**모르는 걸 정상이라 안 함**). 분기 시험 6/6.
- 워치독: `auto_notice_prefixes.txt`(🤖🚀🔄✅⚠️❓🔴📊·`[외부워치독]`, **UTF-8 BOM**)를 읽어 **자동 알림을 응답으로 안 센다.** 필터 시험 6/6.
  ★접두어를 PS 소스에 직접 안 박은 이유: PS5.1이 이모지 surrogate pair를 깨뜨린다.
- 신설: `moa_status_board.ps1` — [[reference_claude_usage_and_login_readable_outside_session_2026-08-27]]

## ★교훈
**안전망을 여러 겹 깔 때는 "이 겹이 다른 겹의 입력이 되는가"를 봐야 한다.** 여기선 A의 출력이 B의 "정상" 신호로 들어가서, A가 울릴수록 B가 조용해졌다.
그리고 **어떤 판정기도 "내가 못 본 항목"을 정상으로 세면 안 된다** — MCP만 보고 로그인을 안 본 게 정확히 그것이다.
관련: [[feedback_verify_before_alarm]] · [[feedback_check_tool_can_false_pass]]
