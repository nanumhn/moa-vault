---
name: project_w34_metrics_and_bugs_2026-08-12
description: 2026-W34 재무측정 완료(6주공백 완전해소)+churn동기화버그·이벤트추적0회호출 발견. 형승인 2건이면 애드센스+블로그PV+유튜브수익 전부 열림
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T04:22:52.808Z
---

[[project_revenue_review_lapsed_2026-08-12]] 액션1(data-finance-jiwon) 완료. 산출물 `moa-vault/10_Wiki/Finance/weekly/2026-W34_metrics.md`, [측정안됨] 0개.

**헤드라인 숫자**: 매출 ₩0 / 월고정비 ₩50.1만~52.0만 / 순손익 −₩50.1만~52.0만 / 갭 −₩2,050만(목표2,000만 대비 진척0%). W33이 "산출불가"였던 순수익이 처음 숫자화됨.

**핵심 발견**:
- Gumroad 생애거래 2건뿐(전부 형 본인), 진성고객 0, 신규가입 6/16 이후 57일간 0명.
- **CSO가 "애드센스만이 유일한 트래픽 계측기"라고 잘못 전제했음** — 실제론 k-saju.me Search Console이 6/14부터 등록+데이터축적돼 있었는데 아무도 안 봤음. 블로그 286노출/클릭1, 앱 148노출/클릭7 — 강나라의 SEO사망 진단과 독립적으로 일치.
- GA4: 47일 세션41(하루0.87), 전환1건(형본인 결제뿐).
- 퍼널: 1차병목=유입(블로그 클릭률 0.35%) 확정. 단 참여세션15→이메일입력0이라 **전환이 작동한다는 증거 자체가 없음**(전환 여전히 미검증).
- 환율 실측(₩1,412.87)이 기존가정(1,330)보다 6.2% 높음, Neon=Free($0) 확정.

**★버그 2건 발견(cto 전달 필요, 아직 미착수)**:
1. Gumroad 구독취소가 운영DB에 반영 안 됨(DB=active, Gumroad=cancelled:true) — churn 추적이 원리적으로 깨져있음.
2. `trackEvent()` 호출처가 코드 전체에 **0개** — 익명 리딩은 DB에도 안 남아서 퍼널 중간구간이 완전 공백.

**형 승인 대기 2건("이거 하나면 나머지 다 풀림")**:
(A) 아투 구글계정 OAuth에 `adsense.readonly`(+`yt-analytics-monetary.readonly`) 스코프 추가 재인증(1클릭, blogger-publish 토큰 이미 아투계정 인증돼있어서 스코프만 부족) — 애드센스매출+블로그PV+유튜브수익 3개 동시 영구자동화.
(B) Vercel 요금제 확인(Hobby/Pro) — [[project_ksaju_live]]의 Hobby상업이용위반 건과 연결.

**Why**: [[project_revenue_review_lapsed_2026-08-12]]에서 시작된 6주 측정공백 해소 작업의 최종 완료.

**How to apply**: 형이 (A)(B) 처리하면 바로 재측정 가능. churn버그·trackEvent버그는 cto-seojin에게 위임 필요(아직 미배정). 다음 주간리뷰(8/17)는 이 W34 metrics를 베이스라인으로 갭 축소 여부 판정.

관련: [[project_revenue_review_lapsed_2026-08-12]] [[project_ksaju_live]] [[project_ksaju_growth_channel_switch_2026-08-12]]
