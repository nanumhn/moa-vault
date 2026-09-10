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

---

**★2026-09-10 04:4x — ①의 원인 확정. 위에 적은 "중복 회피 재생성" 가설은 틀렸다.**

[확인: `out/2026-09-09T10-30-12_pm_result.json` 직접 조회 + `scene-prompt.mjs` `subjectsForArticle` 코드 직접 조회]

- 결과파일 `regenerated` 는 **false**. 재생성 경로가 아니었다. (위 본문의 `dupNote` 추정은 폐기)
- 실제 배정: HERO `policy/us(llm)` · SEC1 `place/korea(fallback)` · SEC2 `place/us(llm)` · SEC3 `policy/korea(llm)`.
  소제목 3개는 전부 미국 국내 정치(댈러스 전당대회 / 트럼프·사회주의 / 우편투표·선거구).
- **korea 2자리는 버그가 아니라 규칙대로 간 것이다.** `subjectsForArticle` 의 두 줄이 각각 하나씩 준다 —
  `if (secondary) push(...)`(2등 나라 자리 **보장**) → SEC1, `if (secondary) for (const id of ['place','policy']) push(...)`(남은 자리) → SEC3.
- 08-22에 넣은 `SECONDARY_MIN_RATIO = 0.3` 문턱은 **작동했고 korea 가 통과했다.** 문턱이 안 걸린 게 아니다.

**[추정] 구조적 원인**: 아투는 "미국 뉴스를 한국 독자에게" 블로그라 거의 모든 기사에 한국 언급이 붙어 korea 가 늘 0.3을 넘는다.
2등 나라 자리 보장 규칙은 미·이란 같은 **진짜 2개국 기사**용으로 만든 것인데(주석에 그렇게 적혀 있다),
아투에서는 2등 나라가 기사가 아니라 **블로그 자체의 성격**에서 나온다. 그래서 미국 국내 기사도 그림 절반이 서울이 된다.
**반증조건**: korea/us 점수비가 0.3 미만인데도 korea 슬롯이 배정된 회차가 있으면 이 해석은 틀림.

**곁가지**: SEC1 은 `promptSource:"fallback"` — LLM 프롬프트 생성 실패로 `entities.mjs` korea `placeScene` 하드코딩 문장이 그대로 쓰였다.

**처리**: 09-10 04:4x 그들만의업무 방에 덱스·제나 멘션으로 자료 전달(메시지 `1547330371283329074`). 수정은 두 사람 몫 — 클로는 코드 안 건드린다([[feedback_clo_tests_jena_codes_2026-09-06]]).
