---
name: reference_docker_cred_helper_broken
description: "내 백그라운드 셸에선 docker pull이 자격증명 헬퍼 에러로 막힘, 형이 직접 실행해야"
metadata: 
  node_type: memory
  type: reference
  originSessionId: d4d85045-9965-4381-b668-83a704d3aa7a
---

이 PC에서 **내(에이전트) Bash 셸로 `docker pull`/`docker run`(이미지 받기)이 막힘.** 에러:
```
error getting credentials - "A specified logon session does not exist. It may already have been terminated."
```
원인: Docker Desktop 자격증명 헬퍼 `docker-credential-desktop.exe`가 형의 인터랙티브 데스크톱 로그인 세션에 묶여있는데, 내 셸은 그 세션 밖이라 SSPI 실패. credsStore 제거·격리 config·logout 다 시도해도 동일(Docker Desktop이 헬퍼를 강제 호출).

**우회법:** 이미지 받는 작업은 형에게 `! docker run/pull ...`로 형 세션에서 직접 실행 요청. (`docker ps`/`docker logs`/`docker exec` 등 **로컬 데몬 호출은 내 셸에서도 정상** — 자격증명 안 거치는 작업은 OK.) 관련 [[project_n8n_viral_marketing]].
