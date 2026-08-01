---
name: feedback_never_send_placeholder_text
description: "reply 도구를 \"placeholder\" 같은 테스트/자리표시 문구로 실수 호출한 사고. 발송 전 텍스트가 실제 내용인지 항상 확인"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a5faaf90-9bc4-408d-9eba-7ef115b04f4c
  modified: 2026-08-01T03:03:10.401Z
---

2026-08-01, 워치독 사이클 중 "새 메시지 없음"을 확인하려다 실수로 `mcp__plugin_discord_discord__reply`를 `text="placeholder"`로 실제 호출해 형에게 그대로 발송해버렸다.

**Why**: reply 도구는 즉시 실제 발송되는 도구다 — 초안이나 드라이런이 없다. "테스트해볼까" 하는 손버릇으로 아무 텍스트나 넣고 호출하면 그대로 형 채널에 뜬다.

**How to apply**: reply를 호출하기 직전, text 파라미터가 형에게 실제로 전달할 완성된 메시지인지 항상 확인한다. 확인/점검 목적의 내부 동작(예: MCP 정상작동 테스트)이 필요하면 reply가 아닌 다른 방법(fetch_messages로 상태만 확인, 또는 정말 필요하면 아예 호출하지 않음)을 쓴다. 실수로 보냈으면 [[feedback_verify_reply_delivery]]처럼 즉시 정정 메시지를 보낸다(숨기지 않음).

관련: [[feedback_discord_reply_tool]] · [[feedback_verify_reply_delivery]]
