---
name: reference_atz_originality_gate_is_measure_only_by_design_2026-09-20
description: "아투 고유관점(originality) 게이트가 공개를 안 막는 건 고장이 아니라 설계다 — D만 차단, A·B·C는 계측 전용. 승격 조건이 도달 불가(108편 중 통과 0건)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 93500c76-6989-464e-b6a5-8e1e0efd648c
  modified: 2026-09-20T07:52:23.215Z
---

**아투 `originality.pass:false` 인데 글이 공개되는 것은 버그가 아니다. 그렇게 만들어 둔 것이다.**
2026-09-20 오후 내가 코드를 직접 읽고 확인했다. 그날 아침 나는 이걸 **고장으로 오진해 형께 결재를 올렸다** — 다음 세션은 같은 자리에서 또 오진하지 말 것.

## 설계 — 4항목 중 하나만 막는다

`run.mjs` 546행 (2026-09-20 직접 열람):

```js
const ORIGINALITY_BLOCK = '해석의 매체 귀속 없음';
const origBlocked = orig.issues.filter((i) => !i.ok && i.item === ORIGINALITY_BLOCK);
const origWarn    = orig.issues.filter((i) => !i.ok && i.item !== ORIGINALITY_BLOCK);
```

`shouldAutoPublish()`(198행)는 **`origBlocked` 만** 본다. 그래서:

| 항목 | 역할 |
|---|---|
| D 해석의 매체 귀속 없음 | **공개 차단** — 우리 전망을 남의 입에 넣는 허위 귀속. 2026-07-27 창작인용 사고(기사 2편 내려감)의 본질 |
| A 구체 수치 밀도 / B 헤지 밀도 / C 프레임 유사도 | **계측만** — 로그에 `⚠️` 로 찍히고 공개는 그대로 진행 |

주석에 이유까지 있다: *"표본도 아직 7편뿐이라 임계값 자체가 덜 검증됐다 — 매일 실측을 쌓아 판단 근거를 만든다."*

## ★진짜 문제 — 유예를 풀 조건이 닫혀 있다

같은 주석의 승격 조건: **"통과율 3회 연속 100% → 차단 모드로 승격"**.

`out/*_result.json` **108편 전수 집계**(2026-09-20 직접):

```text
originality.pass = true      0 / 108편   ← 한 번도 없음
구체 수치 임계(3.0) 충족      9 / 108
헤지 임계(3.0 이하) 충족      2 / 108
```

**3회 연속은커녕 1회도 없다.** 그러니 이 게이트는 "곧 켤 계측 모드"가 아니라 **영구 유예**다. 스스로는 절대 안 풀린다.

## 형께 드린 선택지 (2026-09-20, 답 대기)

① 그대로 둔다 ② 승격 조건을 도달 가능하게 고친다(예: "7일 통과율 50%") ③ 원인을 손본다 — **통과 못 하는 건 게이트가 아니라 원고다**(수치 0·헤지 과다), 즉 작성 프롬프트 쪽.

## 임계값의 근거 (지어낸 숫자가 아니다)

`originality-gate.mjs` 66행 `THRESHOLDS = { figPer1k: 3.0, hedgePer1k: 3.0, frameSim: 0.25 }`.
★**구체성은 "근거 있는 수치"만 센다** — 날것의 수치 밀도를 쓰면 **창작에 점수를 주는 게이트**가 된다. 실측(2026-07-26): 창작본 8.6/1k > 사람 수정본 7.1/1k, 원본이 "대미 비중 35%"(실제 7.2%)를 지어냈기 때문. 그래서 `figPer1k`가 0이라는 건 "수치가 없다"가 아니라 **"출처 붙은 수치가 없다"** 일 수 있다.

관련: [[project_open_threads_2026-09-20_dawn_snapshot]] · [[feedback_read_own_records_before_reporting_as_new_2026-09-17]] · [[feedback_check_tool_can_false_pass]]
