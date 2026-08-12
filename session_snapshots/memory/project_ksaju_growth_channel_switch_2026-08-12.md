---
name: project_ksaju_growth_channel_switch_2026-08-12
description: k-saju SEO채널 사망확정+17편 CTA링크 누락버그 발견수리+56일 진성고객0 재확인. 형 결정 2건(Reddit게시·유료테스트) 대기
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T04:21:32.740Z
---

2026-W33 revenue-review 액션2([[project_revenue_review_lapsed_2026-08-12]])로 강나라(growth-head-narae)가 진행.

**확정 사실(실측)**:
- SEO 채널 사망 확정: GSC 서비스계정 직접조회, 28일(7/15~8/10) 428노출/클릭7 — 7클릭 전부 브랜드검색("saju studio"), 발견형 키워드 클릭 0. 8/3부터 발행도 멈춰있었음.
- **43편 중 17편이 CTA 링크 자체가 없던 버그** 발견+수리(커밋 `d7d3896`, k-saju-blog 레포) — "Visit k-saju.me today"가 하이퍼링크 없는 일반텍스트였음. 195개 앱링크 UTM 전수계측 완료.
- 56일간 신규가입 0명 재확인(가입9=전부 example.com/.local/k-saju.me 테스트계정). CSO 미해결질문 답: "유입 자체가 없어서 0" — 전환율 논할 표본이 없음.
- **인지도 문제 발견**: 브랜드검색은 클릭되는데 일반검색 0 → SEO 문제 아니라 "아무도 이름을 모름". "배우이름+사주" 검색이 실제로 잡힌 게 K컬처 결합 앵글의 실수요 단서.

**형 결정 대기 2건**:
1. Reddit 게시 — 콘텐츠는 47일째 완성돼 대기 중(병목=게시 안 함, 콘텐츠 부족 아님). 형 계정으로 게시 필요.
2. 유료 마이크로테스트 $30~50 — CSO리뷰("무비용만")와 클로 지시("유료테스트 예시")가 충돌해서 강나라가 집행 보류하고 결재로 올림. 강나라 추천=승인(오가닉 하루15노출로는 5일내 표본 물리적으로 불가능).

**갭**: GA4 채널별클릭은 에이전트가 못 읽음(구글 인터랙티브로그인 필요) — cto한테 클릭로깅 리다이렉트(`/go/{채널}`→DB) 붙이는 걸 권고받음, 아직 미착수(cto가 k-saju마이그레이션 계획 먼저 처리 중이라 대기).

**push 이슈**: 3개 레포(k-saju-blog 등) 커밋만 되고 GitHub 인증문제로 push 안 됨 → 클로가 대신 push 처리 중(덱스와 같은 패턴).

관련: [[project_revenue_review_lapsed_2026-08-12]] [[project_ksaju_live]] [[reference_owenlab_git_push_gh_credential]]
