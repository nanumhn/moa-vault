---
name: project_open_threads_2026-08-07_snapshot
description: 2026-08-07 04시경 재부팅 직전 저장 스냅샷 — 이 시점 열린 작업 목록
metadata: 
  node_type: memory
  type: project
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-06T19:25:32.126Z
---

2026-08-07 새벽, `MoaSessionReset`(04:00 재부팅) 직전 저장 시점 스냅샷. 전날(08-06) 세션 내용은 [[project_obsidian_brain_overhaul_2026-08-06]] [[project_dex_git_lock_root_cause_2026-08-06]] [[project_atz_reversed_quote_incident_2026-08-06]] [[project_dex_jena_daemon_silent_death_2026-08-06]] 참고.

## 열린 작업 (다음 세션이 확인할 것)

- **아투 뉴스 순위 알고리즘의 "한국관련성" 가중치 — 형 결정 대기, 미착수.** 해외매체(NPR·가디언·CNBC 등) 소스는 후보 풀에 정상적으로 들어오는 것 확인됐지만, 한국 관련 태그가 붙은 기사가 점수를 더 받아서 매번 한국매체(한겨레 등) 소스가 우선 선택됨. 순수 미국뉴스 지향으로 가려면 가중치 조정 필요 — 형이 방향 정하면 착수.
- **덱스·제나 브리지 데몬이 낮 회의 이후 조용히 죽어있던 원인 미확정.** 08-06 저녁에 발견해서 수동 재기동만 함. 재발하면 원인 조사 필요([[project_dex_jena_daemon_silent_death_2026-08-06]] 참고). 감시 체계 없음(사각지대).
- **덱스 커밋 대행 마커(`[[커밋: 메시지]]`) — 코드 경로는 검증됐지만 실제 디스코드 봇 상호작용으로는 아직 미검증.** cto-seojin이 같은 코드 경로를 직접 실행해서 검증했지, 실제로 덱스 봇이 살아있는 상태에서 그 마커를 써서 커밋한 적은 없음. 다음에 덱스한테 실제 코드 작업 시킬 때 이 마커가 실전에서도 되는지 확인할 것.
- **아투 QA게이트 버그 수리(3중 방어) — 배포는 됐지만 다음 실제 발행 사이클에서 정상 동작하는지 관찰 필요.** 회귀테스트는 통과했지만 라이브 파이프라인에서 새 로직이 실제 신규 기사를 어떻게 판정하는지는 다음 발행(내일 아침 slot)에서 지켜볼 것.

## 이번 세션 완료된 것 (참고용, 재작업 불필요)
- 옵시디언 팀 지식베이스 개편(MOC 6개+dataview 대시보드) — 형이 직접 열어서 확인 완료
- 아투 트럼프 기사 오보 저지+재작성+발행 완료 (https://www.american-todayz.com/2026/08/blog-post_06.html)
- git lock 근본원인 해결(브리지 대행 커밋 구현)
- 제나 mp3 버그 수정 완료

관련: [[project_obsidian_brain_overhaul_2026-08-06]] [[project_dex_git_lock_root_cause_2026-08-06]] [[project_atz_reversed_quote_incident_2026-08-06]]
