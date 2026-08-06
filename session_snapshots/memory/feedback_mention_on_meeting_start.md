---
name: feedback_mention_on_meeting_start
description: 회의/공지성 디스코드 메시지는 시작 시 반드시 @전체 또는 형을 멘션해야 함
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-06T05:24:14.001Z
---

디스코드에서 회의나 여러 사람이 보는 채널에 새 스레드/안건을 시작할 때, 멘션 없이 텍스트만 올리면 형(또는 참여자)에게 알림이 안 간다.

**Why:** 2026-08-06, 클로가 회의채널(1531838653066645654)에 덱스·제나 소집 회의를 멘션 없이 시작했다가 형이 "회의 시작할때는 전체를 멘션하던지 나를 멘션해줘"라고 지적. 디스코드 알림 시스템은 멘션 기반이라 일반 메시지는 채널을 계속 보고 있지 않으면 놓친다.

**How to apply:** 회의 소집·새 안건 시작·중요 공지처럼 "누군가 지금 봐야 하는" 메시지는 본문에 `<@형 user_id 348731432086274049>` 또는 `@everyone`을 넣어서 발송. 일반 진행상황 업데이트(같은 스레드 이어지는 답변)까지 매번 멘션할 필요는 없음 — 새로 시작하는 지점에서만.

관련: [[feedback_discord_formatting]] [[project_dex_jena_multiagent_2026-08-06]]
