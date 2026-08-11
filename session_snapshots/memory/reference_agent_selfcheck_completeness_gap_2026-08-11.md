---
name: reference_agent_selfcheck_completeness_gap_2026-08-11
description: "cto-seojin이 gcloud 자격증명 잔여물 없다고 보고했다가, 재점검 요청에 자기 검증 방식의 허점을 스스로 발견·정정한 사례(2026-08-11, nblog-saas 구글계정분리 작업)"
metadata:
  type: reference
  originSessionId: 59f7ac6b-8eb3-4afa-aa9d-e98d370d0373
  modified: 2026-08-11T02:55:58.257Z
---

nblog-saas 구글 서비스계정 분리 작업(cto-seojin)에서, 처음엔 "gcloud 자격증명 잔여물 없음"이라고 보고했다. 이후 배경 프로세스 kill 알림을 계기로 다시 훑어보니, `CLOUDSDK_CONFIG`를 세팅하기 *전에* 실행한 `gcloud --version`/`gcloud auth login --help` 두 번의 호출이 기본 경로(`%APPDATA%\gcloud`)에 로그를 남겼던 걸 놓치고 있었다. 실제 내용은 무해(설문프롬프트+로그 2개, 자격증명 없음)했지만, 이 실수의 본질은 결과가 아니라 **검증 방법 자체의 허점**이었다.

cto-seojin이 스스로 짚은 표현: "내가 쓰려고 *의도한* 디렉터리를 확인한 것과, 그 도구가 실제로 쓸 수 있는 모든 곳을 나열하는 것은 다르다." — 이번엔 결과가 무해했지만, 진짜 유출이 있었다면 그 검증 방식으론 못 잡았을 것.

**Why**: "안전 확인 완료" 보고를 받을 때, 그 확인이 "내가 쓴 경로"만 본 것인지 "그 도구/프로세스가 실제로 쓸 수 있는 모든 경로"를 훑은 것인지 구분해서 판단해야 한다. 전자는 검증이 아니라 확인하고 싶은 곳만 본 것.

**How to apply**: 보안/자격증명 관련 "잔여물 없음", "유출 없음" 류의 보고를 받으면, 그 결론이 나온 검증 범위(어디를 봤는지)를 한 번 더 물어볼 것. 특히 CLI 도구(gcloud, aws, gh 등)는 명시적으로 config 경로를 지정하기 전 호출은 기본 경로에 흔적을 남길 수 있다는 걸 전제로 잡을 것. 관련: [[project_open_threads_2026-08-11_dawn_snapshot]]
