---
name: project_100eok_club_naming_2026-08-16
description: "nBlog 베타 지원 파트너 모임 명칭 = \"OO클럽\"(100억클럽 최초), 부가서비스 전체 무상지급 대상"
metadata: 
  node_type: memory
  type: project
  originSessionId: 32301e64-d743-427e-947a-2f01b790db21
  modified: 2026-08-16T09:34:30.633Z
---

형이 nBlog 베타서비스를 지원해주는 외부 모임을 "100억 클럽"이라 부르며, 소속 회원에게 구독의 부가서비스(A서비스·B서비스 등) 전체를 무상 지급하기로 했다. "클럽"과 "그룹" 중 명칭을 정리해달라는 요청이 와서, "클럽"으로 통일 추천·채택함(형이 이미 "OO클럽" 패턴으로 부르고 있고 향후 10억클럽 등 규모별로 계속 생길 예정이라 통일성 우선).

**결정**: 통칭="파트너 클럽", 개별 클럽명은 자유텍스트(현재: 100억클럽). `D:\Develop\nblog-saas\docs\glossary.md`에 용어집 신설해 기록.

**현재 기술 연동**: 초대장 발급 시 `--note "100억클럽"`으로 태깅 가능(기존 인프라), `member-table.tsx`의 `inviteNote` 표시로 관리자가 소속 확인 가능. 단 클럽 소속이어도 A/B서비스가 자동으로 켜지진 않음(수동 토글 별도) — 자동 일괄부여는 미착수, 형 확인 필요.

**Why:** [[feedback_naming_glossary_as_we_go]] 원칙에 따라 신규 개념 등장 즉시 기록.

**How to apply:** 다음에 "OO클럽" 관련 요청 오면 이 명명 규칙 따를 것. 클럽 소속 자동 부가서비스 부여 기능은 아직 안 만들어졌으니 완료로 착각하지 말 것.

관련: [[feedback_naming_glossary_as_we_go]] [[reference_nblog_saas_prod_admin_access_2026-08-12]]
