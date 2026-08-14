---
name: reference_atz_gate_substring_falsepositive_2026-08-14
description: "아투 QA게이트 gossip/sensational 사전이 단어경계 없는 substring매칭이라 오탐 재발 — ko-match.mjs로 근본수리+회귀테스트 신설"
metadata:
  type: reference
  originSessionId: 237b10af-2489-4619-b769-c78eb3db65da
  modified: 2026-08-13T22:59:34.791Z
---

`D:\Develop\moa-studio\tools\atz-pipeline\qa-gate.mjs`의 `hits()`가 `dict.filter(w => text.includes(w))`로 단어경계 없는 순수 substring 매칭이었음. GOSSIP 사전의 2글자 키워드 `'연예'`가 "공연예술센터"(정상 정치기사)에서 오탐, 케네디센터 트럼프 기사가 보류됨(2026-08-14).

**전수점검하니 같은 지뢰 5개 더 있었음**(안 터졌을 뿐): `'데이트'`⊂업데이트 / `'성형'`⊂완성형·구성형 / `'아이돌'`⊂아이돌봄 / `'가십'`⊂나가십시오 / `'패션'`⊂컴패션.

**가장 뼈아픈 점**: 이 substring 함정은 이미 7월에 `curate.mjs`(라벨분류)에서 `rxFor()`(`(?<![가-힣])`)로 고쳐진 적 있었는데, **발행 게이트(qa-gate.mjs)에는 그 수정이 전파 안 됨**. 같은 파이프라인 안에서도 한쪽만 고치고 옆 파일은 그대로 두면 재발한다는 교훈.

**수리**: `ko-match.mjs` 신설(왼쪽 문자종 경계 규칙 + 오른쪽 예외표), GOSSIP/SENSATIONAL 사전을 export해서 정상어휘 20문장 코퍼스로 회귀테스트가 자동 감시 — 앞으로 위험 키워드 추가되면 테스트가 바로 빨간불.

**아직 안 고친 곳(같은 substring 패턴, 급하진 않음)**: `tools/youtube-publish/metadata.mjs`의 `checkBanned`(쇼츠 금지어, 발행 차단 아니라 경고/재생성 경로) / `curate.mjs`의 `KW_WEIGHT` 가산점 루프(점수만 영향, 발행 안 막음).

**How to apply**: 아투/nblog 등 한국어 텍스트에 대고 "금지어/키워드 포함 여부"를 판정하는 코드를 새로 짜거나 리뷰할 때, `text.includes(word)` 류의 순수 substring 매칭을 보면 바로 `ko-match.mjs` 패턴 적용을 제안할 것. 2~3글자 키워드일수록 위험도 높음.

관련: [[reference_atz_gate_quote_falsepositive_3rd_recur_2026-08-13]] [[project_atz_hallucination_fix_2026-07-27]]
