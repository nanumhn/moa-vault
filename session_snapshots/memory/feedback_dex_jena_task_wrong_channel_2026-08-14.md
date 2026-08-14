---
name: feedback_dex_jena_task_wrong_channel_2026-08-14
description: 덱스·제나에게 보낼 "덱스, 새 작업이에요..." 메시지를 형-클로 메인채널(1501858476362829834)로 잘못 보낸 실수 — chat_id 재확인 필요
metadata:
  type: feedback
  originSessionId: f3737d80-1863-4133-a282-d39f5bf4e896
  modified: 2026-08-14T10:16:47.319Z
---

덱스(Codex)에게 작업을 지시하는 메시지("덱스, 새 작업이에요...")를 `mcp__plugin_discord_discord__reply`로 보내면서 `chat_id`를 형-클로 전용 메인채널(`1501858476362829834`)로 잘못 지정했다. 덱스는 그 채널에 응답하지 않게 설정돼 있어서([[reference_dex_jena_shared_channels_2026-08-08]]) 메시지가 형에게만 보이고 덱스는 영영 못 받는다. 형이 "왜 나한테 덱스 작업을 보내냐"고 직접 지적해서 발견됨.

**Why:** 방금 직전까지 형과 대화하던 같은 `reply` 호출 패턴을 그대로 복사하면서 `chat_id`만 바꾸는 걸 깜빡했다. 대화 흐름상 "형에게 보고 → 바로 이어서 덱스에게 위임"이 한 턴 안에 연속되면, 두 번째 reply 호출도 직전과 같은 chat_id를 쓰기 쉽다.

**How to apply:** 덱스·제나에게 작업을 넘기는 모든 `reply` 호출 직전에, chat_id가 `1534714627383099493`(그들만의업무)인지 — 회의성 안건이면 `1531838653066645654`(그들만의회의) — 명시적으로 확인한다. 형과의 대화 중간에 "덱스한테 넘길게요"라고 말한 직후가 가장 헷갈리기 쉬운 지점이니, 그 reply 호출의 chat_id 파라미터를 한 번 더 눈으로 확인하고 보낼 것. 보낸 뒤에는 fetch_messages로 해당 채널에 실제로 도착했는지 교차확인하는 습관도 도움됨.

관련: [[reference_dex_jena_shared_channels_2026-08-08]] [[feedback_discord_reply_tool]]
