---
name: reference_plugin_cache_vs_marketplace
description: 플러그인 MCP는 marketplaces/가 아니라 plugins/cache/<name>/<ver>/에서 실행된다 — 진단 시 폴더 오인 주의
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-21T21:46:47.728Z
---

Claude Code 플러그인은 **두 벌**로 존재하고, 실제 MCP 서버가 도는 건 cache 쪽이다.

```
plugins/marketplaces/claude-plugins-official/external_plugins/discord/
    → 배포 원본. 부팅/업데이트 때 통째로 덮어써짐(.gcs-sha 버전마커, git 아님)
plugins/cache/claude-plugins-official/discord/0.0.4/
    → ★ 실제 실행 경로. .mcp.json의 --cwd 가 여기를 가리킴
```

확인법 — 추측하지 말고 프로세스 명령줄을 봐라:
`Get-CimInstance Win32_Process -Filter "Name='bun.exe'" | select CommandLine`
→ `bun run --cwd .../plugins/cache/.../discord/0.0.4 ... start`

**2026-07-22 내가 여기서 오진했다.** marketplace 폴더가 05:46에 재clone되어 node_modules가 사라진 걸 보고
"이게 MCP 죽은 원인"이라고 형에게 보고했으나 **틀림** — cache 폴더는 5월 8일 이후 한 번도 안 지워졌다.
엉뚱한 폴더의 타임스탬프를 근거로 단정한 실수. [[feedback_verified_facts_only]] 위반 사례.

**Why:** 두 경로가 파일 구성이 똑같아서 육안으로 구분이 안 된다. 타임스탬프만 보면 완전히 다른 결론이 나온다.

**How to apply:** 디스코드 MCP 문제를 진단할 때 폴더를 보기 전에 **실행 중 프로세스의 --cwd부터** 확인.
marketplace 폴더 상태는 MCP 생사와 무관할 수 있다. 관련: [[reference_discord_mcp_connect_fail]], [[reference_plugin_install_method]]
