---
name: project_dex_bridge_duplicate_recheck_after_reboot_2026-09-07
description: 재부팅 직후 덱스 브리지가 또 2개 뜨는지 반드시 재확인할 것 — 형 지시 2026-09-07 19:48
metadata: 
  node_type: memory
  type: project
  originSessionId: 89c95e96-ac0c-4966-80b1-36223cf0c86e
  modified: 2026-09-07T10:48:46.580Z
---

**형 지시 (2026-09-07 19:48, 005-07 스레드에서 제나에게):** *"나중에 서버 재시작 후에 다시 한번 체크해 보자. 2개까 뜨는지."*

**★다음 재부팅(04:00 `MoaSessionReset -Reboot`) 직후 부트스트랩에서 반드시 이 검사를 할 것.** 세션 cron·Monitor 재등록과 같은 급으로 취급한다.

## 무슨 일이 있었나 (2026-09-07)

형 메시지가 덱스에게 **2번 전달되고 덱스가 2번 답하는** 증상. 원인 = **덱스 브리지 중복 기동**.

- 8/31 형 지시로 브리지 관리가 MOA 관리자 콘솔(:3888)로 일원화되면서 윈도우 예약작업은 Disabled 되어야 했다. 제나(`MoaJenaBridge`)는 Disabled였는데 **`MoaDexBridge`만 Running으로 남아 있었다.**
- 그래서 재부팅 때 **예약작업이 1개 + 콘솔이 1개** 를 각각 띄웠고, 같은 덱스 봇 토큰으로 두 데몬이 게이트웨이에 동시 접속했다.
- 19:31:53 예약작업 Disable → **그것만으로는 안 끝났다. 이미 떠 있던 프로세스(pid 13892)는 안 죽는다.** 그걸 별도로 죽여서야 해소됐다.

## 검사 방법 (실측으로 확정한 것)

★**브리지 한 벌은 프로세스 2단으로 뜬다** — PowerShell 껍데기 → 그 자식 node.

```
1260  통합 콘솔
 └ PowerShell  dex_jena_bridge_daemon.ps1 -Engine dex
    └ node  --env-file=D:\Develop\dex-jena-bridge\.env         (덱스)
 └ PowerShell  dex_jena_bridge_daemon.ps1 -Engine jena
    └ node  --env-file=D:\Develop\dex-jena-bridge\.env.gemini  (제나)
```

합격 기준: **예약작업 `Disabled` + `-Engine dex` 프로세스 정확히 1개 + 그 자식 node 1개.**

```powershell
(Get-ScheduledTask -TaskName 'MoaDexBridge').State
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" |
  Where-Object { $_.CommandLine -like '*dex_jena_bridge_daemon.ps1*' -and $_.CommandLine -match '-Engine\s+dex' } |
  Select-Object ProcessId, CreationDate
```

## 함정 3개 (전부 이날 실제로 걸린 것)

1. **파일명은 밑줄, job id는 하이픈.** 프로세스 명령줄에는 `dex_jena_bridge_daemon.ps1`(밑줄)이 들어간다. `*dex-jena-bridge*`(하이픈)로 찾으면 **0건이 나오는데 그건 "없다"가 아니다** — 하이픈 이름은 관리자 API의 job id(`moa-dex-bridge`)와 레포 폴더(`D:\Develop\dex-jena-bridge`)에만 쓰인다. 형이 이걸로 0건을 보고 "하나도 없어"라고 하셨다.
2. **예약작업을 Disable해도 이미 뜬 프로세스는 안 죽는다.** State만 보고 "해결"이라 하면 틀린다. 프로세스 수를 같이 세라.
3. **껍데기만 세면 반쪽이다.** 덱스가 처음 보고한 "node PID 2개"와 내가 센 "PowerShell 2개"는 같은 사건의 다른 층이었다. 어느 층으로 세든 결론은 같아야 정상.

## 이날 내가 틀릴 뻔한 것

`Get-CimInstance ... Where CommandLine -like '*dex_jena_bridge_daemon*'` 로 조회하면 **내 조회 명령 자체가 결과에 잡힌다**(명령줄에 그 문자열이 들어가므로). `-notlike '*Win32_Process*'` 로 걸러야 한다. 안 거르면 유령 프로세스를 하나 더 셌다고 보고하게 된다.

관련: [[reference_moa_manager_api_2026-08-30]] · [[project_unified_console_monitor_migration_2026-08-30]] · [[reference_dex_jena_cli_window_restart_gotchas_2026-08-30]]

## 2026-09-07 20:39 종결 — 원인과 정상 동작이 갈림

- **20:32 재발분**: 덱스가 구방식(작업 스케줄러 `MoaDexBridge`)을 직접 기동해서 생긴 것 [보고받음: 제나, 덱스 본인 인정]. 제나가 고아 node(`18584`)를 `Stop-Process -Force`로 죽이고, 관리자 API `/moa-dex-bridge/restart`로 단일 재기동(20:36). 내가 20:37:32에 교차 실측해 **dex 1개·jena 1개·작업 Disabled·daemon.pid 단일값** 확인.
- **`updated → disabled` 로그 짝은 정상 동작이었다** [보고받음: 제나] — 통합 콘솔의 `windows-scheduler.mjs`가 만약을 대비해 작업 설정을 Disabled로 백업 동기화하면서 남기는 기록. **내가 "무언가가 주기적으로 되살린다"고 한 추측은 틀렸다.** 다만 *"프로그램이 그 기록을 만든다"* 는 부분은 맞았다.
- **★남은 미확인 1건**: `18:05:45 updated` 에는 뒤따르는 `disabled` 가 없다(19:31·20:32 쌍과 모양이 다름). 그 직후 18:08 재부팅에서 중복이 떴다. 원인 미확인 — 콘솔 동기화 코드는 제나 몫이라 내가 안 봤다.
- 덱스가 앞으로 작업 스케줄러를 쓰지 않고 관리자 API만 쓰기로 확약 [보고받음: 제나].

**그러니 재부팅 후 재확인은 여전히 필요하다** — 위 미확인 1건이 남아 있고, 그게 재부팅 시점과 붙어 있었다.
