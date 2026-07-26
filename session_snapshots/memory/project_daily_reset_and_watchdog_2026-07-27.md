---
name: project_daily_reset_and_watchdog_2026-07-27
description: 매일 04:00 서버 재부팅 리셋 + 워치독 시간대 분리(07~03 5분 / 03~07 30분). 리셋 스크립트가 부트스트랩을 안 넘기던 구멍 수정
metadata: 
  node_type: memory
  type: project
  originSessionId: e50243dc-a27b-49de-a21d-d6634158bf7c
  modified: 2026-07-26T15:55:57.735Z
---

2026-07-27 형 지시로 한도 절감 구조를 확정했다. 배경 수치는 [[reference_session_cost_structure]].

## 확정된 설정

```
04:00 매일  MoaSessionReset (작업스케줄러)  → 세션저장 후 "서버 재부팅"
03:52 매일  리셋 전 라이브 저장 cron
07~03시     수신 워치독 5분  (2,7,12,…,57분 / cron hours 7-23,0-2)
03~07시     수신 워치독 30분 (13,43분 / cron hours 3-6)
```

기존 주2회(수·일) → 매일로 바꾼 이유: 세션이 3~4일 자라면 컨텍스트가 100만 토큰에 근접해
워치독 1회 비용이 15배가 된다. 매일 리셋하면 15~20만 수준으로 유지된다.

## ★ 리셋 = claude 재시작이 아니라 "서버 재부팅"인 이유

`moa_session_reset.ps1`은 원래 claude를 죽이고 `wt.exe`를 **직접** 띄웠는데,
그 경로엔 이게 전부 빠져 있었다 (= 세션은 뜨지만 귀가 닫힘):

- 부트스트랩 프롬프트 미전달 → 새 세션이 cron 재등록을 못 함
- 네트워크 준비 대기 없음 → discord 로그인 1회 실패 시 플러그인 즉사 ([[reference_discord_mcp_connect_fail]])
- 플러그인 프리웜 / MCP 타임아웃 상향 없음 → 30초 타임아웃 사망 ([[project_reboot_recovery_overhaul_2026-07-26]])

재부팅하면 로그온 기동작업 → `moa_launch_when_online.ps1`이 위 4개를 다 처리하는
**검증된 경로**를 탄다. 그래서 재부팅이 자체 재시작보다 안전하다.

`-Reboot` 스위치 추가로 구현. 폴백(비-Reboot) 경로도 `wt.exe` 직접 실행을 버리고
같은 런처에 위임하도록 고쳤다.

## 적용 시 함정

- `moa_session_reset.ps1`은 **UTF-8 BOM 필수**(PS5.1). Edit 도구로 고친 뒤 BOM 확인할 것.
- `-DryRun`은 재부팅만 건너뛰고 vault push와 **디스코드 알림은 실제로 발송**한다.
  리허설 후 형에게 "그거 리허설"이라고 알려야 오해가 없다.
- 작업 수정은 `Set-ScheduledTask -Action -Trigger` + `Enable-ScheduledTask`로 관리자권한 없이 됐다.
