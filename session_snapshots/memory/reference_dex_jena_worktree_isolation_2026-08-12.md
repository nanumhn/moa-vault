---
name: reference_dex_jena_worktree_isolation_2026-08-12
description: 덱스·제나가 같은 저장소에서 동시작업할 때 git worktree로 격리하는 신규 표준 — nblog-saas에 처음 적용
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T03:58:21.956Z
---

2026-08-12 형 지시로 [[feedback_parallel_agents_same_repo_git_conflict]] 문제(같은 폴더 병렬작업시 커밋 섞임)의 정식 해결책으로 git worktree 격리를 도입.

**설정**:
- `D:\Develop\nblog-saas-dex` — 브랜치 `ui-improvements-dex`(main에서 분기), 덱스 전용
- `D:\Develop\nblog-saas-jena` — 브랜치 `ui-improvements-jena`(main에서 분기), 제나 전용
- 원본 `D:\Develop\nblog-saas`(main)는 이제 둘 다 직접 안 건드림 — 클로가 각 브랜치를 검수 후 main으로 merge하는 방식으로 전환.
- 브랜치 명명 규칙(형 확정): 작업자 이름을 끝에 `-dex`/`-jena`로 붙임.

**제나 워크디렉토리 확장**: `D:\Develop\dex-jena-bridge\.env.gemini`의 `CODEX_WORKDIR`을 `D:\Develop\jena-workspace`(리서치 전담 시절 값)에서 `D:\Develop`(덱스와 동일)로 확장. 코드작업을 처음 배정하면서 필요해짐([[reference_dex_jena_workdir_scope_2026-08-08]]에서 예견된 변경). 반영 절차: `.env.gemini` 수정 → 기존 node.exe(jena) 프로세스 kill → 같은 세션의 daemon.ps1 supervisor 루프가 자동으로 10초 내 재기동(워치독까지 안 기다려도 됨, supervisor 자체가 while루프로 재시작) → PID 바뀐 것 확인.

**패키지매니저 함정**: nblog-saas는 npm이 아니라 **bun** 사용(`bun.lock`, `package-lock.json` 없음) — 새 worktree에서 `npm ci` 시도하면 EUSAGE 에러남, `bun install`로 해야 함.

**남은 프로세스**: 각 브랜치에서 작업 완료 → 클로가 검수 후 main에 merge → 두 worktree 다 정기적으로 main 최신을 rebase/merge해서 벌어지지 않게 관리 필요(다음 세션이 첫 merge 실전 검증할 것, 아직 미검증).

관련: [[feedback_parallel_agents_same_repo_git_conflict]] [[reference_dex_jena_workdir_scope_2026-08-08]] [[project_nblog_linkbug_and_backlog_2026-08-12]]
