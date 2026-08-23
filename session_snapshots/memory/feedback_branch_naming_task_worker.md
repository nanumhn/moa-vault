---
name: feedback_branch_naming_task_worker
description: 개발 작업 브랜치는 "작업명-작업자명" 으로 만든다 — 형 지시 2026-08-24
metadata:
  type: feedback
---

**★형 지시 2026-08-24 00:48**: *"개발 작업 시 브랜치를 작업명-작업자명 으로 규칙을 만들자."*

## 규칙

개발 작업은 **기본 브랜치에 바로 커밋하지 않고** 브랜치를 판다. 이름은 **`작업명-작업자명`**.
```
cli-window-seojin
approval-button-seojin
saju-lichun-fix-dex
carousel-v5-jena
```
- **작업명이 앞, 작업자명이 뒤.** 목록에서 작업 단위로 모여 보이게.
- 작업자명은 우리가 부르는 이름(seojin / dex / jena / clo)을 쓴다.

## Why

**같은 레포에 둘이 동시에 커밋하면 섞인다** — 2026-08-10에 실제로 났다([[feedback_parallel_agents_same_repo_git_conflict]]).
그리고 2026-08-21에는 **한쪽이 브랜치를 바꿔서 다른 쪽이 엉뚱한 브랜치의 테스트 수를 재고 있었다**(CLAUDE.md A5).
브랜치를 작업·사람 단위로 나누면 둘 다 안 생긴다. **누가 무엇을 했는지도 브랜치 이름에 남는다** —
[[feedback_lab_report_requires_author_name]](랩실 보고에 보고자 이름)과 같은 취지다.

**2026-08-23 CLI 창 작업 때는** 서진이 코드를 쓰고 **클로가 대신 커밋**해서 충돌을 피했다.
그건 임시방편이었고, 브랜치 규칙이 있으면 **서진이 자기 브랜치에 직접 커밋**할 수 있다.

## How to apply

1. 작업 지시서에 **브랜치명을 같이 준다**(A9 체크리스트의 "시킬 때" 항목에 추가).
2. 병합은 완료·검수 후. 측정은 가능하면 **커밋에 핀 고정한 격리 워크트리**에서(A5).
3. **아직 문서에 반영 안 했다** — `CLAUDE.md` SECTION-A(A5)와 `templates/AGENTS.md` 에 넣어야 한다.
   같은 대기열: [[feedback_lab_report_requires_author_name]], "자기가 도는 시스템은 직접 안 고친다",
   "고치기 전에 재는 도구부터 의심한다".

관련: [[feedback_parallel_agents_same_repo_git_conflict]] · [[feedback_commit_promptly]] · [[feedback_verify_push_not_just_commit]]
