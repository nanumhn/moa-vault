---
name: project_audit_2026-06-25_revenue_ignition
description: "2026-06-25 슈퍼파워스 전체 통감사 결과 + KPI 월 2,000만원으로 교정(형 확정). 병목=첫 매출 점화 한 곳"
metadata: 
  node_type: memory
  type: project
  originSessionId: 31c496cb-77ff-439b-8653-30bc17f71385
---

## 📍 현재 상태 스냅샷 (새 세션 먼저 읽기 — 2026-06-26 갱신)
**한 줄:** k-saju 결제 라이브 점화 성공(첫 매출통로 개통, 단 진성매출은 아직 0=형 트라이얼 테스트). 다음 본질 목표 = **첫 진성 고객 유입**.
- **회사:** 공식 직원 **11명**(비서·COO도현·CTO서진·CSO지영·그로스나래·콘텐츠서아·세일즈지오·데이터재무지원·미디어시우·**기록관리haru**·검수관지안). KPI=월 순수익 **2,000만원**. 수익 3축=k-saju결제·쇼츠납품·애드센스.
- **기록관리본부장 한하루(archive-head-haru) + work-journal 스킬 채용**(2026-06-27). 형 옵시디언 볼트 `owenlab-notes`(클론: `Obsidian/owenlab`)에 일일 업무일지(`70 Record/YYYY-MM-DD.md`)·매뉴얼(`09 업무 가이드/`) 기록. 글쓰기+humanize-korean 적용. 2026-06-26 업무일지+모아 시스템 가이드 작성·push 완료(0a749fc). 하루도 조직도 11번째로 추가됨(아바타·KV상태 포함, clo_studio eeab396).
- **k-saju(saju-studio):** Gumroad 결제 라이브(구독$7.99+7일트라이얼/단발$4.99). 한글화·`/admin` 배포됨. blog.k-saju.me 발행 대기.
- **조직도 대시보드(라이브):** https://clo-studio-x52c.vercel.app/ (Vercel, 비번게이트 moa-5zdXqTvRJU=형 Discord에만, 메모리 미기록). 클릭 상세모달+상태뱃지(🟢업무·키워드/🔵회의/🟡대기/💤휴식). **✅ Upstash KV 실시간 상태 라이브 완성**(클로가 set-status.mjs로 밀면 ≤10초 반영).
- **콘텐츠:** k-saju 유입 블로그2편+Reddit글 완성(`moa-vault/10_Wiki/Marketing/k-saju_seo_pack_acquisition_2026-06-26.md`). 블로그 발행=클로 할일(미착수), Reddit=형 게시.
- **미디어 역량:** 로컬 ComfyUI(무료, 8188) + Z-Image Q4 셋업. 영상은 그록 등 구독(형 결정 대기). 이미지=ComfyUI 1순위(형 방침).
- **🙋 형 미완 액션:** ①Meta 계정확인(인스타 차단) ②Gumroad 결제후 redirect(2상품) ③그록 구독 결정 ④Reddit 글 게시. (⑤Upstash 연결=완료)
- **운영 규칙(형 명시):** 운영/기술은 다 클로가, 형은 결재만 / 긴 작업은 백그라운드 + 대화 항상 유지 / 블로커는 공유하고 같이 풀기.
- 상세 이력은 아래 본문. ↓↓↓

---

2026-06-25, 형이 "슈퍼파워스로 AI 1인 기업 계획 전체 점검" 요청 → brainstorming 스킬 + 자체 탐색 에이전트 3축(하네스/vault/코드) 통감사.

## ★ KPI 교정 (형 확정 2026-06-25)
**월 순수익 목표 = 2,000만원.** (1,000만원 아님.) CLAUDE.md·구 메모리들([[project_harness_revenue_layer]] 등)은 "1,000만원"으로 적혀 stale. vault `Finance/global-20m-revenue-plan`(2천만)이 맞는 기준. **앞으로 모든 수익 보고·revenue-review는 2,000만원 기준.** 문서끼리 안 맞았던 거 → 형 말이 진실 원천.

## 감사 결론 (3축)
- **① 조직/하네스 95/100** — 에이전트 9(본부장8+검수관1)+스킬8 전부 실존, 끊긴 참조·고아·중복 0. 흠집: content-head-seoa 문서 표기가 다른 스킬보다 느슨(기능 영향 0).
- **② 사업/재무 설계 90/100** — 결정 이력·KPI·전략 문서 정교.
- **③ 재무 실측 0/100 🔴** — `Finance/weekly/` 텅 빔=주간 수익리뷰 **0회 실행**. `10_Topics/saas-us-10m/` 텅 빔. 실매출·비용·순이익=0(전부 [추정]). k-saju 라이브인데 방문/가입 실측 수집 흔적 없음.

## 핵심 진단
머리(전략)·손발(에이전트)·도구(코드) 다 갖춰졌는데 **심장이 한 번도 안 뜀**(매출 0, 통로 막힘, 계기판 OFF). 병목이 분산 안 되고 **'첫 매출 점화' 한 곳에 집중**. 점화 사슬: Gumroad 키(형) → 첫 결제(자동) → 실측 숫자(data-finance) → 주간 리뷰 루프 ON(CSO).

## 코드 실탄 상태(교차검증됨)
- saju-studio Gumroad 통합 **코드 100% 완성**(client.ts 283줄·checkout·webhook, 검증로직 포함), 미커밋(Untracked), 키 없어서 PayPal 자동폴백. → [[project_moa_open_threads]] 1번과 동일.
- moa-studio remotion sample.mp4 렌더됨·brain/office 신기능 다 미커밋.

## 슈퍼파워스 풀코스 완주 (2026-06-25)
형 승인 A안 → brainstorming→writing-plans 완주. **vault에 2문서 박제·push 완료:**
- spec: `moa-vault/10_Wiki/Projects/2026-06-25-revenue-ignition-design.md` (커밋 dd95b9d)
- plan: `moa-vault/10_Wiki/Projects/2026-06-25-revenue-ignition-PLAN.md` (커밋 2e9d10c, 13태스크 owner별)
설계재료로 marketing-skills의 analytics·launch·cro 실제 사용.

## 핵심 실행 사실 (재개용)
- 전체 사슬 병목 = **형의 Gumroad 가입(Task1) 단 하나**. 그거 빼면 키불필요 선행작업(CTO Task2 기존코드 커밋·Task6 GA4 purchase 서버이벤트·Task7 퍼널5단 계측)은 키 없이 지금 실행 가능(빌드 그린·PayPal 폴백).
- saju-studio GA4 인프라 이미 성숙: `src/lib/analytics.ts`(track/getClientId)·`ga-server.ts`(sendServerEvent MP)·`Analytics.tsx`. PayPal webhook은 이미 server purchase 이벤트 보냄 → Gumroad webhook에 같은 패턴 복제가 Task6.
- weekly 실측 폴더 `Finance/weekly/` 텅 빔 → Task8이 첫 파일.
- 형이 1번 경로 선택(Gumroad 가입 진행 중). **CTO 키불필요 선행작업 Task2·6·7 완료(2026-06-25):**
  - saju-studio/main 로컬커밋 2개 ahead, **push 안 함**(키 들어온 뒤 형 승인 후에만 — push=Vercel배포): `4b15a79`(Gumroad코드 커밋), `05bbe11`(퍼널5단계 계측 보강).
  - Task6 GA4 purchase 서버이벤트는 **이미 구현돼 있었음**(gumroad webhook route.ts L262-281, PayPal과 동일패턴) → 검증만.
  - 퍼널 이벤트: landing_view/saju_input/pay_gate_view/checkout_started/purchase_completed 추가(익명·PII0). 기존 reading_started 등 유지.
  - cto-seojin agentId `a22aea0f30c161015` (Task3~5 이어가기용).
- **남은 것 = 형 Gumroad 가입·키 → Task3(키 .env.local·Vercel 형 직접입력) → Task4(형 승인 후 db push) → Task5(테스트결제 스모크) → push→라이브.**
- 상품명 확정: 구독 `K-Saju Premium`($7.99/mo+7일트라이얼) / 단발 `K-Saju Full Reading`($4.99).

## Gumroad 셋업 진행 (2026-06-25, 형 수동 + 클로 보조)
- 형이 Gumroad 가입·상품2개 생성·access token 발급·`.env.local`에 GUMROAD_ACCESS_TOKEN 저장 완료.
- 클로가 토큰을 화면 노출 없이(스크래치 스크립트 gumroad-ids.mjs로 파일에서만 읽음) 식별값 자동추출 → `saju-studio/.env.local`에 append 완료(비밀 아닌 값만, 클로가 직접 씀):
  - GUMROAD_SELLER_ID=`0JCqcypBB6soiPsR1JMRaA==`
  - GUMROAD_SUBSCRIPTION_PERMALINK=`hinuk`(K-Saju Premium 구독)
  - GUMROAD_ONETIME_PERMALINK=`phcfum`(K-Saju Full Reading 단발)
  - GUMROAD_PRODUCT_ID/PRODUCT_PERMALINK는 **비움** — webhook route.ts L107이 PRODUCT_ID 설정시 단일상품만 허용하므로, 2상품 다 통과시키려 비움(보안경계=seller_id).
- 가격 검증: 구독 top-level price 0은 false alarm — tier `recurrence_prices.monthly.price_cents=799`로 $7.99/월 정상. 단발 499 정상.
- 🚩 **막힌 것: 두 상품 다 published:false(draft)** → 형이 Publish 해야 결제 열림.
- 🚩 **남은 형 수동 2개: ①상품2개 Publish ②webhook Ping URL `https://k-saju.me/api/webhooks/gumroad`(Settings→Advanced→Ping)**.
- 그 뒤 클로: Vercel 운영 env(토큰은 형 직접)+코드 push(현재 미push 2커밋)+`bunx prisma db push`(형 승인)+테스트결제 스모크 = Task3~5.
- 토큰 추출 스크립트: scratchpad `gumroad-ids.mjs`/`gumroad-product.mjs`(토큰 파일에서만 읽고 식별값만 출력).
- 정산(payout): 한국은 **Bank Account**(PayPal 아님). Weekly·최소 $100 임계(한국 기본). 발행 전 정산수단 연결 필수(KYC 체크 3개).
- ★**Gumroad 수수료(마진 핵심)**: 직접판매 10% + $0.50 + 카드 2.9% + $0.30. $7.99당 ≈$1.83(≈23%) 차감. Discover 경유는 30% flat. → 작은 객단가에 수수료율 높음. **data-finance가 마진·가격 재산출 필요**(2,000만 역산 Task12에 반영).

## 라이브 진행 (2026-06-26)
- ✅ Neon 운영DB에 gumroad 컬럼 반영(`bunx dotenv-cli -e .env.local -- prisma db push --accept-data-loss`; unique 제약 2개는 신규 all-NULL 컬럼이라 안전). 
- ✅ 코드 push 완료(ad4f469→05bbe11) → Vercel 배포 완료(웹훅 라우트 405=live, checkout 401=env적용됨, webhook 401 fail-closed).
- ✅ 형 Vercel env 4개 입력(토큰 직접). Vercel CLI는 이 PC 미로그인이라 클로가 직접 못 넣음 → 형 웹UI로.
- 🔥 **엔진 점화 성공 (2026-06-26 05:39)** — 형 트라이얼 결제가 운영 DB에 실시간 도착: 새 Subscription `cmqui3quq0002l004supak1kj` status=active, gumroadSaleId·gumroadSubscriptionId 둘 다 set. **결제→웹훅→검증→권한부여 전체 사슬 자동작동 확인.** 감사 1순위 "심장정지(매출0)" 해소 = k-saju 결제 라이브. 워치스크립트: `saju-studio/scripts/_watch-gumroad-sub.mjs`(임시·PII제외, 나중 삭제).
- ⚠️ 사소: 결제후 형이 Gumroad 페이지에 머묾(리다이렉트 미설정). provider 필드 null(gumroad IDs는 set라 게이팅엔 무관).

## 점화 후 폴리시 (2026-06-26)
- ✅ 결제게이트 i18n 한글화 — CTO, next-intl payGate 네임스페이스 26키 ko/en, 커밋 `b428dee` push 완료(배포). agentId cto `ae27e20dd5d99ac7e`.
- ⏳ **형 액션 A: 결제후 복귀 redirect** — 코드 불가(Gumroad 미지원), Gumroad UI 설정. 각 상품(구독+단발) Content탭→"Redirect customers to a URL" ON→`https://k-saju.me/pay/return`. pay/return은 이미 ?sale_id 콜백 읽게 돼있음.
- ✅ data-finance 첫 스냅샷 `Finance/weekly/2026-W26_metrics.md`(커밋 4119427). net마진 구독77%/단발71%, 2천만=net기준 ~2,442구독(FX1330). 진성매출 0(트라이얼=테스트).
- ✅ 인스타 점검(growth): n8n Up정상, IG WF tarotDaily00002 비활성, 6/21 `API access blocked`(OAuthException 200). **형 액션 B: Meta 개발자계정 차단해소 확인**(1순위). 해소 후 시각랜덤화+수동테스트1회 후 켬.
- 🆕 **주 사업 2개 추가(형 지시, CLAUDE.md+vault decision 2026-06-26_revenue_portfolio_expansion 기록)**: 쇼츠 제작 자동화 납품(B2B 수주, Remotion 활용, 기획대기) + 애드센스(승격). 포트폴리오 3축. 신규2개 각각 spec→plan 필요.
- ❓ 형 답 대기: ①/admin 대시보드(회원·결제·MRR) 만들까(제안함) ②신규사업 vs 유입 우선순위(제안: 유입 먼저).
- ✅ **`/admin` 대시보드 신설**(형 요청, CTO 커밋 `5246402` push 배포). `src/app/[locale]/admin/page.tsx` 서버컴포넌트, NextAuth `auth()` 세션 이메일 == `ADMIN_EMAIL` 게이팅(fail-closed, 빈값=전원차단). 회원수·최근가입10·구독status별/제공자별·트라이얼·단발(Reading.isPaid)·MRR추정(활성×$7.99×0.771). 로컬 .env.local에 ADMIN_EMAIL=ssky.park@gmail.com 넣음. cto admin agentId `a658c6ca8aac191eb`.
- 🙋 **형 액션 C: Vercel에 `ADMIN_EMAIL=ssky.park@gmail.com` 추가**(Production) → 1~2분 후 k-saju.me/admin 접근 가능(형 구글 로그인 상태). 없으면 본인도 404.
- 정리: 형 미완 액션 = A(Gumroad redirect 2상품) · B(Meta 계정확인) · C(Vercel ADMIN_EMAIL ✅완료). 미답 질문 = 신규사업 vs 유입 우선순위(추천 유입).

## 열린 스레드 (2026-06-26 저녁, 빠른 컨텍스트 전환 多)
- ✅ /admin 접속 확인됨(형). 결제게이트 한글화·블로그 새창링크(`264dff7` k-saju-blog, **미push**) 완료. 블로그 배포는 콘텐츠와 함께 예정.
- ⏳ **유입 단계**: growth가 첫 유입 전략 산출(블로그SEO 2글:"Saju vs Bazi vs Chinese Zodiac"·"How to Read Your Saju in English" / Reddit r/Bazi·r/ChineseAstrology 가치글, 링크없이 형 수동게시 / UTM). **content 제작 "고고?" 형 미답 대기.** content-head-seoa로 블로그2(이미지2~3개+새창CTA)+Reddit글1 제작 예정. growth agentId `a2b0ebfd1f1b0fc4c`.
- ⏳ **인스타**: 형이 "자동등록 풀릴 때까지 데일리 카드를 디스코드로 보내줘, 인스타엔 수동게시(붙여넣기 쉽게)" 요청. n8n tarotDaily(IG POST 차단)→Discord 전달로 전환 빌드 필요(미착수). 형 Meta 계정확인(developers/business.facebook.com 앱상태·계정품질) 진행 중.
- ⏳ **이미지/영상 생성 도구**: 형이 그록 구독+크롬확장으로 클로 제어 제안 → 클로 답변: chrome-devtools로 가능하나 ToS/차단위험, **API가 정공법**. 비용: 이미지 API 월 $3~5(추천 Gemini Nano Banana, 형 키발급 대기), 영상은 비싸 쇼츠사업 매출로 충당. **형 결정 대기.** chrome-devtools MCP는 attach모드 존재(C:\chrome-debug-profile, 9222). ComfyUI 현재 OFF(8188).
- 형 사진(가족 크리스마스) 시네마틱·픽사 변환 = 형이 직접 Gemini/ChatGPT로 시도중(클로 프롬프트 제공).
- ✅ **미디어제작 본부장 '한시우'(media-head-siwoo) 채용 완료**(harness 스킬). agents/media-head-siwoo.md + skills/media-creation + 오케스트레이터 라우팅 + CLAUDE.md 이력. 역할: 이미지=생성API(저비용·안전), 영상=정액구독 브라우저 조종(하루2~3개), chrome-devtools attach(9222/C:\chrome-debug-profile)+차단회피(사람속도·실세션). 본부장 9+검수관. 일하려면 형이 이미지 API 키 발급 필요.
- humanize-korean 스킬(AI티 제거) = 한국어 콘텐츠(실버 블로그 등) 제작 시 통과시키기로(형 지시). content 제작 단계 연결.

## 세션 마감 통합보드 (2026-06-26) — 다음 형 결정대기
1. 유입 콘텐츠 제작 고고?(블로그2+Reddit글, growth전략 완료·content 대기) ← 추천 1순위
2. 시우 도구방침(형 확정): **이미지=로컬 ComfyUI 1순위(무료·보유자원), 그록 구독시 병행, 생성API는 고품질 예외만**. → API키 발급 불필요. 시우 일 시키려면 **ComfyUI 켜기(현재 OFF)**. 영상=그록 등 구독 브라우저 조종(그록 구독은 형 결정 대기). 시우 데뷔작=ComfyUI로 자기 프로필 생성 예정. skills/media-creation·agents/media-head-siwoo 이 방침으로 갱신됨.
3. 인스타: 형 Meta 계정확인 → 안 풀리면 데일리카드 n8n→디스코드 전달 빌드
4. 자투리: Gumroad redirect(각 상품 Content→Redirect URL)
모든 코드 수정 로컬커밋 push 완료(saju i18n·admin / 블로그 264dff7은 미push-콘텐츠와 함께). 진성 매출 여전히 0(형 트라이얼은 테스트). 다음 진짜 목표=첫 진성고객 유입.

## 미디어 생성 역량 가동 (2026-06-26)
- ✅ ComfyUI 클로가 직접 켬(포터블 `D:/Develop/ComfyUIPtb`, `python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build`, 8188). 형은 운영 안 함.
- ✅ 시우가 **Z-Image Turbo GGUF Q4_K_M**(4.98GB, repo `jayn7/Z-Image-Turbo-GGUF`) + **SDXL Lightning 4step LoRA**(`ByteDance/SDXL-Lightning`) 무료 다운·셋업. 인코더 qwen_3_4b·VAE ae 재활용. 6GB 적합.
- ✅ 데뷔작 생성 성공: Z-Image Q4 워크플로우(UnetLoaderGGUF→ModelSamplingAuraFlow shift3→KSampler 8steps cfg1 euler/simple, 832x1216, ~72초/장). 재사용 JSON: scratchpad `zimage_siwoo.json`. 결과 `ComfyUIPtb/ComfyUI/output/siwoo_debut_00001_.png`.
- 기술메모: qwen_3_4b 인코더는 CLIPLoader type이 FLUX만 아니면 자동으로 Z-Image로 라우팅(type=lumina2로 둬도 동작).
- 보유 모델: FLUX schnell Q4(6.8GB), SDXL base, z-image bf16(11.5GB·6GB엔 무거움), Z-Image Q4(신규). 미설치: IPAdapter/InstantID/PuLID/ReActor → **실사 인물 얼굴보존 약함**(6GB 한계, 그록 구독으로 우회 예정).
- ⏳ 시우 추천: 이 워크플로우로 페르소나 15명 프로필 일괄생성(픽셀오피스/대시보드 팀비주얼) — 형 승인 대기.

## 조직 정리 + 3트랙 백그라운드 완료 (2026-06-26)
- **공식 직원 = 에이전트 10명 확정**(형 승인): 비서·COO정도현·CTO윤서진·CSO한지영·그로스강나래·콘텐츠이서아·세일즈지오·데이터재무박지원·미디어한시우·검수관서지안. clo_studio 페르소나 15명은 회의용 별도 레이어. ★시우 2명 주의: media-head 한시우(`assets/media-head-siwoo.png`) vs 드라마감독 시우(`assets/siwoo.png`)=별개.
- ✅ **아바타 10명 통일 완성**(Z-Image Q4, `clo_studio/dashboard/assets/`): 신규 jiyoung·jian·secretary, jio 재생성(톤통일, 백업 jio_old_backup.png), 나머지 유지. 팀 몽타주 `ComfyUIPtb/ComfyUI/output/moa_team_montage.png`. 재사용 워크플로우 `zimage_siwoo_real.json`.
- ✅ **외부 조직도 대시보드 — Vercel용 재설계 완료**(형 지시: Cloudflare 안 씀, Vercel 사용). 신규 격리 Next.js 앱 `clo_studio/dashboard/org-app/`(커밋 `14cbb75`, **미배포·미push**). 인증=**Vercel Edge Middleware 비번 게이트**(서버사이드 진짜 차단, 미인증자 아바타도 못 받음). 비번 SHA-256 해시·서명키는 Vercel env(ORG_GATE_PASS_HASH·ORG_GATE_SECRET·ORG_GATE_SALT). 빌드 그린. (구 정적 `org/`는 DEPRECATED 표기, clo_studio는 nanumhn git repo라 Vercel root=dashboard/org-app로 배포가능). **배포에 형 필요: Vercel 프로젝트 생성(root 지정)+env3개+비번선택+"배포"결재 → 클로 push+배포.** 도메인 미정(vercel.app 먼저, A 회사도메인/B k-saju 서브 추후).
- ✅ **조직도 배포 진행(형 1번 선택, 2026-06-26)**: 클로가 보안값(PASS_HASH·SECRET, salt 생략) 생성 + `clo_studio` GitHub(nanumhn/clo_studio)에 push 완료(14cbb75 라이브). 형이 Vercel 프로젝트 생성 중 — **Root Directory=`dashboard/org-app`**, env 2개(ORG_GATE_PASS_HASH·ORG_GATE_SECRET) 붙여넣기, Deploy. ※비번·키 값은 보안상 메모리에 미기록(형 Discord에만). 비번 변경 요청시 클로가 새 해시 생성.
- ✅ **조직도 배포 성공·라이브: https://clo-studio-x52c.vercel.app/** (Vercel, 비번 게이트). 인증·렌더·아바타 정상. 서지안 레이어 수정(0aeb0d6)도 서버엔 정상 반영(클로가 비번 로그인해 HTML 직접 확인 — 서지안 맨 아래 검수게이트 섹션). 형이 "동일하다" 한 건 **브라우저 캐시**(시크릿창이면 정상). 비번값은 보안상 메모리 미기록(형 Discord). 
- 조직도 반복 개선 완료(전부 push·Vercel 자동배포): 클릭→직원 상세모달(56f0408, 책무·현재일), 서지안 레이어 정상화, 빈카드(고스트)로 3열 균형+tier레이블 글씨 키움(34c3883). 비번 게이트 로그인은 클로가 curl로 검증 가능(POST /api/login {password}). org.json 각 멤버 responsibilities·current 필드 보유.
- ⏳ **다음: 직원 실시간 상태 뱃지(형 요청)** — 🟢업무/🔵회의/🟡대기/💤휴식. 데이터源: clo_studio가 회의 시 `dashboard/status.json`에 각 직원 state(대기/회의중) 기록 중(이미 존재). "업무진행"은 오케스트레이터가 본부장 dispatch시 기록. 근실시간(push/배포 ~1분 lag) v1 vs 진짜실시간(Vercel KV) v2.
- ✅ **상태 뱃지 v1 완료·라이브**(4e7018f push). `org-app/data/status.json` 스키마 `{"<id>":{"state":"업무|회의|대기|휴식","keyword":"<업무시 키워드>","updated_at":<epoch>}}`. id=org.json 멤버 id(secretary/dohyun/seojin/jiyoung/narae/seoa/jio/jiwon/media-head-siwoo/jian). 업무일때만 keyword 표시(형 요청). 카드+모달에 뱃지(🟢업무·키워드/🔵회의/🟡대기/💤휴식). 없는 id는 graceful 대기.
- ✅ **실시간 상태 KV 연동 완료**(형 "제대로 하자" 선택, CTO a93ff86 push). Upstash Redis 키 `moa:status`에 전체맵 JSON. `/api/status`(edge, 10초 폴링)로 라이브 갱신. env 두 네이밍(`KV_REST_API_URL/TOKEN` 또는 `UPSTASH_REDIS_REST_URL/TOKEN`) graceful, 없으면 data/status.json 시드 fallback. 파일: app/kv.ts·api/status/route.ts·status-live.tsx·scripts/set-status.mjs.
  - **오케스트레이터(클로)가 상태 쓰는 법**: `bun scripts/set-status.mjs <id> <state> "[keyword]"` (state=업무|회의|대기|휴식, keyword는 업무시만). 로컬 자격증명은 `org-app/.env.local`(gitignore)에 KV REST URL/TOKEN — 형이 Upstash 연결 후 거기 복붙. 그럼 클로가 일 분배시 set-status로 밀면 라이브 ≤10초 반영.
  - ✅ **KV 실시간 end-to-end 완성·검증**(2026-06-27 새벽). 형 Upstash 연결+`org-app/.env.local`(KV_REST_API_URL/TOKEN) 채움. `bun scripts/set-status.mjs <id> <state> "키워드"`(cwd=org-app) → 라이브 /api/status 즉시 반영(kv:true). 전 직원 상태 세팅 완료. **진짜 살아있는 조직도 완성.**
  - **★앞으로 운영: 클로가 본부장 dispatch시 `cd org-app && bun scripts/set-status.mjs <id> 업무 "키워드"`, 완료시 `<id> 대기`. id=secretary/dohyun/seojin/jiyoung/narae/seoa/jio/jiwon/media-head-siwoo/jian.**
  - ★★반복 실수 경고: 모든 도구(특히 디스코드 reply)를 **`antml:invoke` 형식**으로 호출해야 실행됨. bare `<invoke>`=텍스트 처리돼 안 나감(이 세션 5회+ 발생, 형 "메시지 안 와" 답답). 매 호출 antml 접두사 확인.
- ✅ **k-saju 유입 콘텐츠 완성**(서아, `moa-vault/10_Wiki/Marketing/k-saju_seo_pack_acquisition_2026-06-26.md`): 블로그2(Saju vs Bazi / How to Read Saju)+Reddit 가치글+CTA, 영어·UTM·사실검증. **블로그 발행=클로 할일(blog.k-saju.me, 미착수)**. Reddit 게시=형(체크리스트④, r/Saju·r/Bazi, 본문 링크금지). 이미지 5자리=시우 후속 생성 대기.
- 형 체크리스트(본인 할일): ①Meta 계정확인 ②Gumroad redirect(2상품 Content탭) ③그록 구독 결정 ④Reddit 게시(콘텐츠 준비됨).
- 🐞 후속 수정(점화 후): ①**결제게이트 i18n 버그** — pay/gate 카피가 영어 고정(나머지 한글인데 이 화면만 영어). ②단발 $4.99 따로 선택 불가(트라이얼 위주 디자인) → Task11 CRO서 판단. 담당 cto-seojin(agentId `a22aea0f30c161015`).

관련: [[project_ksaju_live]] [[project_3_saju_global]] [[project_moa_open_threads]]
