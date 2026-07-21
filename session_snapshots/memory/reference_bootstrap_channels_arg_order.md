---
name: reference_bootstrap_channels_arg_order
description: "재부팅 자동복귀 로그온 작업이 \"--channels entries must be tagged\"로 즉사하면 초기 프롬프트가 --channels 뒤에 있는 것 — 프롬프트를 앞으로 옮겨라"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3d968625-55d8-4314-a427-0d0a6d8b20ba
  modified: 2026-07-19T03:50:37.894Z
---

**증상:** 재부팅 후 자동으로 뜬 claude 창이 코드1(0x00000001)로 즉사. 빨간 에러 `--channels entries must be tagged` + 그 아래 우리 부트스트랩 프롬프트 텍스트("세션 자동시작: session_bootstrap.md ...")가 채널 목록처럼 표시됨.

**원인:** `claude` CLI의 `--channels`는 variadic(뒤따르는 토큰을 계속 채널 태그로 삼킴). 로그온 작업 명령이 `claude --channels plugin:discord@... "프롬프트"` 순서면, `--channels`가 프롬프트 문자열까지 채널 값으로 먹고 → 프롬프트는 `plugin:`/`server:` 태그가 아니니 reject → exit 1.

**해법:** 초기 프롬프트를 **`--channels` 앞**에 둔다.
```
[X]  claude --channels plugin:discord@... "프롬프트"
[O]  claude "프롬프트" --channels plugin:discord@...
```
- 소스: `C:\Users\user\.moa\apply_bootstrap.ps1` line ~18 (재발방지 주석 있음)
- 대상 작업: 로그온 작업 `클로드 코드 디스코드 연결`
- **적용은 관리자권한 필요** → `Start-Process powershell -Verb RunAs -ArgumentList '-File','C:\Users\user\.moa\apply_bootstrap.ps1'`로 UAC 띄우고 형이 승인. 검증: `(Get-ScheduledTask -TaskName '클로드 코드 디스코드 연결').Actions[0].Arguments`

주의: `moa_session_reset.ps1`의 재시작 명령은 프롬프트 없이 `claude --channels ...`라 안 깨짐(참고: 프롬프트 붙일 거면 동일하게 앞에). 2026-07-19 수정. 관련: [[project_reboot_recovery_live_test.md]]
