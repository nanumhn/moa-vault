---
name: project_enbl00503_deployed_2026-09-04
description: "[엔블 005-03] 회원관리 UI 모달화+가로스크롤 근본수리(white-space 상속)+2열 반응형 — 전부 완료(2026-09-04 13:51 KST 형 최종확인). 로컬재현은 DOM 트리 위치까지 복제해야 한다는 교훈 포함"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2ab22672-428f-4355-bec6-61395ab2f76e
  modified: 2026-09-04T13:52:24.814Z
---

형이 [엔블 005-01] 배포 직후 회원관리 페이지 스크린샷을 보고 "기존 스타일과 동떨어진 느낌"이라 지적 → 새 이슈 [엔블 005-03]로 상정 → 완료까지 전 과정.

**변경 내용**: 연장신청 테이블의 인라인 3버튼+textarea, 회원 표의 인라인 확장(RowGroup) 둘 다 기존 공용 `ModalDialog`(`_components/detail-modal.tsx`) 재사용한 모달로 통일. 상태는 `<select>` 하나로(대기중/처리중/처리완료/거절), 서버 전이 가드와 정확히 대응하는 값만 활성화(`disabled`로 불가능한 전이 UI단에서 차단). `updateExtensionRequest` 통합 서버 액션 신설. `ModalDialog`에 선택적 `dialogClassName` prop 추가(폭 560px→760px, 기존 3개 호출부 무영향).

**결과**: 커밋 `502d1ef` → 릴리스 `20260904195708`. 배포 시 서버 여유메모리 부족(242MB<260MB 기준)으로 무중단(블루그린) 대신 재시작 모드로 자동 하향, 짧은 503 4회 있었으나 이후 전부 정상.

**★harness 결함 발견(중요, 별도 기록)**: 위임관문(`guard-silence-and-delegation.mjs`)의 `userAuthorizedDirect()`가 정규식(`위임...하지말/없이` 패턴) 매칭만으로 승인을 판정해서, 서브에이전트(cto-seojin)에게 보낸 클로의 메시지에 우연히 들어간 문구로 관문이 오작동해 열렸었다. cto-seojin이 이걸 스스로 발견하고 재현·우회 없이 멈춰서 형께 보고 → 형이 "네가 직접 수정해" 직접 지시 → 클로가 이어받아 나머지 파일 직접 편집. SendFeedback으로 이 결함을 이미 큐에 넣어뒀다(형 승인 시 전송).

**How to apply**: 다음 세션이 "[엔블 005-03]"을 열린 작업으로 취급하지 말 것 — 완료됐다. 회원관리 UI 관련 요청이 다시 오면 이 모달 패턴(`ExtensionRequestModal`, `member-table.tsx`의 `RowGroup` 안 `ModalDialog`)을 참고선례로 쓸 것. 위임관문 결함은 [[reference_dex_clo_jena_role_split_2026-09-04]]와 무관한 별개 인프라 이슈로, 재발 시 SendFeedback 참고.

**★후속 수리(같은 날 11:09)**: 형이 스크린샷으로 회원관리 모달 가로 스크롤을 지적 → 원인=`.field-row`(2열 grid)+`.page-actions`(줄바꿈 없는 flex) 조합이 760px 모달 폭에서 넘침 → `.member-admin-dialog` 스코프로 1열 강제+버튼줄 wrap 6줄 CSS 수리(커밋 `2fdc04c`, 릴리스 `20260904200930`). 서버 CSS 반영은 확인됐으나 실제 브라우저 픽셀 확인은 아직 형 육안 확인 대기 중 — 다음에 형이 "아직도 스크롤 있다"고 하면 이 수리가 실패했다는 뜻이니 재조사할 것.

**★배포 반복 패턴 발견**: 이날 배포 6번 중 5번(20260904195708·200930·203408·213219·220138)이 서버 여유메모리 260MB 기준 미달(242~259MB)로 재시작 모드+짧은 503(4~5회)이 났다. 마지막 배포(220138→224537, 2열 반응형)에서야 263MB로 기준을 넘겨 진짜 무중단(42/42 헬스체크 200) 성공. 서버가 만성적으로 메모리 여유가 빠듯한 상태로 보인다 — 반복되면 형께 서버 자원 점검 제안할 것.

**★★진짜 근본 원인 (2026-09-04 12:41, 4차 시도 만에 발견)**: 가로 스크롤은 없앴는데도 텍스트가 계속 잘리던 진짜 원인은 `.data-table td{white-space:nowrap}`이 표 `<td>` 안에 렌더링되는 관리 모달(`<dialog>`)까지 CSS 상속된 것이었다(제나 발견). `<dialog>`가 `showModal()`로 화면 최상단에 뜨는 것은 시각적 레이어일 뿐, DOM 트리 상속 경로는 안 바뀐다 — 이 함정을 놓치면 모달 CSS를 아무리 고쳐도 못 잡는다. 수정: `.member-admin-dialog{white-space:normal}` 한 줄(커밋 `e220c15`).
**★로컬 재현이 계속 실패했던 이유**: 클로의 로컬 테스트 HTML이 `<dialog>`를 `<body>`에 직접 뒀지 `<table><tr><td>` 안에 안 넣어서, 진짜 원인(td→dialog nowrap 상속)을 매번 놓쳤다. 이후 실제 DOM 구조(표 안에 중첩)까지 재현하고 나서야 JS로 `getComputedStyle().whiteSpace`가 `nowrap`→`normal`로 바뀌는 걸 직접 재현·검증할 수 있었다. **교훈: 로컬 재현본은 스타일뿐 아니라 실제 DOM 트리 위치(부모 요소 체인)까지 그대로 복제해야 한다 — 상속·특이도 문제는 컴포넌트만 떼어 재현하면 놓친다.**

**최종 커밋 체인**: `502d1ef`(모달화) → `2fdc04c`(1차, field-row 1열) → `b4d5eee`(2차, overflow-x:hidden) → `6944b90`(3차, overflow-wrap:anywhere) → `731d578`(4차, overflow-y:auto+padding-bottom, 근본원인 아니었음) → `e220c15`(★근본수리, white-space:normal) → `1b04722`(5차, 2열 반응형+480px 미만 1열). 최종 릴리스 `20260904224537`, 형 스크린샷으로 최종 확인 완료.
