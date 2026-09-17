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
