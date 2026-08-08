---
name: project-naver-blog-saas-2026-08-08
description: "네이버 블로그 자동화 SaaS 기획 — 페이즈0 API조사 완료, 형 노선결재(㉡ PC설치형) 완료, 페이즈1 착수 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6279da50-7746-403f-8908-ff9f9f98e5b4
  modified: 2026-08-08T19:25:21.583Z
---

**결정 문서**: `moa-vault/10_Wiki/Decisions/2026-08-08_naver_blog_saas_plan.md` (커밋 81c1b24까지 push 완료)

**진행 경과**
1. 2026-08-08 오전 coo-dohyun 주관 기획 회의 — 제품정의(멀티테넌트 네이버블로그 자동발행 구독형 SaaS) 확정, 포스팅 실행방식(안A 브라우저봇 vs 안B 공식API)은 보류.
2. 페이즈0: cto-seojin이 라이브 서버 직접 검증 — **네이버 블로그 글쓰기 공식 API는 폐지됨**(`openapi.naver.com/blog/writePost` → 404·051, 대조군 4개는 전부 401로 생존 확인). 안 B 폐기. qa-lead-jian 독립검수 PASS.
3. 부수 발견: 네이버 **카페** 글쓰기 API는 살아있음 — 타깃 전환 아이디어로 제시했으나 형이 반려(원안 유지 지시). [[feedback_stick_to_original_product_definition]]
4. 형 노선결재 완료(2026-08-08): 제품정의(블로그 타깃)는 원안 유지, 실행방식은 **㉡ 사용자 PC 설치형 에이전트**로 확정. 형이 "PC용 에이전트 반향이 좋다"는 시장 신호도 언급하며 확인.

**아직 안 풀린 것**
- 가격: 회의 제안 월 48만원 단일 플랜인데 근거 수치(대행시세 인용)가 회의 중 흔들려서 미검증. 형 결재 대기.
- 네이버 저품질(기계생성 글 검색노출 제한) 리스크 — 회의에서 "일 1회 제한" 정도로만 다뤄짐, 사업 존폐 변수라 별도 심화 필요.

**추가 보완(2026-08-08, 형 승인 완료·문서 반영·push 완료)**:
- 블로그 연결 상한 사용자당 3개, 요금제 연동(기본1개+상위플랜 추가)
- 글감: 사용자 직접채움(기본) + AI 대행채움(유료 업셀) → 가격구조를 "다층"으로 확정(구체 금액은 미정)
- 발행 빈도: 블로그당 하루 최대 2회·12시간 간격 — 저품질 리스크 1차 완화책
- 서버-에이전트 하트비트(주기 상태체크)로 PC꺼짐 감지, 이벤트별 단계 타임스탬프 로그

**다음 단계**: 페이즈1(기획·설계) 10라운드 끝에 PASS(2026-08-08). 형 결재 5건 완료(설계승인·요금이월·구글시트=서비스계정공유·코드서명=우선없이진행·레포=nblog-saas포트3002) + 배포는 Vercel+Neon 승인. 페이즈2(개발) 착수 — 레포 D:\Develop\nblog-saas, DB제약9개/에이전트API7개/job-reaper(타임존버그발견+수정)/slot-planner 전부 qa통과+push완료. cron등록+sheet-sync(구글시트글감연동)도 cto가 완료하고 push까지 함(커밋713f378, 자체뮤테이션실수 발견해 c1a448b로 수정) — **qa검수 아직 안 걸림, 다음 세션이 할일 1순위**.
**★형이 명시적으로 강조(2026-08-08 12:10)**: "사용자 PC 에이전트(실제로 네이버에 로그인해서 글 올리는 프로그램)"가 이 프로젝트의 핵심이니 특히 잘 챙기라고 지시. 아직 착수 전 — 다음 세션 2순위.
**진행중(2026-08-08 야간 기준)**: 덱스(Codex)가 대시보드 화면+NextAuth 구현중(워크스페이스권한 2번 막혔다 해결됨, 진행상황 문의해둔 상태로 응답대기). 제나(Gemini)는 저품질리스크 리서치 완료·반영됨.
**GitHub**: https://github.com/nanumhn/nblog-saas (비공개, nanumhn계정) — 전부 push 완료 확인.
**형 피드백 다수 반영됨**: [[feedback_report_each_stage]](라운드마다+이슈즉시 보고), [[feedback_qa_loop_speed_over_exhaustiveness]](치명/중대만 엄격, 경미는 통과), [[feedback_delegate_to_dex_jena_proactively]](덱스·제나 적극병렬배분), [[feedback_verify_push_not_just_commit]](커밋≠푸시, nblog-saas 수시간 로컬only였던 사고), [[feedback_stick_to_original_product_definition]]
