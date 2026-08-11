---
name: reference_nblog_agent_test_pc_naming_2026-08-11
description: "nblog-saas PC에이전트 크래시 디버깅 중 형이 확정한 PC 호칭 — 서버/개발1/개발2 구분"
metadata:
  type: reference
  originSessionId: 59f7ac6b-8eb3-4afa-aa9d-e98d370d0373
  modified: 2026-08-11T05:42:59.410Z
---

2026-08-11 nblog-saas PC에이전트(설치형 네이버 발행 앱) 크래시 디버깅 중, 형이 테스트에 쓰는 여러 PC를 헷갈리지 않게 형이 직접 확정한 호칭:

- **서버(로컬PC)** — 클로(나)가 실제로 돌아가는 컴퓨터. `D:\Develop\Claude_Channels`, moa-studio/nblog-saas 소스가 있는 그 서버. nblog.nanumn.com도 이 서버가 아니라 별도 Lightsail이지만, "서버"라는 말은 이 문맥에서 클로가 도는 로컬PC를 가리킴(주의: 프로덕션 웹서버와 혼동 금지).
- **개발1 PC** — 형 집 PC. 맨 처음 nblog-agent 0.1.0 설치→크래시 재현했던 그 PC.
- **개발2 PC** — 형이 그다음 테스트로 옮겨간 다른 PC("2번 PC"). 개발1 PC에서 했던 크롬 디버그포트 워크어라운드(`--remote-debugging-port=9335 --no-sandbox`)를 여기서도 별도로 다시 실행해야 함 — PC마다 독립적인 환경이라 한쪽에서 한 조치가 다른 쪽에 안 넘어감. **사용자명 `smd`, 호스트명 `DESKTOP-6MU5665`는 이 개발2 PC 것**(2026-08-11 오후 형이 직접 정정 — 애초 기록이 개발1로 잘못 적혀있었음, icacls 결과·오후 발행테스트 전부 개발2 PC 기준).

**Why**: 크래시 원인이 PC별 환경(샌드박스 실패 여부)에 종속적이라, 어느 PC에서 무슨 조치를 했는지 헷갈리면 진단이 꼬인다. 형이 "2번 PC"라고만 말하면 나도 헷갈릴 수 있어서 이번에 이름을 확정함.

**How to apply**: 이후 대화에서 "개발1/개발2 PC"라고 하면 이 정의를 따를 것. nblog-agent 크래시가 다시 언급되면 이 세 PC 구분을 기준으로 어디서 무슨 검증이 끝났는지 추적할 것. 관련: [[project_open_threads_2026-08-11_dawn_snapshot]]
