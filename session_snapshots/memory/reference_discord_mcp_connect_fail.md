---
name: reference_discord_mcp_connect_fail
description: Discord MCP가 설정·인자 정상인데도 연결 실패하는 원인 — 플러그인 login 실패 시 process.exit(1). 진단 순서와 웹훅 대체 경로
metadata: 
  node_type: memory
  type: reference
  originSessionId: aaf63b6c-ab30-44e5-87e5-81502c625e07
  modified: 2026-08-16T18:16:10.556Z
---

Discord 회신 도구(`mcp__plugin_discord_discord__*`)가 세션에 안 붙는 모드가 있다. **재부팅 직후 세션에서 반복 발생.**

## 근본 원인 (2026-07-22 확정)

`C:\Users\user\.claude\plugins\cache\claude-plugins-official\discord\<ver>\server.ts` 맨 끝:

```ts
client.login(TOKEN).catch(err => { ...; process.exit(1) })
```

디스코드 게이트웨이 로그인이 **한 번** 실패하면 재시도 없이 프로세스를 죽인다. `mcp.connect()`는 그보다 앞(≈775줄)에서 이미 끝나 있으므로, **붙어 있던 MCP 도구가 통째로 사라진다.** 재부팅 직후엔 네트워크·DNS가 덜 올라와 첫 로그인이 실패 → 그래서 재부팅 직후에만 재현되고, 몇 분 뒤 수동 기동하면 멀쩡하다.

기동 작업의 45초 고정 지연으로는 네트워크가 느린 날 못 막는다. 근본 예방은 "네트워크 준비 확인 후 claude 기동".

**반증된 가설 — 다시 파지 말 것:** `start` 스크립트의 `bun install`은 원인이 아니다. 실측 41ms, `--offline`(네트워크 없음 시뮬)에서도 44ms exit 0으로 통과한다.

## 진단 순서

1. `ToolSearch("select:mcp__plugin_discord_discord__reply")` 2~3회 재시도 — 늦게 붙기도 한다.
2. `~/.claude/settings.json` → `enabledPlugins`에 `fakechat@...`가 false인지 ([[reference_discord_channel_plugin_conflict]]).
3. `Get-CimInstance Win32_Process -Filter "Name='claude.exe'"` → `--channels plugin:discord@claude-plugins-official` 있는지, 초기 프롬프트가 `--channels` **앞**인지 ([[reference_bootstrap_channels_arg_order]]).
4. `C:\Users\user\.claude\channels\discord\hook.log` 꼬리 — HTTP 200이면 웹훅은 살아있고 MCP만 죽은 것.

1~4가 전부 정상이면 위 근본 원인 모드다. **확실한 복구는 세션 재시작** (네트워크가 올라온 뒤라면 바로 붙는다).

## 봇 살아있는지 직접 확인하는 법

stdin을 열어둔 채 띄워야 한다 — 안 그러면 EOF로 즉시 `shutting down` 되어 오진한다:

```bash
cd /c/Users/user/.claude/plugins/cache/claude-plugins-official/discord/0.0.4
(sleep 25 | timeout 30 bun server.ts) 2>&1 | head
```
`gateway connected as 달려라 클로#7541`이 나오면 토큰·네트워크·의존성 전부 정상.

## 대체 발신 경로 (MCP 죽어도 동작)

`C:\Users\user\.moa\healthcheck.config.json`의 `discordWebhook`으로 POST. 단방향(발신만) — 형 메시지 수신은 불가하므로 임시 보고용이지 정상 운영 대체가 아니다.

```powershell
$cfg = Get-Content 'C:\Users\user\.moa\healthcheck.config.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$body = @{ content = $msg } | ConvertTo-Json -Compress
Invoke-WebRequest -Uri $cfg.discordWebhook -Method Post -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -UseBasicParsing
```
UTF8 바이트 변환 없으면 한글이 깨지고 400이 난다.

**MCP 미연결 시 `session_boot.flag`는 지우지 말 것** — `fetch_messages` 유실 회수를 못 했으므로 다음 정상 세션이 재시도하게 남겨둔다.

## 재발 기록
- 2026-07-22 04:03 (f8626cc9) 최초 관측 / 05:45 (d5a6c9f7) / 05:47 (aaf63b6c) — 전부 재부팅 직후. 3번째에서 근본 원인 확정.
- **2026-08-17 00:24 — 자동 복구 체인 자체가 끊겨 2시간18분 세션 완전사망.** 이 근본원인(MCP 죽음)까지는 기존 자동화(`MoaMcpGuard` 10분 감시 + `moa_session_respawn.ps1`)가 정상 작동해 00:30·00:40 두 번 재시동을 시도했는데, **2번째 시도가 기존 claude.exe를 죽인 직후 prewarm(`bun install`)에서 타임아웃 없이 멈춰버림** → 그 뒤론 `MoaMcpGuard`가 "claude.exe 자체가 없으면 로그온작업 담당, 내 일 아님"이라는 설계로 조용히 손 뗌 → 로그온작업은 실제 재부팅 때 1회만 도는 트리거라 이후 재크래시는 아무도 감시 안 함. 형이 03:00에 직접 수동 재시작. 수정(같은 날 적용): ①`moa_common.ps1`에 `Invoke-MoaExternalWithTimeout` 신설, prewarm의 두 bun 호출 각각 30s/60s 하드 타임아웃 ②`moa_mcp_guard.ps1`에 nosession 전용 감지경로 신설(재부팅 후 8분 유예 → deaf 경로와 동일한 디바운스+쿨다운+에스컬레이션으로 자동 재시동). 상세 postmortem은 `harness-pending.md`(2026-08-17 항목).
