---
name: reference_nblog_saas_shared_test_db_contention
description: "nblog-saas 병렬 에이전트 작업 시 nblog_test DB 공유로 vitest 동시실행이 서로 truncate/deadlock 시킴 (2026-08-10, 3개 에이전트 독립 보고)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: c23b79cb-17fc-4fd7-8157-44d3094571d0
  modified: 2026-08-10T09:58:02.852Z
---

nblog-saas(D:\Develop\nblog-saas)에서 cto-seojin 에이전트를 여러 개 병렬로 띄워 작업시킬 때(대시보드 CRUD·시트 아카이브·슬롯정책 3개 동시 진행, 2026-08-10), **셋 다 독립적으로 같은 증상을 보고**: `nblog_test` DB를 공유해서 한쪽이 vitest 돌리는 동안 다른 쪽 `truncateAll`/`TRUNCATE`에 데이터가 쓸려나가거나 deadlock(40P01)으로 죽음. 순차 실행하면 전부 정상 통과.

부수적으로 발견된 것: `bun run build`의 `prisma generate` 단계가 dev server(포트 3002)가 쥔 query engine DLL 때문에 EPERM으로 실패하는 것도 반복 관찰됨 — 무해(엔진 바이너리는 그대로, TS 클라이언트만 생성 안 될 뿐), `next build`를 직접 돌리면 우회됨.

**Why:** 병렬 에이전트 위임 자체는 유효한 전략이지만, 테스트 DB 인프라가 그 전략을 못 받쳐줘서 거짓 실패 노이즈가 반복 발생. 에이전트들은 각자 원인을 정확히 진단해서(자기 코드 문제 아님 확인 후) 넘어갔지만, 매번 이 진단에 시간이 든다.

**How to apply:** nblog-saas에서 여러 에이전트를 병렬로 띄워 각자 테스트를 돌리게 할 때는, 테스트 실패 보고를 받으면 **바로 코드 버그로 단정하지 말고 "다른 에이전트와 테스트 동시실행 겹쳤는지"부터 의심**할 것.

**★검증된 해결책(2026-08-10, slot-scheduling-flexibility 에이전트 실측):** `TEST_DATABASE_URL`의 DB 이름만 에이전트별로 다르게 주면 된다(예: `nblog_test_seojin`) — 이름에 `nblog_test`만 포함되면 기존 안전장치(운영DB 오염 방지 체크)도 그대로 통과한다. 다음에 nblog-saas에서 여러 에이전트를 병렬로 테스트 돌릴 일이 있으면, 위임 프롬프트에 "네 전용 TEST_DATABASE_URL(예: nblog_test_<네이름>)을 만들어서 써라"를 기본으로 넣을 것.

관련: [[project_nblog_saas_account_domain_decision_2026-08-10]]
