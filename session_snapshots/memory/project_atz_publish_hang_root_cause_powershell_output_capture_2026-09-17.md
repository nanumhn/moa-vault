---
name: project_atz_publish_hang_root_cause_powershell_output_capture_2026-09-17
description: "아투 발행이 ComfyUI 꺼진 날 멈추는 원인 — atz_scheduled.ps1의 `$st = & powershell ...` 출력 캡처가 손자(ComfyUI)가 파이프를 물어 EOF를 못 받는다"
metadata: 
  node_type: memory
  type: project
  originSessionId: d8ca3303-d389-4de8-95d9-62591d76ae69
  modified: 2026-09-16T22:02:13.840Z
---

09-11·09-13·09-17 세 번 같은 자리에서 멈췄다. 09-17에 **코드에서 원인을 찾았다**(`atz_scheduled.ps1` 직접 열람).

**문제의 줄**

```powershell
$ensure = Join-Path $PSScriptRoot 'moa_ai_servers_up.ps1'
if (Test-Path $ensure) {
  $st = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $ensure -Wait 240
  "[servers] $st" | Out-File -Append -Encoding UTF8 $log
}
```

`$st = & ...` 는 **자식의 종료가 아니라 출력 파이프가 닫힐 때까지** 기다린다. 이 자식이 ComfyUI를 띄우면 손자(cmd → python)가 그 stdout 핸들을 물려받은 채 **계속 살아 있으므로 파이프에 EOF가 안 온다.** 부모는 그 줄에서 영원히 멈추고 `[servers]` 는 끝내 안 찍힌다.

**09-17 실측이 정확히 그 모양**
- `ai_servers_up.log`: `06:00:07 ComfyUI down → 기동` → `06:02:42 대기종료 LM=True Comfy=True` → `06:02:42 상태 UP` — **도우미는 정상 종료했다.**
- `atz_pipeline.log`: 마지막 줄이 `[2026-09-17 06:00 KST] atz run slot=am 시작` 하나뿐, `[servers]` **0건**, mtime `06:00:01` 에서 1시간 27분 정지.
- 멈춘 부모 `11668` 의 자식은 `conhost` 하나뿐 — **bun·node 0개**, 본 파이프라인은 시작조차 못 했다.
- ComfyUI 조상: python `16032` ← cmd `3700`(`D:\Develop\ComfyUIPtb\run_nvidia_gpu.bat`) ← `3688`. 살아 있다.
- 결말: `PT1H` 제한으로 강제종료, `LastTaskResult=267014`(09-11과 같은 코드). **블로그 am 결번 확정**, 앞단이 없어 쇼츠 am 도 `skipped`.

**반대 사례가 가설을 지지한다**: 09-16 은 ComfyUI 가 이미 떠 있어 도우미가 `그대로 둠` 으로 끝났다 → 손자가 안 생김 → 파이프 정상 종료 → 그날 am·pm 모두 발행 성공.

**아직 못 박은 것**: 손자가 그 핸들을 실제로 쥐고 있는지는 확인 못 했다(`handle.exe` 가 이 PC에 없다). 동작 증거만 세 번 일치한다.

**고칠 곳(코드 = 제나 몫 [[feedback_clo_tests_jena_codes_2026-09-06]])**: `$st =` 출력 캡처를 없앤다(파일 리다이렉트나 `Start-Process -Wait` 로). **바로 아래 `$cs = & powershell ... $chrome` 도 같은 함정이니 같이 고쳐야 한다.** `shorts_scheduled.ps1` 69행에도 같은 줄이 있다.

**응급 회피**: 06:00/19:30 전에 ComfyUI(8188)가 떠 있으면 이 경로를 안 탄다. 재부팅 복구에서 `recovery_timeline.log` 의 `stage=T6` 가 `TIMEOUT` 이면 그날은 꺼져 있는 것이니 **05:30 전에 결재를 올려야 06:00에 맞출 수 있다.**

**이날 내가 틀린 것 2가지**
1. 쇼츠가 대기 중인 것을 "같이 멈췄다"고 단정했다. 실제로는 06:30~06:42 설계대로 기다린 뒤 `exit=0` 정상 종료하고 원장에 `skipped` 도 찍었다. **기다리면 확인될 것을 안 기다렸다.**
2. "atz 프로세스가 두 개"라고 보고했는데, 두 번째는 **내 조회 명령 자신**이었다(`-like '*atz_scheduled*'` 가 자기 명령문을 매치). ★프로세스를 이 방식으로 셀 때는 `$_.ProcessId -ne $PID` 로 자기 자신을 빼야 한다.
