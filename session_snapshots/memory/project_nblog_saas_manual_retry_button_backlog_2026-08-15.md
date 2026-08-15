---
name: project_nblog_saas_manual_retry_button_backlog_2026-08-15
description: nBlog 대시보드에 "재발행/다시시도" 버튼 신설 아이디어(형 제안) — NAVER_LOGGED_OUT 같은 재시도금지 실패를 사람이 손댄 뒤 수동으로 되살릴 방법이 없어서 나온 요구
metadata:
  type: project
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-15T01:49:47.443Z
---

2026-08-15, 성수동 발행이 `NAVER_LOGGED_OUT`으로 실패(형이 PC 로그인 다시 하기 전). 이 에러코드는 `ERROR_POLICY.retry=false`로 설계상 자동재시도가 영구 차단되고, 대시보드에도 수동재시도 버튼이 없어서 클로가 직접 DB에 `PublishJob`(origin:"RETRY")을 안전하게 손으로 넣어야 했다.

형이 제안한 기능: **대시보드에 "재발행/다시 시도" 버튼**.

**형이 직접 짚은 설계 고려사항(2026-08-15)**: 이 버튼이 그냥 즉시 재시도만 하면 안 되고, **다음 예약 슬롯과의 충돌을 시스템적으로 체크**해야 한다 —
- 다음 정규 슬롯이 임박해 있으면: 재시도를 끼워넣지 말고 **다음 슬롯을 정상 진행**시키고, 실패건은 **별도로 재예약**한다.
- 그렇지 않으면 즉시 재시도 잡 생성.

**구현 시 참고할 기존 코드**: `src/server/rules/retry.ts`(`planSlotDecision` — 재시도 가능 여부 판정의 유일 정의처)와 `src/server/cron/slot-planner.ts`(274~400줄대, 실제 재시도 잡 생성 코드, `origin:"RETRY"` 필드가 이미 스키마에 있지만 이 경로 말고는 아무도 안 쓰고 있었음). 새 버튼은 이 판정 로직에 "사람이 방금 원인을 고쳤다"는 신호를 얹어 `ERROR_NOT_RETRYABLE` 블록을 우회하게 만드는 방향이 될 것.

착수 안 함(제안 단계). 관련: [[project_nblog_saas_night_marathon_2026-08-13]]
