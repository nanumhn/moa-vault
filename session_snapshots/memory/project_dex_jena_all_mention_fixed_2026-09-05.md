---
name: project_dex_jena_all_mention_fixed_2026-09-05
description: "덱스·제나 @모두 멘션 트리거 수리완료(2026-09-05) — 커스텀 역할 이름 매칭 추가, 형 실측확인, 커밋 d35103e"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2ab22672-428f-4355-bec6-61395ab2f76e
  modified: 2026-09-04T15:38:34.081Z
---

형이 "@everyone"과 커스텀 "모두" 역할 멘션으로 덱스·제나를 한번에 부르려 했으나 둘 다 무반응이었던 문제, 원인 확인 후 수정 완료.

**1차 원인 확인**: `D:\Develop\dex-jena-bridge\src\index.mjs`의 `mentionsMe`/`mentionsAnyone`이 디스코드가 봇마다 자동 생성하는 "통합 역할"(`r.tags?.botId === client.user.id`)만 인식했고, 형이 만든 커스텀 "모두" 역할은 이 조건에 안 걸려서 무반응이었다.

**1차 수정(실패)**: 텍스트 "@모두" 문자열을 OR 조건으로 추가했으나, 실제 전송되는 메시지는 디스코드 자동완성이 `<@&역할ID>` 토큰으로 치환해버려서 "@모두"라는 글자 자체가 메시지에 안 남는다 — 형 재테스트에서 무반응 재확인.

**2차 수정(성공)**: 역할 이름 매칭(`r.name === '모두'`)을 추가 — `<@&역할ID>` 토큰이 와도 그 역할 객체의 `name` 필드로 직접 판별하므로 자동완성 여부와 무관하게 잡힘. 형이 [엔블 005-03] 스레드에서 실제 역할 멘션으로 재테스트 → "반응 온다" 확인.

**작업 절차 메모**: 이 파일은 위임관문 화이트리스트 밖(dex-jena-bridge)이라 편집마다 형이 "네가 직접 수정해"를 매턴 다시 말해야 했다(총 2회). 코드 수정 후 `http://127.0.0.1:3888/api/manager/jobs/<id>/restart` MOA관리자 API로 반영했는데, **API 응답 자체는 restart 직후 캐시된 이전 pid/lastStartedAt을 돌려줘서 즉시 신뢰하면 안 된다** — `/api/manager/jobs`를 재조회하거나 `Get-Process -Id <pid>`로 실제 프로세스 존재·기동시각을 재확인해야 진짜 반영 여부를 알 수 있다(이번에 두 번 다 첫 응답은 stale, 재조회로 확인).

**커밋**: `d35103e`(`bridge-fence-seojin` 브랜치, `src/index.mjs` 1파일만 — 같은 트리에 있던 `src/approval.mjs`의 무관한 변경분은 건드리지 않음).

**How to apply**: 앞으로 덱스·제나를 한번에 부르려면 커스텀 "모두" 역할을 멘션하면 된다. 다음에 비슷한 트리거 문제가 생기면 이 파일과 `mentionsMe`/`mentionsAnyone`(index.mjs ~440줄)을 먼저 볼 것. MoaManager `/restart` 응답을 곧이곧대로 믿지 말 것(재조회 습관화).
