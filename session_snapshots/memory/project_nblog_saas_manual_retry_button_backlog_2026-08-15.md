---
name: project_nblog_saas_manual_retry_button_backlog_2026-08-15
description: nBlog 대시보드에 "재발행/다시시도" 버튼 신설 아이디어(형 제안) — NAVER_LOGGED_OUT 같은 재시도금지 실패를 사람이 손댄 뒤 수동으로 되살릴 방법이 없어서 나온 요구
metadata:
  type: project
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-15T15:36:07.202Z
---

2026-08-15, 성수동 발행이 `NAVER_LOGGED_OUT`으로 실패(형이 PC 로그인 다시 하기 전). 이 에러코드는 `ERROR_POLICY.retry=false`로 설계상 자동재시도가 영구 차단되고, 대시보드에도 수동재시도 버튼이 없어서 클로가 직접 DB에 `PublishJob`(origin:"RETRY")을 안전하게 손으로 넣어야 했다.

형이 제안한 기능: **대시보드에 "재발행/다시 시도" 버튼**.

**형이 직접 짚은 설계 고려사항(2026-08-15)**: 이 버튼이 그냥 즉시 재시도만 하면 안 되고, **다음 예약 슬롯과의 충돌을 시스템적으로 체크**해야 한다 —
- 다음 정규 슬롯이 임박해 있으면: 재시도를 끼워넣지 말고 **다음 슬롯을 정상 진행**시키고, 실패건은 **별도로 재예약**한다.
- 그렇지 않으면 즉시 재시도 잡 생성.

**구현 시 참고할 기존 코드**: `src/server/rules/retry.ts`(`planSlotDecision` — 재시도 가능 여부 판정의 유일 정의처)와 `src/server/cron/slot-planner.ts`(274~400줄대, 실제 재시도 잡 생성 코드, `origin:"RETRY"` 필드가 이미 스키마에 있지만 이 경로 말고는 아무도 안 쓰고 있었음). 새 버튼은 이 판정 로직에 "사람이 방금 원인을 고쳤다"는 신호를 얹어 `ERROR_NOT_RETRYABLE` 블록을 우회하게 만드는 방향이 될 것.

착수 안 함(제안 단계). 관련: [[project_nblog_saas_night_marathon_2026-08-13]]

**2026-08-15 밤 완료**: cto-seojin에게 위임해 대시보드 "재발행" 버튼 실제 구현 완료(커밋 `e09d7ba`, push는 형 결재 대기). `src/server/rules/manual-retry.ts`로 판정+잡생성 단일화(CLI와 API가 같은 함수). 슬롯충돌 기준값=하드코딩 대신 `Blog.minIntervalMin`에서 파생된 deferOffsetMs(G1게이트+5분)로 블로그마다 자동 계산. `POST /api/dashboard/jobs/{jobId}/retry`, 소유권 검증 포함. 라이브 dev DB로 충돌/비충돌/409/401/404 케이스 전부 수동 검증됨.

**부수 발견(별개 이슈, 급하지 않음)**: 작업 중 `tests/agent-keepalive-probe.test.ts`의 "탭이 안 늘어난다" 테스트 2건이 실패 중인 걸 cto가 발견 → 클로가 직접 커밋 되돌려서 검증한 결과 오늘 밤 커밋들과 무관한 기존 버그로 확인됨(bde48b2 근방부터로 추정, 정확한 도입 커밋은 미특정). 실제로 크롬 탭이 조용히 쌓일 수 있다는 뜻이라 다음에 볼 것 — [[reference_nblog_agent_naver_tab_leak_test_failure_2026-08-15]].

**2026-08-15 밤 업데이트(구버전, 위 완료로 대체됨)**: 대시보드 버튼은 여전히 미착수지만, 같은 날 을지로 편이 또 NAVER_LOGGED_OUT으로 실패해서 그 처리 과정에서 CLI 버전을 먼저 만들었다 — `scripts/manual-retry.ts`(`bun run admin:manual-retry -- --list` / `--retry <jobId>`), slot-planner.ts의 정상 재시도 잡 생성 형태를 그대로 따르되 ERROR_NOT_RETRYABLE만 사람이 의식적으로 우회. 발행 흔적/살아있는 잡 체크 안전장치 포함. 성공 확인됨(형이 형 터미널에서 직접 실행, 운영DB 직접접근이 auto-mode 클래시파이어에 막혀서 클로 대신 CLI를 만들어 위임한 경로 — [[project_nblog_prod_db_secret_leaked_screenshot_2026-08-15]] 참고, 그 과정에서 운영DB 비밀번호가 채팅에 2회 노출된 사고 있었음). 다음 슬롯 충돌 체크는 여전히 미구현(이 CLI는 사람이 판단해서 쓰는 것이라 자동 충돌회피 로직 없음) — 대시보드 버튼으로 승격 시 그 로직 추가 필요.
