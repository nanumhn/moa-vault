---
name: reference-dex-jena-workdir-scope-2026-08-08
description: "덱스(Codex)·제나(Gemini) 브릿지의 샌드박스 쓰기범위(CODEX_WORKDIR) 설정 위치와, 재시작 시 워치독이 중복 프로세스를 만드는 함정"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6279da50-7746-403f-8908-ff9f9f98e5b4
  modified: 2026-08-08T14:32:40.055Z
---

**설정 위치**: `D:\Develop\dex-jena-bridge\.env`(덱스)의 `CODEX_WORKDIR` 값이 코덱스 샌드박스 쓰기범위를 정한다. 원래 `D:\Develop\moa-studio` 단일 레포로 고정돼 있었는데, 2026-08-08 다른 레포(`nblog-saas`)에 업무를 배정하자 "patch rejected: writing outside of the project"로 막힘. `D:\Develop`(개발루트 전체)로 넓혀서 해결 — 여러 레포를 넘나드는 위임이 앞으로도 계속될 거라([[feedback_delegate_to_dex_jena_proactively]]) 프로젝트마다 값을 다시 좁힐 필요는 없다고 판단.
제나(Gemini)는 `.env.gemini`의 `CODEX_WORKDIR=D:\Develop\jena-workspace`로 별도 관리(2026-08-08 기준 미확장 — 리서치 위주라 급하지 않았음, 코드 작업 배정하게 되면 이것도 넓혀야 함).

**★함정 — 프로세스 kill 시 워치독이 중복 인스턴스를 만든다**: 작업 스케줄러에 `MoaDexBridge`(항상 Running)와 감시용 `MoaDexJenaGuard`가 등록돼 있어서, `.env` 수정 후 반영하려고 기존 node 프로세스를 그냥 죽이면 워치독이 자동으로 새 프로세스를 재기동시킨다. 이때 수동으로도 `nohup node ... &` 같은 걸로 직접 재시작하면 **같은 디스코드봇 토큰으로 두 프로세스가 동시에 뜬다**(중복응답 위험). 해결 순서: ① `.env` 수정 → ② 기존 프로세스 kill → ③ **몇 초 기다려서 워치독이 알아서 재기동하는지 확인** → ④ 그래도 안 뜨면 그때 수동 시작. 수동+워치독이 겹쳤을 땐 나중에 뜬 것/워치독이 관리하는 것(작업스케줄러 CommandLine과 일치하는 것)만 남기고 수동으로 띄운 걸 kill.

관련: [[project_dex_jena_multiagent_2026-08-06]] [[reference_dex_jena_shared_channels_2026-08-08]]
