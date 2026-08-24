---
name: reference_gsc_service_account_separate_from_blogger_oauth
description: 검색지표는 별도 서비스계정으로 이미 열려 있다 — blogger OAuth에 스코프 추가하면 아투 발행이 멈춘다(하지 말 것)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5fba1c85-e880-4953-a8f0-3246cdd5fb47
  modified: 2026-08-23T23:52:47.678Z
---

검색 콘솔 지표는 `C:\Users\user\.moa\gsc_service_account.json`(이미 `webmasters.readonly`)로 **지금도 조회된다**. 조회 도구도 이미 있다 — 일일 잡 `MoaSearchConsole`(09:05), 총계 리포트 `search_console_report.mjs`, **쿼리·페이지 단 리포트 `gsc_query_report.mjs [days]`**(k-saju + blog.k-saju.me 대상, 읽기 전용, 개인키는 프로세스 내부에서만 참조).

★ **`moa-studio/tools/blogger-publish/config.mjs`의 SCOPES에 `adsense.readonly` 등을 추가하지 말 것.** 재인증하면 현재 refresh_token이 무효화돼 **아투 하루 2회 자동 발행이 `invalid_grant`로 멈춘다.** 두 크리덴셜은 무관하다 — blogger OAuth는 **발행용**, 검색지표는 **별도 서비스계정**.

**왜 남기나:** `moa-vault/10_Wiki/Finance/weekly/2026-W34_metrics.md`가 이 재인증을 **"권장 — 형 1클릭"** 액션 #1로 올려놨다. 그 문서만 보고 2026-08-24에 growth가 "아투는 계측할 눈이 없다"고 판단해 이 위험한 액션을 이번 주 1순위로 다시 올렸고, cto가 실측으로 뒤집었다. 문서가 stale해도 그 자리에 계속 남아 있으므로 **또 집힌다.** SCOPES 한 줄만 보고 "권한이 없다"고 단정하기 전에 `.moa`에 이미 도는 경로가 있는지부터 볼 것.

관련: [[feedback_find_counterexample_first]] · [[feedback_dont_fill_data_gaps_with_inference]] · [[reference_moa_logs_and_ledgers]]
