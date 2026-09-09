---
name: project_atz_gpt_project_home_broken_2026-09-09
description: "아투 GPT 작성기가 매번 실패하는 진짜 원인 — ChatGPT '프로젝트 홈'(/project) 페이지가 안 열린다. 로그인 문제가 아니다"
metadata:
  node_type: memory
  type: project
---

## 증상과 오진

`atz_pipeline.log` 에 찍히는 **`ChatGPT 로그인 안 됨 — Default(BlackHeart) 프로필 창인지 확인 필요`** 는 **거짓 이름표다.**
`gpt_write.mjs` 의 로그인 판정은 오직 `#prompt-textarea`(입력창) 유무 하나로 한다(30초·12회 재시도 후 단정).
그래서 **페이지가 어떤 이유로든 안 그려지면 전부 "로그인 안 됨"으로 보고된다.**

실제로 로그인은 살아 있었다 — 그 페이지가 부른 `backend-api/me` 와 `accounts/check` 가 **둘 다 200**.

## 실측 (2026-09-09 08:2x~08:4x, 9222 디버그 크롬에 직접 붙어 확인)

| 주소 | 결과 |
|---|---|
| `/g/g-p-<id>/project` (옛 기사박스 2026-07) | ❌ 새까만 화면 + "다시 시도하기" 버튼 하나, 본문 글자수 7 |
| `/g/g-p-<id>/project` (새 202609, 이름표 없음) | ❌ 동일 |
| `/g/g-p-<id>-atu-gisabagseu-202609/project` (이름표 있음) | ❌ 동일 |
| 캐시무시 새로고침 · "다시 시도하기" 클릭 | ❌ 회복 안 됨 |
| `/g/<slug>` (project 없이) | ❌ `/project` 로 리다이렉트되어 동일 |
| **`/g/<slug>/c/<대화id>`** | ✅ 입력창 있음, 사이드바 정상, 본문 8,423자 |

**즉 프로젝트 "홈"만 죽고 프로젝트 "대화"는 산다.** 사이드바의 프로젝트 링크도 그 죽은 `/project` 로 간다.
사이드바 "새 채팅"은 `href="/"` 라 **프로젝트 밖 일반 대화**로 나간다 — 프로젝트 안에 새 대화를 여는 UI 경로가 지금 없다.

**작성기는 `/project` 하나만 진입점으로 쓴다**(`askGpt` → `ensureOn(projectUrl)` → 빈 대화 확인 → 주문).
그래서 이 페이지가 죽으면 기사·쇼츠대본이 통째로 qwen 폴백으로 떨어진다.

## 아직 원인 미확정

콘솔 오류 2건: ①**인라인 스크립트가 CSP에 막힘** ②`backend-api/locked_chats/status` 404.
그 크롬(`C:\chrome-debug-profile`)에 확장 2개가 모든 페이지에 주입된다 —
**`INISAFE CrossWeb EX`**(dheimbmpmkbepjjcobigjacfepohombn) · **crxMouse**(jlgkpaicikihijadgifklkbpdajbkhjo).
INISAFE가 인라인 주입으로 유명하니 유력 후보지만 **검증 안 했다** — 같은 확장이 켜진 채 `/c/` 는 멀쩡하다는 반증도 있다.

**다음에 할 시험**: `moa_debug_chrome_up.ps1` 의 인자에 `--disable-extensions` 를 붙여 재기동 후 `/project` 재시도.
그 스크립트 44~53행이 인자 배열이다. 크롬을 죽여야 하므로 **쇼츠·기사 실행 중에는 하지 말 것.**

## 곁가지로 확인된 것

- 옛 프로젝트 ID `g-p-6a6aa183183c81918feb5f764ac81602` 가 **5개 파일에 복사**돼 있다:
  `atz-pipeline/gpt-writer.mjs` · `atz-pipeline/shorts-script.mjs` ·
  `gpt-article/run_gpt_once.mjs` · `probe_write.mjs` · `fix_held_post.mjs`.
  형 지시로 이미지 쪽(`tools/gpt-image/config.json`)은 202609(`g-p-6aa098efa4608191b6ba2a275f4ce909`)로 바꿨다.
  나머지 5곳은 **새 프로젝트 홈도 똑같이 깨져 있어서 바꿔도 소용없으므로 보류**했다.
- `gpt-retry.mjs` 의 **미커밋 수정**이 "로그인 만료는 재시도 없이 즉시 폴백" 규칙을 깼다.
  HEAD 판으로 되돌리면 `gpt-retry.test.mjs` 가 exit=0, 작업트리판은 exit=1. 그래서 오늘 매번 3회 헛재시도했다.

관련: [[project_atz_qwen_fallback_hold_blocked_blog_2026-09-09]] · [[project_atz_gate_dual_path_disparity_2026-09-06]]

---

## 2026-09-09 09:5x — 해결. 커밋 `ea2b2ed` 푸시 완료.

**형이 준 결정적 단서**: *"메인을 경유해서 왼쪽 메뉴에서 「아투 기사박스 202609」를 찾아서 클릭해"*.
그대로 해보니 열렸다 — `/project` 는 **찬 상태에서 바로 열면 죽고, 앱이 산 상태에서 안에서 이동하면 산다.**

**★첫 수리가 실패한 이유(중요)**: 입력창이 보이자마자 사이드바를 눌렀더니 **주소만 바뀌고 화면은 안 떴다.**
`button[aria-label="프로젝트 홈 열기"]` 가 **실제로 생길 때까지 기다렸다가** 누르니 첫 시도에 들어간다.
"보이는 것 하나(입력창)"로 "다 준비됐다"를 판정하면 안 된다는 사례가 하나 더 늘었다.

**두 번째 숨은 조건 — 출력 형식이 코드에 없었다.**
`parseGptArticle` 은 `제목: ...` 첫 줄을 요구하는데 그 요구가 **주문 어디에도 없었고 옛 프로젝트 지침에만** 있었다.
프로젝트를 202609로 옮기자 GPT 가 형식을 모르고 써서 **멀쩡한 응답이 통째로 버려지고 qwen 폴백**으로 떨어졌다.
→ `buildOrder` 에 `[출력 형식]` 절을 넣어 주문이 직접 요구하게 했다.

**교훈(오늘 하루의 형태)**: 실패 원인 네 개가 전부 **코드 밖에 숨은 조건**이었다 —
①ChatGPT 프로젝트 지침 ②프로젝트 홈 진입 방식 ③미커밋 게이트 수리 ④미커밋 gpt-retry 수정.
로그의 낱말("로그인 안 됨")은 그중 아무것도 가리키지 않았다.

**검증**: dry 전 구간 통과 — 진입 첫 시도 성공 · GPT 작성 59초(작성자 gpt, 1,130자) · 게이트 자동정정 후 통과 · exit 0.
**미결로 남긴 것**: `shorts-script.mjs` 는 남의 미커밋 작업(09-08 언어 가드)이 섞여 커밋 안 함(동작은 함).
`tools/gpt-article` 17개 중 2개, `tools/gpt-image` 7개 중 1개만 git 추적 — 작성기 핵심이 버전관리 밖이다.
