---
name: project_atz_20260918_am_zero_predicted_and_lost
description: "2026-09-18 아투 오전 결번 — 04:12에 예고하고 06:07에 확정했으나 결재 무응답으로 07:00 강제종료. 원인은 관리자 5분 timeout이 ComfyUI 기동을 잘라 죽인 것"
metadata:
  node_type: memory
  type: project
---

**한 줄**: 오늘 오전 아투는 **블로그 0 · 쇼츠 0**. 어제도 하루 0건이라 **오전 기준 이틀 연속**. 이번 건은 **사고 1시간 48분 전에 예고돼 있었다.**

## 사건 순서 (전부 클로 직접 조회)

| 시각(KST) | 일 |
|---|---|
| 04:05:53 | 재부팅 후 moa-ai-servers-up 시작 |
| 04:06:51 | ComfyUI down → 기동 (ai_servers_up.log) |
| 04:07:22 | ComfyUI 실제 기동 시작 (comfyui_8188.log) |
| 04:10:54 | **관리자가 5분 timeout으로 작업 트리를 죽임 → 막 뜨던 ComfyUI까지 같이 죽음.** exit=1, nextRunAt null |
| 04:12 | 클로가 형께 **06:00 멈춤을 예고**하고 REQ-20260918-COMFY-01 상정 |
| 06:00:01 | 발행 시작. atz run slot=am 시작 한 줄 뒤 정지 |
| 06:02:50 | 도우미는 대기종료 LM=True Comfy=True 로 **정상 종료** — 부모만 안 돌아옴 |
| 06:07:16 | 멈춤 확정. 부모 pid 16892 CPU **0.14초** 동결, 최근 15분 bun/node **0개** |
| 06:09 | 재실행 결재를 덱스에게 상정 → **브리지가 verdict=ignore로 버림** |
| 06:30~06:42 | 쇼츠가 설계대로 12분 대기 후 skipped, exit=0, 원장 기록 남김 |
| 07:00 | 스케줄러 강제종료 LastTaskResult=267014. atz_pipeline.log mtime 끝까지 06:00:01 |

## 같은 날 대조군이 저절로 생겼다
06:30 쇼츠는 **같은 도우미 스크립트를 똑같이 불렀는데** [servers] LMStudio=UP ComfyUI=UP 를 찍고 **통과했다.**
차이는 하나뿐 — 06:00은 ComfyUI를 **자기 안에서 띄워야 했고**, 06:30은 **이미 떠 있어 그대로 둠 경로**로 갔다.
그래서 "ComfyUI만 미리 띄워두면 안 멈춘다" 가 09-16 · 09-17 pm 에 이어 **세 번째 실측**이다.
관련: [[project_atz_publish_hang_when_comfyui_started_inside_run_2026-09-11]]

## 새로 밝힌 것 — 왜 ComfyUI 기동이 실패했나
[확인: 관리자 API moa-ai-servers-up 정의 직접 조회] schedule type=startup · timeoutMs 300000(5분) · nextRunAt null.
스크립트 자체 하드 데드라인은 **11분**(소스 37행, 옛 윈도우 작업 제한 15분 기준)인데, 관리자로 옮긴 뒤 실제 제한은 **5분**이다. **둘이 안 맞는다.**
★단 "구조적 상시 실패"는 **아니다** — [확인: ai_servers_up.log 08-29 이후 ComfyUI 기동 시도 **37회 전수 분석**] 잘린 건 **3회뿐**(08-31 · 09-17 · 09-18), 34회는 3.5~4분에 완료했다.
**아슬아슬하게 걸리는 구조**이고 **3회 중 2회가 최근 이틀**이다. 오늘은 앞단 LM Studio에 1.5분을 써서 ComfyUI 몫이 3.5분밖에 안 남았다.

## 왜 못 막았나
클로 권한이 읽기·검수로 묶여 있어 재실행이 상태 변경이라 승인이 필요했다 → [[feedback_temporary_restricted_authority_2026-08-28]]
**형 무응답 + 덱스 경로 원천 차단** → [[reference_bridge_ignores_all_bot_messages_2026-09-18]] 으로 두 경로가 다 막혔다.
예고도 했고 확정 보고도 했는데 **실행할 사람이 없어서 잃었다.**

## 열린 결재 (전부 무응답)
REQ-20260918-COMFY-01(재부팅 후 ComfyUI 미리 띄우기) · REQ-20260917-ATZ-02(출력캡처 파이프 제거, 근본수리) · REQ-20260918-ATZGATE-01(게이트 병기괄호 오탐) · REQ-20260918-ATZ-01(오늘 재실행 — 창 닫힘)

## 다음 세션이 볼 것
- **내일 04:0x 기동이 5분 안에 끝나는지**(ai_servers_up.log 에 대기종료 줄이 찍히는지). 안 찍히면 06:00이 오늘처럼 반복된다.
- 관리자 timeoutMs 를 늘리거나 스크립트 자체 데드라인을 맞추는 것이 근본 수리 → [[reference_moa_manager_api_2026-08-30]]
- 오늘 19:30 pm 결과. ComfyUI가 계속 떠 있으면 정상 발행일 것으로 봄(반증조건: 그래도 멈추면 진단이 틀린 것).
