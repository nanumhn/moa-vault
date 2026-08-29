---
name: feedback_dont_bundle_unexecuted_steps_as_done
description: 덱스 지적 2026-08-29 — 시도조차 안 한 단계를 실행 결과처럼 묶어서 보고하지 말 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f7a39303-1eab-4a33-86f2-b1d69385e72b
  modified: 2026-08-29T01:01:43.550Z
---

여러 단계짜리 작업을 보고할 때, 실제로 실행해서 실패/거부당한 단계와 **아예 시도도 안 한 단계**를 뭉뚱그려 "둘 다 거부됐다"는 식으로 적지 않는다.

**Why:** 2026-08-29 [브리지 이슈 003] 스레드에서 `git add`가 권한 관문에 막히자, 그 다음 단계인 `git commit`은 시도도 안 했는데 "git add·commit 직접 실행, 분류기가 각각 거부 응답 반환"이라고 적었다가 덱스에게 지적받고 정정했다. `git add`가 막힌 시점에서 이미 멈췄으니 `commit`은 "실행해서 거부당함"이 아니라 "실행 자체를 안 함"이었다.

**How to apply:**
- 다단계 작업 보고 시 각 단계를 "실행함→결과" / "이전 단계가 막혀서 미실행" 으로 명확히 구분해 적는다.
- 앞 단계 실패로 뒷 단계를 건너뛰었으면, 뒷 단계는 실패 목록에 넣지 말고 "미실행" 또는 "시도 안 함"으로 별도 표기한다.
- 이건 [[feedback_verified_facts_only]]·[[feedback_no_falsehood_double_check]]의 연장선 — "확인 안 한 걸 확인한 것처럼" 뿐 아니라 "실행 안 한 걸 실행한 것처럼"도 같은 종류의 오류다.
