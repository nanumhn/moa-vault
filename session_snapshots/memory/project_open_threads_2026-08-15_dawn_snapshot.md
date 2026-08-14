---
name: project_open_threads_2026-08-15_dawn_snapshot
description: "2026-08-15 04시 새벽저장 스냅샷 — 최우선=AI본문자동화 QA통과·배포대기(OpenAI키 필요), k-saju Lightsail 여전히 형액션 대기"
metadata:
  type: project
  originSessionId: f3737d80-1863-4133-a282-d39f5bf4e896
  modified: 2026-08-14T19:25:43.812Z
---

**★최우선 — nBlog "AI 본문자동화" 신규기능, 코드완성+QA통과, 배포만 남음(형 액션 대기)**
- 2026-08-14 오후~야간 하루 만에 체크리스트 9개 항목(설계→권한게이팅→키워드입력→GPT연동→배치스케줄러→검토대기UI→크레딧블로그당전환) 전부 완료, 866개 테스트 통과.
- qa-lead-jian 1차검수 조건부FAIL(치명: 운영SSH개인키+.git이 배포빌드에 실릴 뻔함, 과거유출은 없었음 확인됨) → cto 3건 수정 → 재검수 PASS.
- **배포 전 형 액션 필요**: ①**OpenAI API키 발급**(최우선, 이게 없어서 실제 생성 미검증 상태) ②Pexels API키 운영서버 설정 확인 ③AI_MEDIA_DIR 디렉토리 설정. 배포 순서=마이그레이션 먼저→앱배포, git pull --rebase 필요(로컬 main이 origin 대비 ahead 15/behind 2).
- 가격정책 확정: 유료회원 애드온 블로그당 월2만원/60편, 프리미엄 블로그당 월1.5만원(3블로그묶으면 4.5만원, 25%할인, 편당250원).
- 실사용 테스트로 "서울 맛집 순회" 시리즈 3편(성수동/을지로/연남동) "AI is Life~!" 테스트블로그에 발행등록 완료(READY, 슬롯 8/15 10:33·20:25·8/16 오전) — 다음 세션에서 실제 라이브 발행됐는지 확인 필요.
- 로컬 main 커밋체인(push 안 됨): 1b27930→6cd5795→a9349e5→1f3ee4c→0803a9b→6b6a8ce→87e9621→44358e8→f9416d8→dda8f2c→4377492
- 관련: [[reference_nblog_ai_draft_pricing_2026-08-14]](없으면 이 파일이 원장), docs/ai-draft-design.md §9~§17에 설계·구현기록 전체

**할일 남음(급하지않음)**:
- 태스크#10: 테스트용 서울맛집 이미지 3장(public/test-assets/seoul-food-series/, 7MB)을 git에서 정리(임시 우회용으로 커밋했던 것)
- QA가 지적한 비블로커 항목들(게이트 오탐 가능성, A·J열 동시삭제시 1회중복발행, sheets/archive.ts 무한누적, 애드온 계정단위 온오프 등) — 배포 후 여유될 때

**여전히 대기 중(장기 미해결)**:
- k-saju Lightsail 이전 — 형 AWS콘솔 액션 5개 계속 대기중([[project_ksaju_vercel_migration_plan_2026-08-12]])
- nBlog 만료제한 기능 — push 결재 대기(정책결정 2건: 사용법페이지 만료자노출여부, 구글시트동기화 계속둘지)

**오늘(8/14) 세션 중 실수 4건**(업무일지에 상세 기록됨, `70 Record/2026/08/2026-08-14.md`):
- 초반 ack만 reply, 실답변 transcript에만 써서 51분 재촉받음
- 덱스 작업지시를 형-클로 메인채널로 오발송
- 3002 dev server를 배경작업 도중 킬(운좋게 무사)
- PC1(형 딕테이션용)≠서버(하네스 도는 곳) 혼동, 형이 직접 정정

관련: [[project_revenue_model_redesign_final_2026-08-12]] [[project_ksaju_vercel_migration_plan_2026-08-12]]
