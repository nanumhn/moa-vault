---
name: reference_atz_evidence_never_reached_model
description: 아투 생성 품질 저하의 진짜 원인 — LM_PARALLEL=4 하드코딩이 근거 예산을 0으로 만들어 원문이 프롬프트에 아예 안 들어갔다
metadata: 
  node_type: memory
  type: reference
  originSessionId: e32c22d7-4343-4bff-946b-e8d022511b3f
  modified: 2026-07-28T02:35:26.495Z
---

2026-07-28 발견. **아투 기사가 나쁜 이유는 "로컬 7B의 한계"가 아니라 원문 근거가 모델에 도달하지 않았기 때문이었다.**

`generate.mjs` 에 `const LM_PARALLEL = 4` 가 하드코딩돼 있었는데 `lms ps` 실측은 **PARALLEL 1**(CONTEXT 8192)이었다.
```
perRequest = 8192 / 4 = 2048
근거 예산 = 2048 - 출력예약 2200 - (SYSTEM 1341 + 지시문 1300) - 200 = 0
bodyBlock 은 budget > 400 일 때만 붙는다  →  원문 발췌가 통째로 빠짐
```
초안 생성·확장 패스 **양쪽**에서 빠졌다. 즉 모델은 **제목만 보고** 기사를 써 왔다. 실측 예산 `PARALLEL=4 → 0자` / `PARALLEL=1 → 3,151자`.

이 하나가 그동안의 증상을 전부 설명한다: 검증된 사실 13줄을 줘도 반영 1개 / 산업별 문단을 업종명만 바꿔 복제 / 고유명사 깨짐(패트리엇 → "패트리오티아") / 한국영향 절이 수치 0의 일반론.

고친 뒤: `수치 근거 대조`·`인용 근거 대조`가 통과로 바뀌었다(사실 정확도 실제 개선). **다만 이란→이라크 혼동 12회, 고유명사 깨짐은 남았다** — 모델 한계도 별도로 존재한다. 둘을 섞어 진단하지 말 것.

**교훈: 런타임 환경값을 추정해 상수로 굳히지 마라.** 같은 파일에서 두 번 났다(2026-07-27 주석도 "PARALLEL 4"라고 단정했다). 지금은 `ATZ_LM_PARALLEL` 로 덮을 수 있고, 넘치면 `callLM` 의 shrink 재시도가 받는다.

`evidence-budget.test.mjs` 가 LM 호출 없이 **프롬프트 문자열에 근거 블록이 실제로 들어있는지**를 검사한다. 예산이 다시 조여지면(상수 되돌림·SYSTEM 비대화) 여기서 걸린다.

관련: [[reference_atz_gate_blindspot_plain_claims]] [[project_atz_originality_policy_2026-07-28]] [[reference_local_hardware_spec]]
