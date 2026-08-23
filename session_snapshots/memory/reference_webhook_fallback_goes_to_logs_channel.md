---
name: reference_webhook_fallback_goes_to_logs_channel
description: reply 도구가 막혔을 때 쓰는 웹훅 폴백은 형 대화채널이 아니라 로그채널(1517010882570485871)로 간다 — 대화를 거기 쏟으면 형은 못 본다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5638302b-d111-4684-8bc5-f39ab05eb478
  modified: 2026-08-23T00:43:14.343Z
---

2026-08-23 오전. 형이 직접 지적: **"1517010882570485871 / 여긴 대화 채널이 아니야..."**

## 무슨 일이 있었나
세션 중 `mcp__plugin_discord_discord__reply`가 또 막혔다([[reference_discord_mid_session_deallowlist_2026-08-01]]).
그래서 `C:\Users\user\.moa\moa_webhook_send.ps1`(+ curl 멀티파트)로 우회해 아침 보고를 계속 보냈다 —
쇼츠 결과, 캐러셀 첫 실전 검증, **타로 보고 정정**, 달 카드 비교 이미지 2장까지.

**그게 전부 로그 채널로 갔다.** 형은 대화 채널에서 기다리고 있었고, 그 보고들을 대화로 못 받았다.
`healthcheck.config.json`의 `discordWebhook`은 **SystemLogs 채널**이다 — 부트스트랩 문서에도
*"직접 응답은 못함, SystemLogs 채널로 감 — 형 메인 채널 아님"* 이라고 적혀 있었는데 그대로 밀어붙였다.

## 규칙
- **웹훅 폴백은 "살아있다는 신호"용이지 대화용이 아니다.** 형에게 답·질문·결재요청을 보내는 통로가 아니다.
- reply가 막히면: ① 짧게 웹훅으로 **"회신도구 막힘, 복구 필요"만** 알리고
  ② **형이 `/discord:access`로 풀어줄 때까지 본 보고는 쌓아 두었다가**, 풀리면 대화채널에 제대로 올린다.
  ③ 그 사이에 한 작업은 계속하되 **결재가 필요한 건은 진행하지 말고 대기**한다.
- 형 대화채널 = `1501858476362829834`. 로그채널 = `1517010882570485871`(대화 금지).
- 파일 첨부는 reply의 `files` 파라미터가 정상 경로다. 웹훅 멀티파트는 되긴 하지만 **가는 곳이 로그채널**이라 의미 없다.

## 교훈
**도구가 막혔을 때 "어떻게든 보냈다"가 곧 "형이 받았다"가 아니다.**
우회로를 쓸 땐 **그 우회로의 도착지가 어디인지부터** 확인해야 한다. 이번엔 문서에 이미 적혀 있었는데도
"전송 성공(HTTP 200)"만 보고 도달했다고 취급했다 — 재조회로 완료 판정하라는 규칙을
**발송 성공에만 적용하고 수신자 확인에는 적용하지 않은 것**이다.

관련: [[feedback_discord_reply_tool]] · [[reference_discord_mid_session_deallowlist_2026-08-01]] ·
[[feedback_attach_files_dont_just_cite_path]] · [[feedback_no_falsehood_double_check]]
