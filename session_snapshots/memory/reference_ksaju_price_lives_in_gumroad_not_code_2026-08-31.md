---
name: ksaju-price-lives-in-gumroad-not-code
description: k-saju 단건 $4.99 가격은 우리 코드가 아니라 Gumroad 상품 설정에 있음 — 가격 A/B 설계 시 코드 분기로는 안 됨
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-31T01:47:57.331Z
---

k-saju 결제 API(`/api/gumroad/checkout`)가 돌려주는 URL은 짧은 링크뿐이고 가격 파라미터가 없다.
`price=499`는 **Gumroad가 자기 리다이렉트에서 상품 설정값으로 붙인다**.

근거 (2026-08-31 10:45 KST, 프리뷰 빌드에서 직접 실행):
- API 응답 = `{"url":"https://gumroad.com/l/phcfum?wanted=true"}` — price 없음
- 그 URL을 열면 `gumroad.com/checkout?...&price=499&product=phcfum` 으로 리다이렉트
- 그 페이지 안에 `K-Saju Full Reading` / `currency_code":"usd"` / `price_cents":499`

**왜 중요한가:** cto-seojin 보고에는 "200 + Gumroad URL(price=499)"로 적혀 있어서 마치
우리 코드가 가격을 실어 보내는 것처럼 읽힌다. 실제로는 아니다.

**어떻게 적용하나:** 가격 테스트(단품 $4.99 vs 다른 가격, 앵커링·번들)를 설계할 때
코드에 분기를 넣는 방식으로는 가격이 안 바뀐다. Gumroad 쪽에 **가격이 다른 상품/변형을 따로 만들고**
우리 API가 어느 상품 링크를 반환할지 분기해야 한다. 즉 A/B 1회에 Gumroad 상품 생성이 선행 작업으로 붙는다.
관련: [[project_ksaju_live]], [[project_revenue_model_redesign_final_2026-08-12]]
