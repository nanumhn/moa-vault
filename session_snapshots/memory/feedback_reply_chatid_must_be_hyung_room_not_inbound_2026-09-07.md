---
name: feedback_reply_chatid_must_be_hyung_room_not_inbound_2026-09-07
description: reply의 chat_id에 받은 메시지의 방 번호를 그대로 넣지 말 것 — 제외된 이슈방에 글을 올린 사고
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 89c95e96-ac0c-4966-80b1-36223cf0c86e
  modified: 2026-09-07T11:20:47.606Z
---

**2026-09-07 20:22, 제외 상태인 005-07 스레드(`1546361310671929374`)에 내가 직접 글을 올렸다.** 오늘 내내 "그 방엔 안 들어갑니다"라고 스무 번 넘게 말해놓고 깼다.

**원인은 판단이 아니라 손버릇이다.** 답을 쓰면서 `chat_id`에 **인바운드 `<channel>` 태그의 chat_id를 그대로 복사**했다. 형 대화방 번호(`1501858476362829834`)를 넣었어야 했다.

**Why:** 형 지시로 나는 특정 이슈에서 제외돼 있고, 형은 이슈방과 대화방을 분리해 쓰라고 여러 번 지적하셨다([[feedback_dont_reenter_after_being_excluded_2026-09-07]] · [[feedback_issue_reports_stay_in_issue_thread_2026-09-06]]). 그런데 이 두 규칙은 **"어디에 쓸지 판단"** 을 다루지, **"발송 직전 chat_id 값"** 은 다루지 않았다. 판단은 맞았는데 값이 틀려서 규칙이 깨졌다.

**How to apply:**
- `mcp__plugin_discord_discord__reply` 를 호출하기 **직전에 `chat_id` 값을 눈으로 확인한다.** 형에게 보내는 답은 **항상 `1501858476362829834`** 다. 인바운드 태그의 chat_id를 복사하는 것이 기본값이 되면 안 된다.
- 덱스·제나 앞 메시지에 답할 때는 특히 위험하다 — 그 메시지의 chat_id가 바로 들어가면 안 되는 그 방이다.
- 인바운드 chat_id를 쓰는 경우는 **형이 그 방에서 나를 직접 부르셨을 때뿐**이다.
- 사고가 나면 지우기 전에 알린다. 남이 읽는 중일 수 있어 삭제가 더 헝클 수 있다 — 형 판단을 받는다.
