---
name: project_meta_app_review_root_cause_2026-08-19
description: "Meta 앱심사 진짜 원인 확정 — 코드 미배포가 블로커, 권한명 정정, 배포는 형 승인 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 99967856-b103-4d28-9541-54ba1cbe4809
  modified: 2026-08-18T16:04:00.610Z
---

**결론**: [[project_open_threads_2026-08-18_afternoon_snapshot]]의 "Meta 앱심사 진행단계 미회수" 건, cto-seojin 재조사로 원인 확정됨(2026-08-19). 앱심사는 "진행 중"이 아니라 **"제출조차 못 하는 단계"**였다.

**권한명 정정 (중요, 재사용 금지 대상)**: 이전에 형에게 안내한 `instagram_basic/instagram_content_publish/pages_show_list/pages_read_engagement`는 틀렸다. 실제 코드(`saju-studio/src/lib/instagram/oauth.ts:32` REQUIRED_SCOPES, `.env.example:129-133`)가 요구하는 건 **instagram_business_basic / instagram_business_manage_messages / instagram_business_manage_comments**. API 호스트가 graph.instagram.com이라 pages_* 권한은 애초에 해당 없음.

**진짜 블로커**: 댓글→DM 자동응답 코드는 완성됐지만 `feat/ig-comment-dm` 브랜치(로컬 커밋 10개)가 origin에 push 안 됨 → main 미머지 → 배포 안 됨. 라이브 확인: `k-saju.me/api/instagram/connect`, `/api/webhooks/instagram` 둘 다 404. Meta 심사에 필요한 "로그인 화면 스크린캐스트"를 찍을 화면 자체가 없는 상태.

**필요 순서**: ①코드 push+배포(cto 소관, 프로덕션 배포라 자동채택 정책에도 불구하고 하네스 classifier가 차단 — 형 승인 필요, 2026-08-19 요청 중) ②Prisma 마이그레이션+Vercel 환경변수 6종(INSTAGRAM_LOGIN_APP_ID/SECRET 등, 형이 Meta 콘솔에서 복사해야 하는 비밀값) ③실연결 1회 성공(스크린캐스트 소재) ④비즈니스 인증(형 액션 필요할 수 있음, 수일~수주 소요) ⑤권한 3개 Advanced Access 신청+스크린캐스트 제출 ⑥승인 후 앱 Live 전환.

**Why**: growth-head-yoonseul의 W34 인스타 댓글/DM 캠페인 게이트#1이 "앱심사 승인+실테스트 통과"인데, 심사가 제출 전 단계라 목표일 8/26은 사실상 불가능, 예비일 9/2도 비즈니스 인증 기간에 따라 위태로움.

**How to apply**: 다음에 "Meta 앱심사 뭐 하면 되냐" 질문 나오면 위 권한명·순서 그대로 쓸 것. cto가 push+배포 승인받았는지부터 확인하고 이어서 진행.
