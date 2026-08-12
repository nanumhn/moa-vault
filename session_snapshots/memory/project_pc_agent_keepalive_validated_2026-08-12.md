---
name: project_pc_agent_keepalive_validated_2026-08-12
description: PC에이전트 keep-alive(0.1.7)가 개발2(PC2)에서 7~8시간 네이버 로그인 유지 확인 — 0.1.7 공식승격 판단에 긍정 신호
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-11T23:00:01.573Z
---

2026-08-12 07:59 KST경 형이 확인: 개발2(PC2)에서 네이버 로그인이 7~8시간 지나도 해제(로그아웃)되지 않음.

**Why:** 2026-08-11에 PC에이전트 0.1.7 테스트버전으로 keep-alive(10분±지터 백그라운드 세션 확인) 기능을 배포했고, 클로가 설계에서 "화면잠금 시엔 스킵 안 함"으로 임의 변경한 부분이 있었다([[project_open_threads_2026-08-12_dawn_snapshot]] 참고). 이전엔 밤새 로그아웃되는 문제가 있었음.

**How to apply:** [[project_open_threads_2026-08-12_dawn_snapshot]]에 열려있던 "형이 확인해야 할 것" 4번(0.1.6→0.1.7 공식포인터 승격 여부)·5번(화면잠금 스킵 안함 승인 여부) 판단에 이 관찰이 긍정적 근거로 쓰인다. 다만 하루 정도 더 지켜본 뒤 형이 최종 승격 결정할 예정이었으므로, 아직 형이 명시적으로 "승격해" 라고 말하기 전까지는 0.1.4가 공식 포인터로 유지 중인 상태로 취급할 것.
