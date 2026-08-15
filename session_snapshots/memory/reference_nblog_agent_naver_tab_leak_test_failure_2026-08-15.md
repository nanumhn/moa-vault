---
name: reference_nblog_agent_naver_tab_leak_test_failure_2026-08-15
description: nblog-agent의 "keepAliveProbe 반복돌려도 탭 안 늘어난다" 테스트 2건이 실패 중(2026-08-15 발견). 오늘밤 naver.ts 커밋과 무관, 기존 버그로 직접검증 확인
metadata:
  type: reference
  originSessionId: 99af3b4a-df80-4f19-9653-b29f3bce76ea
  modified: 2026-08-15T15:59:41.459Z
---

`D:\Develop\nblog-saas\tests\agent-keepalive-probe.test.ts` — `keepAliveProbe`(실제 순찰 함수) 본체를 가짜 브라우저 세계로 여러 회차 돌려 "탭이 안 늘어난다"를 검증하는 파일(2026-08-14 신설, 탭 누적 버그를 두 번 놓친 뒤 만들어짐)인데, 그중 2건이 현재 실패 중:
- `★8회차를 돌려도 탭은 처음 그 한 장뿐이다`: 기대값 `LOGGED_IN`인데 `UNKNOWN`으로 나옴
- `무작위로 돌려도 탭은 한 장이다`: `newPageCalls`가 0이어야 하는데 11회 발생

**발견 경위**: cto-seojin이 재발행 버튼 기능 구현 중 전체 테스트(892건)를 돌려 발견, "내 변경 전에도 실패"라고 stash 검증. 클로가 추가로 직접 검증: `agent/src/main/naver.ts`를 오늘밤 커밋(9442dbb, UNKNOWN→confirmByRedirect 승격) 이전 버전(8a7faa7)으로 되돌려도 **동일하게 실패** — 즉 이 테스트 실패는 오늘밤 작업들과 무관한 기존 버그다.

**Why**: 정확한 도입 커밋은 특정 안 함(시간 관계상 8a7faa7까지만 확인, 그 이전 히스토리는 안 봄). `bde48b2`("착지 주소 기억을 목적지가 덮어쓰던 것" 수정) 근방일 가능성이 있음 — 이 테스트 파일 자체가 2026-08-14 그 버그류를 잡으려고 새로 만들어진 것이라, 그 수정이 완전하지 않았거나 회귀했을 수 있음.

**How to apply**: 실제로 크롬 탭이 조용히 쌓일 수 있다는 뜻이라(사용자가 PC에서 눈치채기 전엔 안 보이는 문제) 급하진 않지만 방치하면 안 됨. 다음에 이 영역(naver.ts, keepAliveProbe) 작업할 때 이 테스트부터 통과시키고 시작할 것. `world.newPageCalls`가 11로 튀는 걸 보면 단순 1회성이 아니라 회차가 쌓일수록 계속 새 탭을 여는 것으로 보임 — `lastProbeUrl`/`lastProbeTarget` 모듈 전역 상태가 `vi.resetModules()`로도 안 씻기는 문제이거나, 실제 로직 결함일 수 있음(디버깅 안 함, 확정 아님[추측]).

**해결됨(같은 날 밤, cto-seojin)**: git bisect로 `ffbd4a1`(로그아웃 재확인 CORS오탐 수정 커밋)이 원인으로 특정됨 — 그 커밋이 `keepAliveTab`에 `page.waitForTimeout(1200)`을 추가했는데(실제 Playwright엔 정당한 메서드), 이 테스트의 가짜 `makePage()`엔 그 메서드가 없어서 TypeError가 `catch { return null; }`에 조용히 삼켜짐 → 매 회차 UNKNOWN + 새 탭. **실사용 버그 아님**(실제 playwright-core 1.62.1엔 waitForTimeout 정식 지원, 진짜 크롬은 정상 동작) — 테스트 더블만 보강(`waitForTimeout` 스텁 추가), 소스코드는 무수정. 커밋 `b3a95ff`, push 완료. 이 파일의 실사용 위험도 평가는 폐기(과잉 우려였음).

관련: [[project_nblog_saas_manual_retry_button_backlog_2026-08-15]]
