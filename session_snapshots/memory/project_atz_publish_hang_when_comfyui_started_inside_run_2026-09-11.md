---
name: project_atz_publish_hang_when_comfyui_started_inside_run_2026-09-11
description: "2026-09-11 아투 06:00 발행이 첫 단계에서 멈춤 — 발행 준비 스크립트가 ComfyUI를 새로 띄운 첫 사례, 원리는 추정 단계"
metadata: 
  node_type: memory
  type: project
  originSessionId: 020131be-1ce0-4c5b-b0d5-362e34bde274
  modified: 2026-09-10T21:29:29.513Z
---

09-11 06:00 `MoaAtzPublish`(atz_scheduled.ps1)가 `[servers]` 줄을 못 찍고 멈췄다. 06:28 기준 프로세스 3252 CPU 0.27초·자식 없음, 파이프라인 로그는 06:00 "시작" 한 줄뿐. 작업 제한 1시간(PT1H) → 07:00 강제 종료 예정. 06:30 쇼츠는 오늘 글이 없어 건너뛰는 구조.

**확인된 사실**
- `ai_servers_up.log`: `06:00:08 ComfyUI down → 기동` → `06:03:04 상태 UP`. 도우미는 끝났는데 부모(`$st = & powershell ... moa_ai_servers_up.ps1`)가 안 돌아옴.
- ComfyUI는 `Start-Process ... -RedirectStandardOutput/Error`(moa_ai_servers_up.ps1 153행)로 기동, cmd 4016 → python 3672, 부모 25840은 이미 없음.
- 반례 조사: 최근 "down → 기동" 12건 중 **발행 도중에 기동한 건 이번이 처음**. 나머지 발행은 전부 ComfyUI가 이미 떠 있어 `[servers]`가 1~2초 만에 찍힘.
- 오늘 재부팅 뒤 부팅 때 ComfyUI를 띄운 주체가 없었다(09-08~09-10은 04:29경 기동 기록 있음, 오늘은 없음). `MoaAiServersUp` 예약작업은 08-30부터 Disabled. `recovery_timeline.log` 09-11 회차도 T3(디스코드)에서 멈춰 ComfyUI 단계가 없다.

**추정(미확인)**: Start-Process 리다이렉트 기동 시 상속 가능한 핸들까지 넘어가, 새 ComfyUI가 캡처 파이프를 쥐고 있어 부모가 EOF를 영영 못 받는다. 반증: handle 도구로 python 3672가 그 파이프를 안 쥐고 있으면 틀림.

**조치 상태**: 형께 결재카드 REQ-20260911-ATZ001-01(작업 정지→재실행→오전 쇼츠 1회) 올림. ComfyUI가 지금 떠 있어 재실행은 '그대로 둠' 경로라 안 멈출 것으로 봄. 근본 수리(캡처 안 하기 또는 기동을 캡처 밖으로 분리)는 코드라 제나 몫([[feedback_clo_tests_jena_codes_2026-09-06]]). 같은 부팅의 관리자 락 사고: [[reference_moa_manager_stale_lock_pid_reuse_2026-09-11]].

**결과(07:05 재조회)**: 07:00 스케줄러가 강제 종료(LastTaskResult 267014, pid 3252 소멸, 파이프라인 로그에 종료 줄 없음). 06:30 쇼츠는 06:42 `skipped`(원장 기록, "am 최신 기록이 2026-09-10"). **09-11 오전 블로그·쇼츠 결번 확정.** 형 결재 무응답 상태로 07:05 보고함. 결재 승인 시 늦은 재실행 가능. 19:30 저녁 발행 전 ComfyUI가 여전히 떠 있는지 확인할 것 — 또 꺼져 있으면 같은 멈춤이 재발할 수 있다.
