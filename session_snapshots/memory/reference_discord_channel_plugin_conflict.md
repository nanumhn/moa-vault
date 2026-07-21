---
name: discord-channel-plugin-conflict
description: 디스코드 대화 두절의 원인 1순위 — fakechat 플러그인이 동시 활성화되면 --channels 플래그를 무시하고 채널을 가로챈다
metadata: 
  node_type: memory
  type: reference
  originSessionId: b6e4bfea-85f9-4057-a7a4-3db2405dfb0a
  modified: 2026-07-21T02:23:04.544Z
---

디스코드 대화가 안 되면(시작 알림은 오는데 대화만 두절) **fakechat 플러그인이 같이 켜져 있는지부터 확인**한다.

`settings.json`의 `enabledPlugins`에 `fakechat@claude-plugins-official`과 `discord@claude-plugins-official`이 **둘 다 true면**, 실행인자에 `--channels plugin:discord@claude-plugins-official`이 있어도 **fakechat이 채널을 차지하고 discord MCP 서버는 아예 안 뜬다**. 채널 플러그인은 한 번에 하나만 활성화된다.

**조치 (2026-07-21 적용):**
```
claude plugin disable fakechat@claude-plugins-official
```
→ 세션 재시작 후 discord MCP 정상 연결 확인. 되돌리려면 `plugin enable`.

**진단 함정 3가지 (2026-07-21 실제로 다 밟음):**
1. **시작 알림은 MCP와 무관하다.** `notify-startup.sh` 훅이 curl webhook으로 직접 쏘기 때문에 MCP 채널이 죽어도 "🚀 시동 ON" 메시지는 정상 도착한다. 알림 왔다고 디스코드 살아있다고 판단하면 안 된다.
2. **`--channels`는 `--help`에 안 나오는 숨은 플래그다.** 2.1.215(정상 동작)·2.1.216 둘 다 help에 "channel" 0회. help에 없다고 "플래그가 제거됐다"고 단정해서 버전 롤백까지 갈 뻔했다. [[feedback_verify_before_alarm]]
3. **프로세스 검증 스크립트 버그.** `Get-CimInstance ... | Where-Object {...}`가 claude.exe 여러 개를 잡아 배열이 되면 `$_.ParentProcessId -eq $c.ProcessId` 비교가 조용히 실패해 "서버 안 뜸"으로 오판한다. 자식 프로세스 확인은 PID를 단일값으로 고정하고 할 것.

**확실한 검증법:** `--debug-file <경로>`로 띄우고 로그에서
`MCP server "plugin:discord:discord": Successfully connected` + `Channel notifications registered`
두 줄을 확인한다. 연결에 ~11초 걸린다(타임아웃 30초) — `start` 스크립트가 매번 `bun install`을 돌리기 때문. 네트워크가 느리면 타임아웃으로 실패할 여지가 있다.

관련: [[reference_bootstrap_channels_arg_order]], [[feedback_discord_reply_tool]]
