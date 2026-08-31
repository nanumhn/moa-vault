---
name: project_revenue_review_w36_2026-08-31
description: W36 수익리뷰 핵심발견 — 66일무매출 원인은 유입/전환이 아니라 완성된 게스트체크아웃 코드가 7일째 로컬브랜치에 갇혀 미배포된 것. 액션3개 실배분 완료
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-31T01:42:42.310Z
---

2026-08-31(월) 10:00 KST revenue-review cron 발화, cso-jiyoung 스폰해 실행. 리포트: `D:\Develop\moa-vault\10_Wiki\Finance\weekly\2026-W36_revenue-review.md`(저장 성공 — moa-vault는 moa-studio와 달리 이번 세션 delegation gate에 안 걸림).

**핵심 발견**: k-saju 매출 66일째 0원(마지막 판매 6/26, 11주 연속 무매출)의 병목은 유입·전환·결재가 아니라 **"완성된 코드가 배포에 안 실린 것"**.
- 게스트(비로그인) 체크아웃 수정(커밋 `0678720`·`35dc77f`)이 **8/24 완성됐는데 로컬 브랜치 `guest-checkout-seojin`에 7일째 갇혀 main 미병합·origin push조차 안 됨**. 같은 기간 인스타 관련 커밋 5건은 계속 main에 들어감 — "우선순위 높은 쪽이 아니라 먼저 커밋되는 쪽이 이겼다"(cso 표현).
- 블로그도 같은 날 별도로 확정된 n8n MDX 이중프론트매터 버그로 11일째 반영 정체(관련: [[project_ig_carousel_observe_next_run_2026-08-31]]에도 같은 계열 서술 없음, 별개 이슈).
- 물리적 원인 추정: `saju-studio` 워킹트리 하나에 결제수정+인스타작업이 섞여있고 uncommitted 20개+.

**액션 3개 실배분 완료**(main이 직접 스폰, 10:37 KST경 — SendMessage는 cso 세션에서 owner에게 안 닿음, 이번 주 W36 주간전략리포트에서 확정된 것과 동일 패턴 재확인):
① cto-checkout-w36 — 게스트체크아웃 병합·배포·로그아웃결제화면 도달실증(검증 9/2)
② (같은 스폰, cto-checkout-w36) — 블로그 MDX 버그 수정(검증 9/3)
③ jiwon-canary-w36에 이어서 배정 — 운영DB 읽기전용 role 생성, 퍼널원장 재개(검증 9/4)
검증 담당(자기채점 금지): sales-verify-w36(sales-head-jio) — 게스트체크아웃 독립 재현.

**형 결재 2건 대기**: (A) 매출작업/인스타작업 워크트리 분리 (B) 운영DB 읽기전용 role 생성.

**★반복 사고**: W35 수익리뷰 파일이 아예 없었음(W33 7주공백→W34 지연→W35 결번, W36에서야 재확인). [[project_revenue_review_lapsed_2026-08-12]]의 재발. cso 제안: 세션cron→작업스케줄러 이전이 근본책.

**부수 발견**: cso 세션도 Discord 도구 없어 무응답관문이 Bash/Grep/SendMessage 3회 차단 — [[feedback_dont_coach_magic_phrase_past_guard]]에 이미 기록된 서브에이전트 훅 결함과 같은 계열, 추가 사례로 누적.

**★자기정정(cso, 10:42)**: 액션③ 원처방("운영DB 읽기전용 role 생성")이 틀렸음을 스스로 발견 — prisma 스키마에 방문/페이지뷰 테이블 자체가 없어 role을 만들어도 세션 도달 측정이 안 나옴. 진짜 필요한 건 **GA4 서비스계정 뷰어 권한 추가(형 클릭 5분, moa-sc@moa-search-console.iam.gserviceaccount.com)** — 결재(C)로 신설, (B) DB role보다 우선. jiwon 발견: 퍼널원장 중단 원인은 role 부재가 아니라 `.env.local`이 2026-08-20 18:15에 운영→로컬(127.0.0.1)로 교체된 것(`.env.prod-ops.local`에 운영 자격증명 이미 존재) — `bun --env-file=.env.prod-ops.local run scripts/growth-funnel-snapshot.ts` 1회 실행만 형 승인 필요(REQ-20260831-FIN-01, 읽기전용 SELECT 3건).

**데이터 상충 2건(지우지 않고 병기, 다음주 SSOT 선언 안건)**: ①매출원장 불일치 — Gumroad API(2건/$15.98/마지막06-26) vs burn_rate.md(1건/$7.99/마지막07-03), "66일 무매출"이 burn_rate 기준이면 "59일". ②고정비 범위 불일치 — 같은 8/12 원본인데 W34리뷰(₩50.1~52.0만) vs jiwon판독(₩47~65만, 채택).

**sales-verify-w36 배포전 기준선 확보(10:39)**: 게스트 체크아웃 현재 401 확인(`POST /api/gumroad/checkout {"kind":"onetime"}` 데스크톱·모바일 UA 모두 401 "Sign in before starting checkout"). 오탐 1건 배제: `/en`→`/ko` 리다이렉트는 버그 아니라 지오분기(한국IP라서, `middleware.ts:46-77`), `NEXT_LOCALE=en` 쿠키/크롤러UA면 정상 영어페이지. 배포 후 데스크톱/모바일/영어권 3조건 재검증 스크립트 준비 완료.

**How to apply**: 다음 세션은 9/2·9/3·9/4 검증목표일에 각 액션의 실제 완료 여부를 파일/git/라이브로 확인할 것. W37 리포트에서 "TaskCreate id" 대신 "스폰시각+에이전트이름"이 배분증거임을 유지. 형 결재 REQ-20260831-FIN-01·GA4뷰어권한(C)·워크트리분리(A) 3건 확인할 것.
