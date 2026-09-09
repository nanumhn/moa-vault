---
name: project-atz-pm-20260909-gpt-ok-but-three-defects
description: 2026-09-09 19:30 아투 PM — GPT 수리는 통했으나 한국 이미지 혼입·분량미달 공개·라벨대조 오탐 3건 발견
metadata: 
  node_type: memory
  type: project
  originSessionId: d8ea0b3f-2bb5-4c43-92c2-59c895fcfba3
  modified: 2026-09-09T14:01:36.071Z
---

**2026-09-09 19:30 아투 PM 슬롯 = [[project_atz_gpt_project_home_broken_2026-09-09]] 수리 후 첫 실전. 수리는 통했다.**

[확인: `out/2026-09-09T10-30-12_pm_result.json` 직접 조회 + 공개 URL 2개 직접 재조회 — 09-09 22:5x]
- `writer:"gpt"` · `writerAttempts:3` · `writerRequested:"gpt"` — **qwen 폴백 아님**
- 블로그 LIVE `662576805768358416` https://www.american-todayz.com/2026/09/blog-post_386.html (HTTP 200)
- 쇼츠 `AoKMGndv8f4` (HTTP 200) · 원장 `publish_ledger.jsonl` 20:12 published

**그러나 나간 글에 결함 3건 — 전부 미수리, 제나 몫(코드).**

**① 미국 기사에 한국 이미지 2장** [확인: sec1·sec3 jpg 직접 열어 육안 확인]
sec1(`promptSource:"fallback"`)·sec3 프롬프트에 `seoul han river skyline`, `geo:"korea"`.
소제목은 "공화당은 사상 첫 중간선거 전당대회를 댈러스에서 연다" / "우편투표와 선거구 문제".
`dupNote`에 "과거중복 → 재생성" 4건 — **중복 회피 재생성이 주제 밖 이미지로 떨어진 것으로 보임(미확인)**.
독자가 바로 알아채는 결함이라 우선순위 1위.

**② 분량 미달인데 자동 공개됨** [확인: `run.mjs:198 shouldAutoPublish` 코드 직접 조회]
`gate.ok:false` — 본문 1387자(<1600). 그런데 공개 판정은 `autoPublish && !dry && qa.pass && !origBlocked.length && publish.ok` 뿐 —
**`gate.ok`도 `originality.pass`도 판정에 안 들어간다.** 로그만 남고 그대로 나간다. 설계인지 누락인지는 형·제나 판단.

**③ 발행봇 ⚠️ = 라벨 대조 오탐(추측, 소거법)**
`verifyDiffs` 4검사 중 제목·이미지수(4=4)·LIVE는 **실측 일치 확인**. 남은 건 라벨뿐.
원인 가설: `payload.labels = finalLabels`(run.mjs:570, `publishLabelsForContent` 산출)인데
카드에는 `art`를 넘겨(run.mjs:653) `verifyDiffs`가 **가공 전 `art.labels`** 와 실제를 비교한다.
★`art.labels`는 어디에도 저장되지 않아 직접 확인 못 함. **반증법: 다음 회차 카드 embed의 "라벨:" 줄과 실제 라벨을 비교하면 확정.**
(fetch_messages는 embed를 안 돌려줘서 09-09 카드로는 확인 불가.)

**부수 확인**: `originality.pass:false` — 수치 0/1k(기준 3↑), 헤지 9.1/1k(기준 3↓), 계측기 코멘트 "주장 없이 '~수 있다'로만 채움".
AM 슬롯은 이날 정시 결번([[project_atz_qwen_fallback_hold_blocked_blog_2026-09-09]]), 09:27 dry-run만 있음 → am 쇼츠 `skipped`.
