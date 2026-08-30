---
name: reference_codex_config_toml_global_scope_2026-08-30
description: "C:\\Users\\user\\.codex\\config.toml은 계정 전체 공용 파일 — approval_policy 등은 프로젝트/세션 단위로 못 좁힘, 외부시스템 접근엔 효과 없음"
metadata:
  type: reference
  originSessionId: 7234edbe-5f3b-4050-8a20-bf11e27ddba4
  modified: 2026-08-30T14:31:54.685Z
---

`C:\Users\user\.codex\config.toml`은 덱스 전용이 아니라 이 계정에서 도는 Codex CLI 전체(덱스·제나 등 모든 Codex 기반 에이전트)에 적용되는 공용 설정 파일이다. `approval_policy` / `approvals_reviewer` / `sandbox_mode`를 여기 넣으면 전체 적용되며, 프로젝트 단위나 세션 단위로 좁히는 옵션은 없다(OpenAI 공식 문서 확인, https://learn.chatgpt.com/docs/agent-approvals-security).

★더 중요한 함정: `approval_policy="on-request"` + `approvals_reviewer="auto_review"` + `sandbox_mode="workspace-write"`를 켜도 **워크스페이스 밖으로 나가는 작업(SSH·scp로 외부 라이브 서버 접속, 외부 API 호출 등)은 여전히 승인이 남거나 거절된다.** 이 설정은 "덜 위험한 로컬 작업"만 자동화해주지, "외부 시스템 접근" 승인 스팸을 없애주지 않는다. 그걸 없애려면 샌드박스 자체를 해제하는 `--yolo`/`danger-full-access`가 필요한데, 이건 파일 삭제·외부 전송까지 무검토로 나가는 위험한 옵션이라 권장 안 됨.

**How to apply:** 형이 "승인권한을 올려줘/자동화해줘"라고 하면, 실행하기 전에 반드시 (1) 그 설정이 이 에이전트 하나만 적용되는지 계정 전체에 적용되는지, (2) 지금 막힌 그 구체적 작업(특히 외부 시스템 접근)이 그 설정으로 실제로 해소되는지 먼저 확인하고 말할 것. [[project_unified_console_monitor_migration_2026-08-30]]
