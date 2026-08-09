---
name: feedback-naming-glossary-as-we-go
description: 새 프로젝트에서 새 개념/객체가 나올 때마다 이름을 그때그때 확정하고 용어집에 기록해라 (형 지시 2026-08-09)
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2011fea8-a01f-4447-8ea4-5adf31904c4c
  modified: 2026-08-09T06:11:13.170Z
---

새 프로젝트(특히 여러 화면·객체가 생기는 SaaS류)에서 관리자 화면·에이전트·잡 등 새 개념이 등장하면, 확정 안 된 채로 "관리자 툴"/"대시보드" 등 여러 말을 섞어 쓰지 말고 즉시 후보 이름을 던져 형 확정을 받고 문서화한다.

**Why:** 형이 명시 지시(2026-08-09, 네이버블로그SaaS 작업 중) — 용어가 흔들리면 형과 클로 사이, 그리고 각 본부장 보고 사이에서 같은 대상을 다르게 부르며 혼란이 생긴다고 판단.

**How to apply:**
- 새 프로젝트에서 새로운 화면/컴포넌트/역할이 생기면 즉시 형에게 이름 후보 1~2개 제시하고 확정받는다.
- 확정된 용어는 프로젝트별 용어집 파일(예: `moa-vault/10_Wiki/Projects/{project}_glossary.md`)에 즉시 추가.
- 이후 모든 보고·코드 주석·문서는 확정된 용어로 통일한다.
- 첫 적용 사례: [[project_naver_blog_saas_2026-08-08]] — "관제센터"(서버 관리자 대시보드), "발행 에이전트"(PC 설치 프로그램) 확정, `moa-vault/10_Wiki/Projects/naver_blog_saas_glossary.md`.
