---
name: project-unified-console-monitor-migration
description: "형이 개별 PowerShell 감시 프로그램들을 \"moa 통합 콘솔 모니터\"로 통합 중 — 감시 관련 작업스케줄러 임의 재활성화 금지"
metadata: 
  node_type: memory
  type: project
  originSessionId: 42552da9-8ca1-4b27-85ce-78ff73372b4c
  modified: 2026-08-29T22:09:23.609Z
---

형이 2026-08-30 오전 5:25~5:27경 작업스케줄러 태스크 5개(`MoaStatusBoard`·`MoaDiscordWatchdogExternal`·`MoaAtzReportWatchdogExternal`·`MoaMcpGuard`·`MoaWorkChannelWatchdogExternal`)를 로컬 "user" 계정으로 직접 비활성화했다. 클로가 이벤트로그로 확인 후 "알림이 맞다, 형이 끄신 건지?" 물었더니 형이 **"moa 통합 콘솔 모니터로 모니터링 프로그램 통합 중이야"**라고 확인(2026-08-30).

**Why:** 지금까지 감시가 [[reference_moa_logs_and_ledgers]]처럼 개별 PowerShell 스크립트(`moa_status_board.ps1`·`moa_discord_watchdog_external.ps1`·`moa_atz_report_watchdog_external.ps1`·`moa_mcp_guard.ps1`·`moa_workchannel_watchdog_external.ps1`)로 흩어져 있었고, 이를 하나의 "통합 콘솔"로 옮기는 마이그레이션이 진행 중. 이번에 꺼진 것은 사고가 아니라 마이그레이션 절차의 일부(구 감시 끄기)로 보인다.

**How to apply:**
- 통합 작업이 끝났다는 확인이 있기 전까지, 위 5개 작업스케줄러 태스크를 클로가 임의로 재활성화하지 말 것 (상태변경은 형 승인 후에만 — [[feedback_temporary_restricted_authority_2026-08-28]]과 같은 원칙 적용).
- `session_bootstrap.md`의 "세션 시작 시 재등록/확인" 체크리스트(②⑥⑦번 외부 워치독, ⑧ Monitor 감시)는 이 마이그레이션이 끝나면 새 통합 콘솔 기준으로 다시 써야 한다 — 지금은 구 스크립트 기준 그대로 둔 상태.
- 새 "moa 통합 콘솔 모니터"가 무엇을 대체하는지, 어디서 도는지 아직 클로가 파악 못함 — 형이 완료 알려주면 확인 후 문서(CLAUDE.md·session_bootstrap.md) 갱신 필요.

**2026-08-30 06:2x 점검(형 지시 "모아 시스템 점검해봐, 누락된 서비스 없는지") — 콘솔 코드 `D:\Develop\jena-workspace\console-monitor` 직접 조회 결과:**
- 정체: `moa-manager.mjs`(작업스케줄러 `MoaManager`, Ready, 로그온마다+주기 실행)가 구 스크립트들을 그대로 재사용해 자체 스케줄러로 돌린다. 설정파일 `data\jobs.json`, 작업별 로그 `data\logs\moa-*.log`.
- 이관 완료 확인된 13개(jobs.json에 enabled:true + 최근 로그 존재): MoaStatusBoard·MoaDiscordWatchdogExternal·MoaAtzReportWatchdogExternal·MoaMcpGuard·MoaWorkChannelWatchdogExternal·MoaCommandChannelWatchdogExternal·MoaIssueForumWatchdogExternal·MoaAckBot·MoaDexJenaGuard·MoaNblogCronTick·MoaAiServersUp·MoaDexBridge·MoaJenaBridge. 원 작업스케줄러 태스크는 disabled가 맞고, 콘솔이 대체 실행 중 — 정상.
- **⚠️ 이관 누락 발견: `MoaSharedRulesWatch`** — 작업스케줄러 Disabled인데 `jobs.json`에도, 마이그레이션 백업 매니페스트(`data\windows-backups\*\manifest.json`)에도 전혀 없음. 공통규칙(SHARED_RULES.md) 드리프트 감시(2026-08-21 덱스가 규칙 2개를 2주간 못 받은 채 일했던 사고로 신설된 안전장치, `moa_shared_rules_watch.ps1` 주석에 근거 기록)가 지금 완전히 꺼진 상태.
- 형 판단(2026-08-30): **"현재 이관 초기라, 진행과정 봐서 결정하자"** — 지금 당장 조치하지 말고 이관 진행상황을 계속 지켜볼 것. 다음 시스템 점검 때 MoaSharedRulesWatch가 jobs.json에 들어왔는지 재확인.
- moa-studio(3000)·saju-studio(3001)·clo_studio(8080) 포트는 이 점검 시점에 안 열려 있었음 — 상시 서비스여야 하는지 미확인(형 답변 없음), 다음 점검 때 다시 물어볼 것.
- **웹 콘솔 자체도 확인함**: `http://127.0.0.1:3888` (server.mjs, `/api/manager/jobs`·`/api/manager/windows-tasks`) 살아있고 정상 응답.
- **MoaSharedRulesWatch가 빠진 진짜 이유(코드로 확인)**: `windows-scheduler.mjs`의 "가져오기 추천" 로직이 정규식 `/(Watchdog|Guard|Monitor|Status|Bridge|AckBot)/i`로 태스크명만 보고 추천 여부(`recommended`)를 정한다. `MoaSharedRulesWatch`는 이름이 "Watch"지 "Watchdog"이 아니라서 이 정규식에 안 걸려 `recommended:false`로 뜬다 — 역할이 달라서가 아니라 **이름 패턴 미스로 추천 목록에서 누락**된 것. (참고: MoaAiServersUp·MoaNblogCronTick도 원래 recommended:false였는데 형이 수동으로 이미 이관했음 — recommended는 하드 게이트가 아니라 힌트일 뿐.)
- 나머지 비-모니터링 스케줄 작업(MoaAtzPublish·MoaAtzShorts·MoaSessionReset·MoaSessionRestartDay·MoaKsajuDailyMetrics·MoaSearchConsole·MoaIgTokenRefresh·MoaHealthCheck)은 그대로 작업스케줄러에 Ready 상태로 남아있음 — 설계대로, 이관 대상 아님.
- **웹 화면 실제로 열어서 육안 확인함(형이 재차 물어서 재확인, 2026-08-30 06:56 KST)**: `http://127.0.0.1:3888` 은 jobs.json 기반 관리용 API와는 별개로 훨씬 넓은 실물 대시보드 — "MOA 통합 콘솔 모니터"(에이전트 터미널·백그라운드 서버·MCP 연진 통합 관제). 전체 15개 카드: 클로 세션/MOA-dex(Codex)/MOA-jena(Gemini)/덱스 작업대(ksaju-carousel-v2, :3001)/ComfyUI(:8188)/nblog-saas(:3002)/suno-helper(:3030)/PostgreSQL(:5433)/덱스다리·제나다리(Bridge Worker)/디스코드 플러그인 서버/Chrome DevTools MCP ×2/Bun Dev Server/**장애 감지 대조군(-9999)**(존재 안 하는 포트를 일부러 찔러 ECONNREFUSED가 뜨는지로 장애감지 로직 자체를 자체검증하는 카나리아 카드).
- 상태 요약: 정상 14 / **대기 1** / 장애 0. 대기 1건 = 덱스 작업대(ksaju-carousel-v2) 개발서버 :3001 미실행(ECONNREFUSED) — 이전에 포트점검에서 찾았던 그 포트. "장애"가 아니라 "대기"로 분류된 걸로 봐서 상시 필수 서비스가 아니라 필요시에만 띄우는 개발서버로 설계된 것으로 보임(saju-studio 3001은 상시 아닐 가능성 높음 — 다음에 확인 필요했던 질문에 대한 방증).
- **형 코멘트(2026-08-30 06:56)**: "이후에 모니터링이 필요한 경우 여기에 프로세스를 등록해서 관리하면 될 거야" — 앞으로 신규 모니터링 대상은 이 콘솔에 등록하는 방식으로 간다.
- **★★2026-08-30 07:xx — MoaSharedRulesWatch는 disabled와 별개로 스크립트 자체가 고장나 있음(실행해서 확인)**: `moa_shared_rules_sync.ps1 -Check`를 직접 실행하니 "SSOT에서 SECTION-A 시작을 못 찾았다"로 exit 1 에러. 스크립트는 SHARED_RULES.md 안에서 `## SECTION-A:` / `## SECTION-B:` 마커를 찾아 CLAUDE.md·덱스/제나 AGENTS.md에 블록을 박아넣는 방식인데, 현재 SHARED_RULES.md는 LEVEL1/LEVEL2 구조로 재작성되며 그 마커가 사라짐(`# SECTION-B — 덱스·제나 브리지 전용`만 있고 `##`도 아니고 콜론도 없음, SECTION-A는 아예 없음). **즉 이 감시를 지금 그대로 다시 켜도 매일 "어긋남 없음"이 아니라 조용히 에러만 낸다** — 콘솔 이관 여부와 무관한 별도 결함. 형께 보고하고 수정 여부 승인 요청함(2026-08-30). **형 판단: "재시작 이후에 고치자"** — 지금 손대지 말고 형이 예고한 재부팅 테스트 끝난 뒤에 수정할 것.
