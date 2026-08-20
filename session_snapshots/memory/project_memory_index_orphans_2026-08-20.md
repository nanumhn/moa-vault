---
name: project-memory-index-orphans-2026-08-20
description: 메모리 267개 중 110개가 MEMORY.md에 미등재 — 인덱스에 없으면 회상이 안 되므로 사실상 죽은 기록. 선별 정리 필요
metadata: 
  node_type: memory
  type: project
  originSessionId: 66b3be13-7e74-4820-96bf-fbb885c9a130
  modified: 2026-08-20T12:21:28.307Z
---

2026-08-20 인덱스 무결성 점검에서 발견. **메모리 파일 267개 중 110개(41%)가 `MEMORY.md`에 등재돼 있지 않다.**

**Why 중요한가:** `MEMORY.md`가 세션마다 컨텍스트로 실리는 유일한 목록이다. **인덱스에 없으면 회상 대상이 아니고, 그러면 그 기록은 존재하지 않는 것과 같다.** 쓰는 데 든 비용이 통째로 낭비된다.

**110개의 성격이 섞여 있다 — 일괄 처리하면 안 된다:**
- **정상적으로 밀려난 것** — `project_open_threads_*_snapshot` 같은 세션 스냅샷. 최신 것만 인덱스에 두는 게 맞으니 이건 문제가 아니다.
- **진짜로 흘린 것** — `feedback_session_reliability_friction_2026-08-15`, `feedback_task_dropped_on_interruption_2026-08-15`, `reference_nblog_agent_naver_tab_leak_test_failure_2026-08-15` 등. 이건 지금도 유효한 교훈인데 인덱스에서 빠져 있다.

**How to apply (다음 세션):**
- 한 번에 다 하려 하지 말고 **`feedback_*`·`reference_*` 부터** 훑는다. 이 둘은 시효가 길어서 손실이 크다.
- `project_open_threads_*` 스냅샷은 **최신 1~2개만 남기고 나머지는 인덱스에서 빼는 게 정상**이다. 파일까지 지울지는 별도 판단.
- 같이 발견된 것: **`project_full_system_review_pending_2026-08-08` 은 파일이 아예 사라지고 인덱스에 죽은 링크만 남아 있었다.** 내용을 복원했지만 원본 세부는 유실됐다. **파일이 사라지는 경로가 있다는 뜻**이라 재발하면 원인을 찾아야 한다.

**같은 날 확인된 관련 문제:** 에이전트와 팀리드가 **같은 사실로 각각 메모리를 만들어 중복**이 생겼다(라이브 판정법). 같은 디렉터리를 공유하므로 **쓰기 전에 같은 사실을 다루는 파일이 있는지 확인**하고, 있으면 갱신한다. 하나의 사실에 파일 하나.

관련: [[reference_ksaju_live_verification_method]] · [[project_full_system_review_pending_2026-08-08]]
