---
name: project_dex_cli_died_shortly_after_boot_2026-08-30
description: "2026-08-30 05:43 재부팅복구 직후 덱스 CLI(codex.exe pid=2672)가 ALIVE 확인 몇 분 뒤 프로세스 자체가 사라짐 — 제나는 정상, 원인 미확인, 형 승인 대기 중(재시작 여부)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7b8fad58-db21-4229-8caa-1949ca00c4de
  modified: 2026-08-29T20:56:41.416Z
---

2026-08-30 04:00 정기 재부팅 후 05:43:18에 두 번째 CLI 창 복구가 돌았다(원인 미확인 — 이례적으로 한 세션에서 04:30·05:43 두 번 복구 로그가 남음, [확인: cli_windows_boot.log 직접조회]). 그때 덱스 codex.exe pid=2672가 시작돼 05:43:55에 ALIVE로 기록됐는데, 같은 세션에서 형이 "덱스 상태 체크해줘"라고 물어 재조회한 05:50경엔 그 프로세스가 완전히 사라져 있었다(WindowsTerminal pid=10844 하위에 codex.exe 자식이 아예 없음, 제나 agy.exe만 남음). Windows Application 이벤트로그에 codex 크래시 기록 없음 — 강제종료인지 정상종료인지 미확인.

브리지 데몬(dex-jena-bridge, pid 15296)은 정상 동작 중. "그들만의업무" 채널(1534714627383099493)엔 2026-08-29 20:05 이후 새 글 없음(덱스가 죽기 직전 마지막 활동은 그 이전).

**Why**: 원인 불명 — 다음 세션이 조사할 단서: ①왜 같은 세션에 04:30·05:43 두 번 CLI창 복구가 돌았는지(이중 재부팅? 스케줄 중복?) ②codex.exe가 정상종료(예: 내부 에러로 스스로 exit)인지 외부에서 kill됐는지.

**How to apply**: [[feedback_temporary_restricted_authority_2026-08-28]]에 따라 클로가 임의로 재시작하지 않고 형께 재시작 여부 결재 요청함(디스코드 메시지 id 1543363492545953956).

**해결(2026-08-30 05:56)**: 형이 "덱스만 다시 띄워" 승인. `moa_cli_window.ps1 -Who dex`로 재기동 → pid=26432 정상 ALIVE, 화면 캡처(moa_console.ps1)로 기존 대화(sessions.json 기준) 정상 이어받고 "Ask Codex to do anything" 프롬프트까지 뜬 것 직접 확인. 원인(정상종료 vs 강제종료)은 끝까지 미확인 — 재발하면 다음 조사 단서는 위 "Why" 항목 참고.
