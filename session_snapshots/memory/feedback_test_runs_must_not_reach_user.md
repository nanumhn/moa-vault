---
name: feedback_test_runs_must_not_reach_user
description: "테스트 실행의 외부 발송은 \"안 나가겠지\"로 가정하지 말고 코드에서 확인하라 — dry-run이 형 채널로 새서 하루에 두 번 터졌다"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e32c22d7-4343-4bff-946b-e8d022511b3f
  modified: 2026-07-28T02:06:03.803Z
---

파이프라인을 **테스트로 돌릴 때 형에게 알림이 새지 않는지 코드로 먼저 확인**한다. 플래그 이름(`--dry`)이 외부 발송까지 막아줄 거라고 가정하지 않는다.

**Why:** 2026-07-28, 배선 확인만 하려고 `run.mjs --slot=am --dry --no-image` 를 돌렸는데 `sendPreviewCard` 가 `if (dry)` 밖에 있어 **프리뷰 카드가 형이 보는 채널로 발송**됐다. 형이 "미달인데, 다시 생성하고 있는거지~?"라고 물었고 실제로는 아무것도 안 돌고 있었다. 같은 실행에서 `sendCurationLog` 도 같이 샜다(둘 다 `LOG_WEBHOOK`). **같은 날 k-saju에서도 같은 유형이 터졌다** — 개인 부주의가 아니라 파이프라인마다 아무도 안 보던 구조 구멍이다.

**How to apply:**
- 돌리기 전에 발송 함수 호출부가 가드 뒤에 있는지 `grep` 한다. 없으면 먼저 가드를 넣고 돌린다.
- 아투는 `noCard = has('--no-card') || dry` 로 발송 3곳(프리뷰 카드·큐레이션 로그·생성실패 알림)을 막았고, `no-card.test.mjs` 가 **파이프라인을 돌리지 않고 소스를 정적 검사**해 가드 누락을 잡는다. 스케줄러 인자에 `--dry`가 없는지도 함께 검사한다(실운영이 조용해지는 반대 사고 방지).
- **★테스트 산출물을 임의로 삭제하지 않는다.** 위 사고에서 `out/` 테스트 파일을 "흔적 남기지 말자"고 지웠는데, 그게 팀리드가 원인을 추적할 유일한 증거였다. grep이 안 나와 조사 시간이 낭비됐다. 지울 거면 먼저 보고한다.

관련: [[reference_harness_change_ledger]] [[feedback_verified_facts_only]]
