---
name: project_moa_open_threads
description: 2026-06-24 기준 모아 열린 작업 4건 + 각 다음 액션 (세션 재시작 후 즉시 재개용 스냅샷)
metadata: 
  node_type: memory
  type: project
  originSessionId: 3f32b718-db1f-4b50-bedb-291e648f024c
---

2026-06-24 세션 종료 시점 열린 작업 스냅샷. "이전 진행상황 보고해" 오면 이거 기준으로 갱신.

## 1. 🚀 Gumroad 결제 (k-saju) — 형 계정 셋업 차례
MoR 2곳(Paddle·LS) 사주 거부 → **Gumroad 확정**(형 결재함). cto(서진)가 통합 **골격 완성**: 빌드·테스트18 통과, **미커밋**(형 결재 전), PayPal·LS 코드 보존.
- 생성 파일(saju-studio): `src/lib/gumroad/client.ts`, `src/app/api/gumroad/checkout/route.ts`, `src/app/api/webhooks/gumroad/route.ts`. 수정: `prisma/schema.prisma`(Subscription에 gumroadSaleId/SubscriptionId/ProductId/ProductPermalink nullable 추가), `pay/gate`·`pay/return`·`checkout-button`(provider 분기—Gumroad env 차면 자동, 아니면 PayPal 폴백), `.env.example`(GUMROAD_* 6종 플레이스홀더).
- 웹훅 검증: Gumroad는 HMAC 시크릿 없음 → seller_id 일치 + access_token으로 `GET /v2/sales/:id`·`/v2/subscribers/:id` 재조회로 소유확인, 검증불가시 fail-closed(401). 게이팅은 기존 ACTIVE_STATUSES(active/trialing) 재사용.
- **★형 할 일(go-live)**: ①gumroad.com 가입(심사 없음) ②상품2개: 구독 Membership $7.99/mo+7일 트라이얼 / 단발 $4.99, 둘 다 Redirect URL=`https://k-saju.me/pay/return` ③Ping URL=`https://k-saju.me/api/webhooks/gumroad` + 구독상품 resource subscription(sale/refund/cancellation/subscription_updated/subscription_ended) 켜기 ④키: access token(Settings→Advanced→Applications), seller_id(`/v2/user`), product_id(`/v2/products`) ⑤env `GUMROAD_ACCESS_TOKEN/SELLER_ID/PRODUCT_ID/SUBSCRIPTION_PERMALINK/ONETIME_PERMALINK` → .env.local + Vercel(키는 형이 직접 입력, 클로는 안 만짐) ⑥`bunx prisma db push` 형 승인 후 클로 실행(데이터·PayPal 보존, reset 아님).
- 키 들어오면: 테스트결제 1건으로 `/v2` 필드(status alive/cancelled/ended, free_trial_ends_at 등) 스팟체크 → db push → 스모크(랜딩+/pay/gate+/daily 게이팅). 수수료 ~10% 마진/가격 재산출(data-finance) 별건.
- 상세: moa-vault/10_Wiki/Decisions/2026-06-22_k-saju_payment_lemonsqueezy_rejected_gumroad.md. [[project_ksaju_live]]

## 2. 📷 인스타 자동포스팅 — Meta 검증 대기
Meta 개발자계정 "비정상 활동" 차단(계정확인→"기술적 문제" 루프 버그). 워크플로우 `tarotDaily00002` **비활성화함**(재시작 적용). 형 Meta 계정확인 완료 후: 클로가 n8n 수동 테스트 1회 + 포스팅 시각 ±랜덤화 재발방지. 복구법·진단법: [[reference_n8n_ig_meta_block]]

## 3. 📝 실버 트롯/드라마 애드센스 블로그 — 도메인 결재 대기
재기획 완료(vault 2026-06-22_애드센스_블로그_실버층_재기획.md). 6/21 'AI툴' 기획은 폐기. **저작권 안전선이 핵심**(편성·출연진·자체요약·관람가이드만 OK / 가사·영상·실황 금지). 형 도메인+호스팅(월 1~3만원) 결재 시 W1 셋업 착수. 엔진 n8n+WordPress+qwen2.5-7b 재사용. [[project_blog_ksaju]]

## 4. 💡 신규 글로벌 사업 — 보류 합의
AI 이미지 배치 사이트(6/22 회의 1순위였음) = 레드오션+RTX3060 6GB 한계로 ROI 낮음 → **보류**. 실탄은 k-saju 결제 풀기 + 실버 콘텐츠에 집중(형 "가자" 동의). 미련 있으면 1주 저비용 검증만. vault: 10_Topics/new-global-multichannel/DECISION_2026-06-22.md.

## 기타
- skill-creator 스킬 **전역 설치됨**(`C:\Users\user\.claude\skills\skill-creator`) — 모든 프로젝트에서 사용 가능.
