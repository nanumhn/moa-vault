---
name: project_weekly_report_w36_2026-08-31
description: "W36 주간전략리포트 핵심 — 아투 OAuth항목 전제무효 발견·색인진단으로 교체, SendMessage는 배분도구 아니고 Agent스폰만 배분수단, revenue-review 2주공백 재등록"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-30T23:52:44.628Z
---

2026-08-31(월) 주간 전략 리포트(cron ④) 실행. research-lead-seoyun·cso-jiyoung·cto-seojin(×3)·data-finance-jiwon·growth-head-yoonseul·coo-dohyun·qa-lead-jian 총 8회 스폰(위임 기록: 08:07~08:34 KST).

**핵심 발견 1 — 아투 OAuth 재인증 항목(3주 연속 미착수) 전제 자체가 무효였음**
[확인, cto-seojin] 아투 Search Console 데이터는 별개 서비스계정(`webmasters.readonly`)으로 37일째 정상 수집 중 — `tools/blogger-publish/config.mjs`의 Blogger OAuth 스코프와는 인증 주체가 달라 무관. 3주간 "형 결재 대기"로 잡혀 있던 블로커는 실재하지 않았다. 이 항목은 폐기하고, 대신 그 리포트가 드러낸 진짜 문제(색인 92.4% 정상인데 28일 노출12·클릭0·서로다른검색어4개뿐, 250편중176편이 2025-04~05 집중 후 13개월 휴면)를 다음 주 아이템으로 전환. 가설: A(검색수요 미겨냥, 유력)·B(originality-gate 72/72 FAIL인데 발행 안 막힘, 동반). 다음 시험: 색인된 글 5편 제목 정확검색으로 A/B 구분.

**핵심 발견 2 — SendMessage는 배분 도구가 아니다**
cso-jiyoung이 owner 6명에게 SendMessage 시도 → 전원 "No agent named ... reachable" (배분 실패로 오진할 뻔함). 실제 원인: SendMessage는 이미 실행 중인 에이전트에게만 가고, **새 역할명으로 에이전트를 스폰하는 것은 Agent 도구를 가진 main만 가능**. 이번 주 main이 직접 스폰하니 6개 역할명 전부 스폰 성공 — "호출 불가능한 이름"은 없었다. W35가 신설한 "TaskCreate id로 배분 증거" 절차는 애초에 TaskCreate가 클로 세션에 없어 불가능했던 것으로 재확인([[project_w35_measurement_and_premise_failures_2026-08-24]]). 배분 증거를 "main 스폰 시각 + 에이전트 이름"으로 교체.

**핵심 발견 3 — revenue-review cron 2주 연속(W35·W36) 미발화**
[[project_revenue_review_lapsed_2026-08-12]](7주 미발화 사고)의 재발. `moa-vault/10_Wiki/Finance/weekly/`에 W35·W36 파일 없음, 최신 W34(8/20). 이번 세션이 cron(`0 10 * * 1`) 재등록 — 재등록만으론 복구 증거 아님(08-12도 재등록 후 2주만에 재사망), 10:02 자동재확인으로 파일 실제생성 여부 검증 예정.

**핵심 발견 4 — k-saju GA4 계측 1단계(송신) 복구 확인**
[확인, data-finance-jiwon] `ksaju_instrument_canary.mjs` 실행 결과 08-24 0건 → 08-31 2건(page_view+landing_view). **송신복구≠유입회복** — 2단계(GA4리포트 반영) 판독 도구(`ga4_realtime_check.mjs`)는 GA4로그인크롬 필요, 형 결재(GA4 속성에 서비스계정 뷰어 추가)로 무인화 가능.

**신규 하네스 결함**: [[feedback_dont_coach_magic_phrase_past_guard]] 참고 — 위임관문이 cron턴에서 오케스트레이터도 막음(08-31 신규 확인). 리포트·리서치 파일을 moa-studio 표준경로에 저장 못하고 스크래치패드+웹훅 대체 발송(HTTP 200 확인).

**How to apply**: W37 리포트는 이 문서의 §10 확인표(item-queue.json 존재·색인A/B시험결과·GA4뷰어승인여부)부터 검증할 것. coo-dohyun이 설계한 반증조건("세션밖 미룸=0%" 가설)도 이때 판정.

전문(스크래치패드, moa-studio 저장 대기 중): `C:\Users\user\AppData\Local\Temp\claude\D--Develop-Claude-Channels\1c673286-4329-4b1e-bbb7-136408636181\scratchpad\report_2026-W36.md`
