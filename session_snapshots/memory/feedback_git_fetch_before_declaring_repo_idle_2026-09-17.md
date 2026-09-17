---
name: feedback_git_fetch_before_declaring_repo_idle_2026-09-17
description: "저장소가 '커밋 0건'이라고 말하기 전에 반드시 git fetch 한다 — 낡은 로컬 클론을 근거로 k-saju 블로그를 2주 동안 '죽었다'고 오보했다"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d8ca3303-d389-4de8-95d9-62591d76ae69
  modified: 2026-09-17T00:49:22.508Z
---

**규칙**: 어떤 저장소를 두고 *"커밋이 없다 / 멈췄다 / 정지했다"* 고 말하기 전에 **`git fetch` 를 먼저 돌린다.** `git log --all` 은 **로컬에 받아온 것만** 본다 — 원격에 새 커밋이 아무리 쌓여도 fetch 전에는 안 보인다.

**Why**: 2026-09-17 09:5x, k-saju 블로그가 *"09-03 이후 14일째 새 글 0건, 유입 라인 정지, 원인 규명이 최우선"* 이라는 진단이 **전부 오보**였음이 드러났다. `git fetch origin` 한 줄을 돌리자 `origin/main` HEAD 가 `62a58f7` = **그날 아침 글**이었고, 09-04 이후 `add blog post` 커밋이 **9편**(09-04·05·06·08·10·11·12·13·16·17), 오늘 글은 라이브에서 **HTTP 200** 이었다. 로컬 클론이 `28b8bfe`(09-03)에 멈춰 있었을 뿐이다.

**한 번의 실수가 아니다**: 09-13 세션 · 09-17 04:2x MOC 갱신(같은 날 몇 시간 전의 나) · 그 사이 스냅샷 메모리가 **전부 같은 방식으로 같은 오답**을 냈다. 그 결과 *"블로그 08:10 자동발행 미실행 원인 규명"* 이 k-saju MOC 의 **최우선 `waiting_on` 으로 열흘 넘게** 올라가 있었는데 **존재하지 않는 과제**였다. 없는 일을 형께 최우선 문제로 보고해 온 것이다.

**왜 안 걸러졌나**: "커밋 0건"은 **아무것도 안 나오는 모양**이라 결과가 비어 있어도 이상해 보이지 않는다. 있는 것을 잘못 읽은 게 아니라 **없는 것을 그대로 믿은** 유형이라 [[feedback_absence_of_record_is_not_absence_of_problem_2026-09-06]] 와 짝이다. 여러 저장소를 한꺼번에 세는 자리(모아 스튜디오 MOC 같은)에서 특히 위험하다 — 한 번의 오판이 여러 문서로 전파된다.

**How to apply**
- 저장소 상태를 보고하기 전: `git -c credential.helper= -c "credential.helper=!gh auth git-credential" fetch origin` → 그 다음 `git log origin/<branch>` 로 본다. 로컬 `HEAD` 가 아니라 **`origin/main` 을 기준으로 센다.**
- 인증이 막히면 [[reference_owenlab_git_push_gh_credential]] 의 두 플래그 방식을 쓴다(fetch 에도 똑같이 적용된다).
- 파이프라인이 GitHub push 로 발행하는 프로젝트(k-saju 블로그, 아투)는 **로컬 클론이 구조적으로 항상 낡는다.** 사람이 그 클론에서 커밋하지 않기 때문이다.
- 더 나은 판정: 커밋이 아니라 **라이브 결과물**로 본다 — sitemap 슬러그, 공개 URL 200. 09-17 에 `origin/main` 글 목록과 sitemap 을 `comm` 으로 집합 대조하니 라이브에 없는 글이 **정확히 6편**(08-30 깨진 머리말 건 그대로)이고 라이브에만 있는 글은 **0건**으로 깔끔히 갈렸다.

---

## 2026-09-17 오후 — 같은 날 두 번 더 걸렸다 (총 3회)

같은 세션에서 **다른 레포로 두 번 더** 같은 함정에 빠졌다. 이제 이건 "한 번 있었던 사고"가 아니라 **기본 습관의 결함**이다.

| # | 레포 | 낡은 클론이 만든 오판 | 실제 (fetch 후) |
|---|---|---|---|
| 1 | k-saju-blog | "블로그 2주 정지" | 매일 발행 중이었음 |
| 2 | k-saju-blog | "라이브 64 vs 레포 71 = 7편 차" | 로컬이 **10커밋 뒤**. 실제 67 vs 61 = 6편 |
| 3 | nblog-saas | "커밋 6건이 dex/ops-baseline 한 갈래에만, main 미병합" | PR #2로 **main·prod 양쪽에 이미 병합**. ops-baseline은 오히려 main보다 6커밋 뒤 |

**How to apply (강화):**
- 레포 상태에 대해 **어떤 주장이든** 하기 전에 `git fetch --all` 이 먼저다. "커밋 0건"뿐 아니라 **"미병합"·"한 갈래에만"·"N개 차이"** 도 전부 같은 함정이다.
- 파일 개수를 셀 때 **워킹트리(`ls`/`find`)가 아니라 `git ls-tree -r origin/<branch>`** 로 센다. 워킹트리는 낡은 데다 빌드 산출물·드래프트·픽스처가 섞인다 (2번에서 `tools/_drafts` 7 + `tools/fixtures` 7이 섞여 71이 됐다).
- 병합 여부는 브랜치 이름이 아니라 **`git merge-base --is-ancestor <commit> origin/<branch>`** 로 커밋 단위로 확인한다.
- ★**로컬 클론과 워크트리가 수십 개 있는 환경이다**(`D:\Develop`에 `nblog-saas-*` 17개). 아무 폴더나 열어 본 것을 "레포 상태"라고 말하지 말 것.

