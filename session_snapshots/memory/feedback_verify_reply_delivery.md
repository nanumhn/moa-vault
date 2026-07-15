---
name: feedback_verify_reply_delivery
description: "디스코드 회신은 발송 후 실제 도착까지 검증하라 — 형이 \"답변 체크 기능\" 요구"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 270ff378-2526-4008-be37-9d177573255d
---

형이 명시 요청(2026-07-12): "답변 체크하는 기능 추가해". 배경 = 클로가 회신을 **잘못된 형식(텍스트로 `call`/`invoke` 모양)으로 적어** 도구 호출이 아예 안 돼 발송 0 → 형이 무음을 겪고 "클로?"를 세션 내 10회+ 반복. 형이 가장 답답해하는 1순위 문제([[feedback_discord_reply_tool]] [[feedback_acknowledge_first]]와 동일 뿌리).

**핵심 원인:** 백그라운드 기능으로 자동 감지 불가 — 애초에 "안 보낸 것"이라 하네스가 훅으로 잡을 게 없음. 유일한 해결 = 클로의 실행 규율.

**Why:** 발송 누락은 형이 서버 죽은 줄 알고 반복 확인하게 만들어 신뢰·흐름을 크게 해침.

**How to apply (회신 검증 루틴 — 매 회신 강제):**
1. 모든 회신은 **무조건 진짜 `mcp__plugin_discord_discord__reply` 도구 호출**로만. 절대 텍스트로 `call`/`invoke`/`function_calls` 모양을 적지 않는다.
2. 발송 후 반환값 **`sent (id: ...)` 확인**. 안 보이면 = 발송 안 된 것 → 즉시 진짜 도구로 재발송.
3. 중요한 답/연속 발송/조금이라도 의심되면 **`fetch_messages(channel, limit=3~4)`로 내 메시지가 실제 채널에 떴는지 교차확인** → 누락이면 재발송. (send-glitch 대응, [[reference_discord_send_glitch_and_tz]])
4. 30초 이상 무음 금지. 작업 전 ack부터.

2026-07-12 이 루틴을 fetch로 실증(두 메시지 채널 도착 확인)하고 형에게 보고 완료.
