---
name: reference_atz_gate_anchor_hangul_gap_2026-08-04
description: 아투 qa-gate.mjs 번역인용 앵커 검사가 트럼프·엑손모빌처럼 한글로 음역된 고유명사는 앵커로 못 잡음 — 매일 오탐 재발 가능
metadata: 
  node_type: memory
  type: reference
  originSessionId: eeb2a91d-d810-425c-a139-2c3a37f602ec
  modified: 2026-08-07T12:47:17.566Z
---

2026-08-04 pm 슬롯이 「인용 근거 대조」FAIL로 보류(`out/held/2026-08-04T10-36-20-557Z_pm.json`)됐지만, 가디언 원문(`_sources.txt`)을 직접 대조한 결과 인용 3건("너무 많은 돈을 벌고 있다"="making too much money", "마지막 기회"="last chance", "믿을 수 없을 정도로 이중적"="unbelievably duplicitous") 전부 원문에 실제로 있는 정확한 번역이었다. **오탐 확인 후 보완 없이 직접 발행**(`bun run publish - --draft` → `publish-draft.mjs` → `get-post.mjs` 재조회로 LIVE 확인. postId 6381814734466685241, https://www.american-todayz.com/2026/08/blog-post_534.html).

## 근본원인 (2026-08-03 수정의 사각지대)
[[reference_atz_evidence_never_reached_model]]과 별개 건. `gate-translated-quote-20260803.test.mjs`로 이미 한 번 고친 "번역 인용 오탐"(WWII 케이스)의 **앵커 로직 자체에 새 구멍**이 있다:
- `qa-gate.mjs`의 `anchorsOf()`는 `[A-Za-z][A-Za-z.'-]{2,}` (라틴문자) 또는 `\d{2,}` (2자리+ 숫자)만 앵커 후보로 인정하고, 그중 길이 3자 이상만 채택한다.
- 8/3 케이스는 우연히 "WWII", "Esmaeil Baqaei", "Hormuz" 같은 **영문 그대로 남은 고유명사**가 인용 주변에 있어서 앵커가 잡혔다.
- 오늘(8/4) 케이스는 인용 주변 고유명사가 전부 "트럼프"·"엑손모빌"·"셰브런"·"백악관"·"트루스소셜"처럼 **한글로 음역**돼 있었다 — 라틴 문자가 하나도 없으니 `anchorsOf()`가 항상 빈 배열을 반환해 앵커를 못 찾고 창작으로 오판한다.
- 즉 영문 매체(WP·가디언·NBC·로이터 등)를 소스로 쓰는 한 **인용문 주변에 우연히 미번역 영문 고유명사가 안 남으면 매일 재발**한다. 8/3 수정은 케이스 하나만 고쳤지 근본 패턴은 안 고쳐진 것.

## 다음에 할 일
qa-gate.mjs의 anchorsOf를 한→영 역매핑 사전(트럼프→Trump, 엑손모빌→ExxonMobil, 셰브런→Chevron, 백악관→White House, 이란→Iran 등 자주 등장하는 고유명사)으로 보강하거나, 최소한 한국어 인용+한국어 원문 대조 실패 시 "고유명사 앵커 없음"을 자동 FAIL이 아니라 이 케이스처럼 **검수자 확인 필요**로 완화하는 폭을 넓힐 것. cto-seojin에게 위임 필요.

## 세 번째 원인(2026-08-07 pm, 다른 메커니즘)
"인용 근거 대조" FAIL의 또 다른 원인을 발견 — 이번엔 앵커 부재가 아니라 **생성물 자체의 용어 오염**이었다. "트럼프, 폴리실린 관세 부과" 기사(한국 매체 연합뉴스TV 소스, 영문 고유명사 이슈 아님)에서 정확한 용어 "폴리실리콘"(polysilicon)이 payload 전체(제목·본문·용어설명 12곳+)에서 "폴리실린"으로 오타 오염돼 있었다. 원문엔 인용이 정확히 있는데 payload 쪽 인용문 글자가 오염돼 있어 정확 대조가 실패한 것 — 인용 자체는 창작이 아니라 **핵심 용어 한 글자가 기사 전체에 걸쳐 잘려나간 것**. cto-seojin에게 전수 치환+원인 확인 위임함(진행중, 완료 여부 후속 확인 필요).
이걸로 "인용 근거 대조" FAIL의 확인된 원인이 3종이 됐다: ①앵커 로직 버그(수정됨) ②한글음역 앵커 부재(미수정) ③생성물 용어 오염(사례별 개별 처리 중). FAIL이 뜨면 **바로 반려하지 말고 원문과 직접 대조**부터 할 것 — 세 번 다 실제로는 인용이 진짜였다.

관련: [[project_atz_shorts_autopublish_fix_2026-08-04]] · [[reference_atz_gate_blindspot_plain_claims]]
