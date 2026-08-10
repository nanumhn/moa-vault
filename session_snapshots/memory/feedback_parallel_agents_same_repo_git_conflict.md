---
name: feedback_parallel_agents_same_repo_git_conflict
description: 같은 레포에 cto 에이전트 여러 개를 동시 위임하면 git index 공유로 커밋이 서로 섞임 (2026-08-10 nblog-saas 실측)
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c23b79cb-17fc-4fd7-8157-44d3094571d0
  modified: 2026-08-10T15:38:14.715Z
---

2026-08-10 nblog-saas에 cto-seojin 에이전트를 하루 종일 여러 개(대시보드·시트아카이브·슬롯정책·초대코드·PC에이전트패키징·관리자화면) 병렬로 위임했다. 대부분은 서로 다른 파일을 건드려서 무사했지만, 두 에이전트가 거의 동시에 `git commit`을 돌리는 순간 **git index를 공유**해서 한 에이전트가 stage해둔 파일이 다른 에이전트의 커밋에 섞여 들어간 사고가 1건 발생(데이터 유실은 없었음, 커밋 메시지만 실제 내용과 안 맞게 됨).

**Why:** git worktree 격리 없이(Agent 도구의 `isolation: "worktree"` 옵션 안 씀) 같은 작업 디렉터리를 여러 에이전트가 공유하면, 파일 변경 자체는 안전해도 `git add`/`git commit` 타이밍이 겹치는 순간은 원리적으로 안전하지 않다 — working tree와 index는 레포당 하나뿐이라서다.

**How to apply:** 같은 레포에 여러 cto 에이전트를 병렬로 띄울 때, 각 에이전트에게 "완료 후 알아서 커밋"을 맡기지 말고 ①커밋 타이밍을 오케스트레이터(나)가 순차적으로 관리하거나 ②`isolation: "worktree"`로 각자 격리된 워크트리에서 작업시키고 병합은 내가 하는 방식을 고려할 것. 지금처럼 "각자 알아서 커밋"으로 두면 이번처럼 낮은 확률로 커밋이 섞이는 사고가 반복될 수 있다. 관련: [[reference_nblog_saas_shared_test_db_contention]](같은 종류의 공유자원 경합 문제)
