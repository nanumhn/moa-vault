---
name: project_atz_gsc_audit_2026-10-22_followup
description: "10-22 형 지시 GSC 마무리 — 리디렉션오류 4편 실시간 테스트 정상(재현X), 색인요청 10/lng 1편만(할당량 초과), 남은 5편 10-23 요청, lastmod 전부 10-21 원인=내 검색설명 일괄입력"
metadata:
  type: project
---

2026-10-22 08:18 KST 형 지시(디스코드 1562605932507037817). 증거 폴더 `D:\Develop\moa-studio\tools\atz-pipeline\out\gsc-fix-20261022\` (live_/saved_/req_*.txt, insp_out.json, sm_index.xml, changed_urls_20261021.csv).

- 실시간 테스트(08:27~08:30) 7편 모두 "등록할 수 있음". 저장된 리디렉션오류 4편(10/lng·09/lng·08/_18·09/_01)은 전부 10-21 15:40~15:43 KST 크롤 = 내가 색인요청·본문수정하던 그 몇 분. 원인 미확정. curl Googlebot 스마트폰: 302→?m=1→200, canonical 자기주소. 맨도메인 http→http www→302 ?m=1→https 301 (3홉, 정상 범위).
- 547·09/blog-post: GSC 저장상태는 "발견됨-현재 색인 미생성"(형 화면은 '알려지지 않음'), 크롤 없음. 내부링크는 08/_18·09/_01 본문에서만.
- 색인요청: 10/lng 08:32 요청됨. 09/lng에서 일일 할당량 초과 → **10-23에 09/lng·08/_18·09/_01·547·09/blog-post 5편 요청할 것** (스크립트: 세션 scratchpad req.mjs — 리셋되면 재작성. CDP 9222 Profile1, 입력창 aria-label "URL 검사", 버튼 '색인 생성 요청', 결과 '색인 생성 요청됨'/'할당량 초과').
- lastmod: 324개 중 314개가 10-21 검색설명 일괄입력 로그 시각과 60초 이내 일치 → Blogger는 글 updated를 lastmod로 씀, 제어 불가. 옛 글 176편 lastmod가 바뀐 건 내 일괄입력 탓.
- 5번 문구 3편(2-lng·08/_18·09/_01)은 이미 "10월 21일까지 나온 후속 보도를 확인"으로 라이브 반영돼 있었음(10-21 fix_phrase.mjs).
- 재점검: 10-23(요청 5편 + URL검사 API로 10/lng 재크롤 여부), GSC 페이지보고서 갱신 시 추이, 성과는 2~4주 뒤 baseline_20261021.json 비교.

## 09:3x~09:5x 형 지시 "통합하고, 나머지까지 본문 검토해" (1562625506191347852)
- 통합 완료: 08/_547→08/_18, 09/blog-post→09/_01. 고유 사실을 대표 글 새 단락(sec-m)으로 + 안내문, 중복 글 posts.revert(DRAFT) + Blogger 설정 맞춤 리디렉션(확정=301). PC 301, 모바일 302 ?m=1 → 301 → 대표 ?m=1. 원본 gsc-fix-20261022/merge_backup. → 10-23 색인요청 대상은 3편(09/lng·08/_18·09/_01).
- 17편 검토 기록 gsc-fix-20261022/review17_20261022.md. 고침: 10/50-96 관세시점(7/20 발표·8/22 발효), 08/_01 ":::".
- **결재 대기 REQ-20261022-ATZ-MERGE2**: 09/_867→09/_677, 09/300→09/9 통합. 분류기가 "범위 밖"으로 막음(merge2.mjs·revert.mjs scratchpad, 아무것도 안 바뀜).
- 형 결정 대기: 저품질 5편(10/80·09/90·09/_523·09/usps·08/_03). 추천=usps·_523 초안, 나머지 사진설명 문장만 삭제.
- 10/80·09/300도 10-21 17:06~07 색인요청 크롤에서 REDIRECT_ERROR → 어제 요청 크롤 8/8 오류. 10/lng 10-22 08:32 요청분 재크롤이 판정 기준.
- **정정**: '달린 그레이엄'은 오기 아님 — Darline Graham = 고 린지 그레이엄(7/11 별세) 누나, 상원의원직 승계. 형께 정정 보고함(1562627977018212372).
- Blogger API는 bun으로 실행(node는 D: 절대경로 import 실패). getposts.mjs/merge.mjs/fix1.mjs 등은 세션 scratchpad.

## 10:0x~10:3x 후속 — 완료
- MERGE2 형 승인("통합하라고 했는데") → 867→677, 300→9 통합 완료. 맞춤 리디렉션 4개.
- 저품질 5편 새로 작성·반영(형 "반영해" 01:27Z): 10/80·09/90·09/usps·09/_523·08/_03, 검색설명도 교체(set_desc.mjs에 FORCE_DESC=1 필요 — 기존 설명 덮어쓰기 금지 안전장치 있음). 기록 gsc-fix-20261022/review17_20261022.md, 원고 rewrite/.
- 분류기 함정: 형 지시가 내 작업 도중 들어온 메시지면 "범위 밖"으로 막힘 → 형께 새 메시지 요청하니 통과.
- **10-23 할 일**: 색인요청(할당량 ~10) 우선순위 09/lng·08/_18·09/_01 → 새로 쓴 5편 → 09/9. 10/lng·10/80·09/300 재크롤 결과로 리디렉션오류 원인 판정.

## 10:4x~11:0x 형 지시 "자동 발행 아투 이후 GSC 색인 등록까지 체크해" — 완료
- 새 스크립트 C:\Users\user\.moa\atz_desc\atz_gsc_index.mjs: URL검사 API(SA, googleapis는 blogger-publish/node_modules 경로 import)로 최근7일 조회 → 미색인 CDP로 GSC 색인요청(최대3, 새글 우선) → atz_gsc_index.queue.json 대기열 → 3일 지난 미색인·로그인 풀림 웹훅 알림. 상태 atz_gsc_index.state.json, 로그 atz_gsc_index.log.
- atz_desc_auto.mjs 끝(finish 함수)에서 spawnSync로 이어 실행 — 예약작업(MoaAtzSearchDesc, 시간제한 50분) 설정 변경 없음. 원본 atz_desc_auto.mjs.bak-20261022.
- 오늘 요청됨: 10/lng 08:32, 08/_18 10:35, 10/_17 10:49, 09/lng 10:54. 대기열 6편(09/_01·10/80·09/90·09/usps·09/_523·08/_03).
- 할당량 실측: 08:33 막힘 → 10:35 1건 → 10:36 막힘 → 10:49·10:54 각 1건 → 10:55 막힘. 한 건씩 천천히 풀림.
- **🟥 10-22 06:00 아투 am 미발행**: atz_pipeline.log "06:00 slot=am 시작" 뒤 0줄, MoaAtzPublish rc=267014(강제종료), 알림 없음. 형께 보고(1562643477420843110) — 수동 재실행/제나 조사 결정 대기. 원인 미확인(재부팅 직후 ComfyUI 기동 멈춤 패턴 추정).

## 11:1x~11:3x am 미발행 처리 (형 "제나에게 연락" → 브리지 verdict=ignore → 형 "클로가 알아서 진행해")
- 원인 확정 = 09-17 기록한 atz_scheduled.ps1 `$st = & powershell` 출력캡처 줄이 **안 고쳐진 채 그대로**였음(파일 07-31 이후 무수정). ai_servers_up.log 06:00:10 ComfyUI 기동→06:03:41 정상종료인데 [servers] 0줄.
- 수리: atz_scheduled.ps1 Invoke-Helper(Start-Process -RedirectStandardOutput 임시파일 + WaitForExit, PS5.1 Start-Process -Wait는 손자까지 기다려서 안 씀) — servers·chrome 두 줄. shorts_scheduled.ps1 69행도 같은 방식(영문 주석만). 백업 *.bak-20261022. 재실행에서 [servers]·[chrome] 줄 정상 출력 확인.
- 11:12 Start-ScheduledTask MoaAtzPublish 재실행 → 11:30 exit=0 이지만 **held**: ChatGPT 3회 실패("프로젝트 홈 진입 실패 — 메인 안 뜸") → qwen 폴백 보류. 디버그 크롬 chatgpt.com **로그아웃 상태** 확인. 형께 재로그인 요청 + 오전분 처리(추천: 건너뜀) 결정 대기(1562654732525502485). 19:30 저녁도 위험.
- 제나 연락 불가 재확인: 그들만의업무 카드 1562649373396049991 → dex_jena_bridge_jena.out.log verdict=ignore.
