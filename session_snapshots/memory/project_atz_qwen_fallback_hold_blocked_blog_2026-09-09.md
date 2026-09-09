---
name: project_atz_qwen_fallback_hold_blocked_blog_2026-09-09
description: "2026-09-09 아투 블로그·쇼츠 결번 — ChatGPT 로그인 끊김 → qwen 폴백 → '폴백은 보류' 정책에 걸림. 그 정책이 발행 불가 원고를 막아준 것은 옳았다"
metadata:
  node_type: memory
  type: project
---

**손실 사슬 (전부 직접 조회)**

| 시각(KST) | 일 | 근거 |
|---|---|---|
| 09-09 06:00~06:02 | GPT 작성 3회 전부 실패 — `ChatGPT 로그인 안 됨 — Default(BlackHeart) 프로필 창인지 확인 필요` | `atz_pipeline.log` UTF-16 디코드해 세 줄 직접 열람 |
| 06:02 | qwen 폴백으로 작성 | `2026-09-08T21-00-13_am_result.json` `writer="qwen(폴백)"`, `writerRequested="gpt"` |
| 06:12 | QA **12/12 통과**했는데 보류 | 같은 파일 `why="qwen 폴백 원고(품질 관리 보류)"`, `qa.pass=true`, `failedItems=[]` |
| 06:42 | 블로그 발행분 없어 **AM 쇼츠 결번** | `publish_ledger.jsonl` 09-09 06:42 `status:"skipped"` |

보류 조건은 `run.mjs` 의 `const blocked = !qa.pass || origBlocked.length > 0 || isQwenFallback;`
(`isQwenFallback` 은 2026-09-06 신설). **정책 자체는 정상 동작했다.**

## ★그 정책이 오늘 우리를 구했다 — 게이트는 이 글을 12/12로 통과시켰다

qwen 원고를 영문 원문(`_sources.txt` 1,942자)과 직접 대조한 결과, **발행하면 안 되는 글**이었다:

- 원문 전체가 `Strait of Hormuz` 인데 → **"팔라만트 제도"** 라는 **없는 지명으로 바꿔 7회 반복**
- `Revolutionary Guard` → **"이란 혁명 보병대"**
- `"one of the most modern... submarines of the American terrorist army"`(이란 관영 파르스의 표현)
  → **"미국 반군"**, 게다가 **이란 주장이라는 귀속이 사라짐**
- `U.S. Navy Captain Tim Hawkins` → **"캡틴 타임 홀스"**
- `strategic` 이 번역 안 되고 **영어 그대로 본문에 남음**
- 인용 부정구조 반전 — 원문 `neither collected sensitive data nor carried any classified... equipment`
  를 글에선 `"…실었다"는 사실이 없다` 로 **따옴표 위치를 바꿔** 인용 밖으로 부정을 빼냈다
- `📰 결론` 소제목 아래에 결론이 없고 출처 고지문만 있음

**★진짜 구멍**: `qa-gate` 12항목에 **지명 환각·오역·영어 잔존을 보는 검사가 아예 없다**(체크리스트 전항목 열람).
없는 지명을 7번 써도 12/12가 나온다. [[reference_atz_gate_anchor_hangul_gap_2026-08-04]] 의 확장판.

## 보류 5건 재검수 결과 (전부 `bun run.mjs --from=... --dry`)

| 파일 | 판정 |
|---|---|
| 09-04 am 최대 5억달러 투입 | ❌ 최근 7일 내 동일 제목 이미 공개 → 중복 차단 |
| 09-06 pm 트럼프의 AI 붐 | ✅ 12/12 — 원인은 [[project_atz_gate_dual_path_disparity_2026-09-06]] |
| 09-06 pm 트럼프 파병 압박 | ❌ 중복(이미 공개됨) |
| 09-08 pm 이란 "한국군 파병은 적대행위" | ✅ 12/12 — **이미 고쳐져 있고 발행만 안 됐다** |
| 09-09 am 무인잠수정 잡기 | 게이트 ✅ / **내 검수 ❌ 불합격** |

**★09-08 pm — 게이트는 오탐이 아니었다.** 처음 내가 "오탐"으로 읽었는데 틀렸다.
`.orig-held.json`(19:40)과 현재 payload(21:49)를 대조하니 **이전 세션이 이미 수리해 둔 것**이었다:
인용 [2]가 `…적대행위로 간주할 것이다.`(절단) → `…간주할 것이며 한국은 호르무즈 해협을 이전과 같은 방식으로 이용할 수 없게 될 것`(원문 verbatim)로,
인용 [4]는 소제목 축약 `트럼프가 한국군을 총알받이로 내몬다` → 원문 문장으로 교체돼 있었다.
**즉 게이트가 절단·소제목축약을 정확히 잡았고, 수리도 됐는데 마지막 발행 한 걸음을 아무도 안 밟아 어제 PM이 결번났다.**
교훈: 보류큐는 **고친 뒤 발행까지가 한 단위**다. 고쳐놓고 두면 결번은 그대로 난다.

**형 결재 대기**: `REQ-20260909-ATZHOLD-01`(메시지 `1547017862617632871`) — ①ChatGPT 로그인(형) ②게이트 2줄 커밋(제나) ③09-08 pm 발행(제나).
관련: [[reference_atz_gpt_fallback_quality_risk_2026-08-07]] · [[feedback_clo_no_deploy_owner_is_jena_2026-09-06]]
