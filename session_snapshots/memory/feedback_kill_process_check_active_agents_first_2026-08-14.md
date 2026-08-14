---
name: feedback_kill_process_check_active_agents_first_2026-08-14
description: 형 요청으로 nblog-saas 3002 dev server를 종료했는데, 그 순간 진행 중이던 배경 에이전트(3번 태스크)가 그 서버를 쓰는 중이었음 — 프로세스 종료 전 활성 에이전트 확인 필요
metadata:
  type: feedback
  originSessionId: f3737d80-1863-4133-a282-d39f5bf4e896
  modified: 2026-08-14T11:44:08.369Z
---

형이 "필요없으면 담당자 찾아서 종료해"라고 해서 nblog-saas 3002 포트 dev server(PID 27336/27544/13004)를 조사했다. 프로세스 커맨드라인에서 시작 시각(13:46 KST)과 시작 세션ID를 확인해 "이전(완료된) QA검증 세션이 띄운 것"으로 결론짓고 종료했다. 그런데 그 시점에 **내가 방금 백그라운드로 돌리고 있던 3번 태스크(키워드입력 파이프라인, cto-seojin 에이전트)가 바로 그 서버를 실사용 중**이었다 — 그 태스크 완료보고에서 "3002 dev server는 안 껐습니다(healthcheck 200 확인)"이라고 명시했는데, 내가 그 직후/도중에 죽여버렸다. 다행히 Next.js가 config파일 변경으로 자체재시작하는 타이밍과 맞물려 실작업엔 지장이 없었지만, 순전히 운이었다.

**Why:** 프로세스의 "시작 시각·시작 세션"만 보고 "그 세션은 끝났으니 이 프로세스도 안 쓰겠지"라고 판단했다. 하지만 내가 지금 이 순간 병렬로 돌리고 있는 다른 백그라운드 에이전트가 같은 리소스(포트/서버)를 쓰고 있을 수 있다는 걸 확인 안 했다. [[feedback_parallel_agents_same_repo_git_conflict]]가 git commit 충돌을 경고했던 것과 같은 근본원인(같은 레포/리소스에 동시 접근하는 여러 에이전트)인데, 이번엔 git이 아니라 실행 중인 프로세스(dev server)라 더 조용히 깨질 수 있었다.

**How to apply:** 형이나 상황이 "이 프로세스/서버 종료해도 되나" 물으면, 종료 전에 **지금 이 순간 내가 돌리고 있는 배경 에이전트 목록**(SendMessage로 물어보거나, 최근 dispatch한 태스크가 같은 레포/서비스를 건드리는지)부터 확인한다. "시작한 세션이 끝났다"는 "지금 아무도 안 쓴다"를 보장하지 않는다 — 다른 세션·다른 에이전트가 이어받아 쓰고 있을 수 있다.

관련: [[feedback_parallel_agents_same_repo_git_conflict]] [[reference_nblog_saas_shared_test_db_contention]]
