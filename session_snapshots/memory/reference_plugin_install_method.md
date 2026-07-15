---
name: reference_plugin_install_method
description: "GitHub 레포를 Claude Code 플러그인으로 전역 설치하는 절차 + 흔한 함정(EBUSY, 한번에 한줄)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: bfd221f4-ae3b-44c3-a154-9a26c19b4ae7
---

GitHub 레포를 전역 플러그인으로 설치할 때.

## 판별: 플러그인 vs 아님
레포에 `.claude-plugin/`(plugin.json + 선택적 marketplace.json)이 있으면 Claude Code 플러그인 → `/plugin`으로 설치. 없으면(예: npm 라이브러리 remotion) 전역 스킬 등록 대상 아님 → 프로젝트 내 설치로 처리.

## 설치 명령 (형이 직접 침 — Claude는 /plugin 도구로 못 돌림)
- 공식 마켓플레이스(claude-plugins-official)에 있는 건: `/plugin install <plugin>@claude-plugins-official`
- 외부 레포: `/plugin marketplace add <owner>/<repo>` → `/plugin install <pluginName>@<marketplaceName>`
  - pluginName = plugin.json의 name, marketplaceName = marketplace.json의 name (repo명과 다를 수 있음. 예: coreyhaines31/marketingskills → marketplace명 marketingskills, plugin명 marketing-skills)

## 함정 (실제 겪음)
1. **한 메시지에 여러 /plugin 줄 붙여넣기 X.** /plugin은 인터랙티브라 첫 줄 일부만 처리되고 나머지 무시됨. 반드시 한 메시지에 한 명령씩.
2. **EBUSY: resource busy or locked (rename temp_git_...)** — `C:\Users\user\.claude\plugins\cache\` 또는 `\marketplaces\`에 잠긴 임시폴더(temp_git_*) 잔존 시 발생. Claude가 `rm -rf .../cache/temp_git_*` 정리 후 재시도하면 풀림. 백신(Defender) 스캔 중이면 몇 초 뒤 재시도.
3. 설치 성공 시 stdout "Run /reload-plugins to apply" 뜨지만, 보통 그 세션에 스킬 바로 뜸. 다음 세션에서 안 뜨면 그때 재시작.

## 검증
Claude가 `C:\Users\user\.claude\plugins\installed_plugins.json` 읽어서 등록 확인. 스킬 목록(system-reminder)에 `<plugin>:<skill>` 떴는지 교차확인.

[[feedback_plugin_reload]] [[project_session_2026-06-25_tooling]]
