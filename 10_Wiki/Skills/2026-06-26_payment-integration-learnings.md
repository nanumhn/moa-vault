# 결제 통합 복기 — 재사용 패턴 (2026-06-26 k-saju Gumroad 점화)

오늘 k-saju Gumroad 결제를 운영 라이브로 점화하며 검증된, 다음 결제/외부키 통합에 재사용할 패턴.

## 1. 토큰-안전 env 처리 (비밀 노출 0)
형이 비밀키(access token)를 직접 `.env.local`에 넣게 하고, **클로는 그 파일을 화면에 절대 echo하지 않는다.**
- 비밀에서 파생되는 비-비밀 식별값(seller_id, product_id, permalink)은 **스크립트가 파일에서 토큰을 읽어 API 호출 → 식별값만 stdout 출력**(토큰은 안 찍음). 예: `gumroad-ids.mjs`.
- 비-비밀 값은 클로가 heredoc append로 `.env.local`에 직접 기입 가능(키 아님). 비밀만 형이.
- prod DB push도 URL을 `grep -vE "postgres://"`로 가려서 실행. `bunx dotenv-cli -e .env.local -- prisma db push`로 .env.local의 Neon URL 사용(Prisma CLI는 .env만 자동로드하므로 명시 필요).
- **교훈:** 비밀/비-비밀을 분리하면 "형 직접 입력" 규칙을 지키면서도 클로가 셋업의 90%를 자동화할 수 있다.

## 2. 무료 트라이얼 = $0 end-to-end 스모크
구독에 무료 트라이얼이 있으면, 그걸로 **실제 청구 없이($0)** 결제→웹훅→권한부여 전체 사슬을 검증한다. 진짜 카드결제($4.99)보다 우월.
- 검증은 운영 DB를 직접 조회해 새 Subscription row(status active + provider IDs set)가 도착했는지로 확정(워치 스크립트). UI "열렸다"만 믿지 말고 DB로 교차검증.

## 3. 배포 완료 감지 = 신규 라우트 상태코드
신규 API 라우트(webhook 등)는 배포 전 404, 후 405/401. 그 전환을 폴링하면 Vercel 배포 완료를 인증 없이 감지 가능.

## 4. 미커밋 코드 선행 + push 게이트
키 대기 동안 키-불필요 작업(기존 코드 커밋·계측)을 **로컬 커밋만(push X)**으로 선행 → 형 키 들어오면 push=배포. 블로킹 최소화. push=Vercel 자동배포임을 항상 의식.

## 5. webhook 상품 매칭 함정
Gumroad webhook이 `GUMROAD_PRODUCT_ID` 설정 시 단일 상품만 허용(route.ts L107) → 상품 2개면 PRODUCT_ID **비워서** seller_id만 보안경계로. 코드를 읽고 env를 정한 사례.

관련: [[2026-06-25-revenue-ignition-PLAN]] · 2026-06-26_revenue_portfolio_expansion · Finance/weekly/2026-W26_metrics
