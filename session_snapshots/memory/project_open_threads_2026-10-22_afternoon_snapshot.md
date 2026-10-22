---
name: project_open_threads_2026-10-22_afternoon_snapshot
description: 10-22 14:2x 열린 작업 스냅샷 — 아투 멈춤 원인 수리·크롬 프로필 오진 정정·GSC 자동색인 신설·업무일지 V2 서버경로 대기
metadata:
  node_type: memory
  type: project
  originSessionId: 5616e34e-0a8b-4712-8936-42d261b54e8c
  modified: 2026-10-22T05:25:22.309Z
---

## 10-22 오전 세션 결과 (14:2x KST 기준)

**끝난 것**
- 아투 06:00 오전 글 결번 → 원인(PS `$x = & powershell` 출력캡처 파이프, ComfyUI 손자가 물어 무한대기) 수리. `atz_scheduled.ps1`·`shorts_scheduled.ps1` → Start-Process+임시파일+WaitForExit(백업 .bak-20261022). 11:12 재실행 11:30 exit 0. 오전 글은 qwen 보류 상태, 정오 지나 건너뜀(held: out/held/2026-10-22T02-30-12-886Z_am.json, 손대지 않음).
- "ChatGPT 로그아웃"은 클로 오진 — 디버그 크롬 시작 프로필이 Profile 1이었던 탓. Default(BlackHeart)로 재기동, 판정 통과. → [[feedback_debug_chrome_start_profile_must_be_blackheart_2026-10-22]]
- GSC 정리 + 통합 + 재작성 5편 + 자동 색인 스크립트 `atz_gsc_index.mjs` → [[project_atz_gsc_audit_2026-10-22_followup]]
- 오전 일지·MOC 2개·자산목록 → 랩실 커밋 ff1afd3 (push됨)

**열린 것**
- 형 안내: 업무일지가 V2 저장소로 이전. 형이 준 `D:\SMD\Owen\Obsidian\OwenLab_V2`는 개발PC1 경로 — **이 서버 경로 형 회신 대기**. 받으면 협업 가이드(`09 업무 가이드\AI 워커 협업 가이드.md`) 먼저 읽고 그 형식으로 일지 작성, 오늘 오전분도 옮길 것. 일지 cron(③) 프롬프트 경로도 바꿔야 함.
- 19:30 아투 저녁 발행이 GPT로 되는지 확인(atz_pipeline.log에 qwen 폴백 없는지).
- 20:30 이후 `atz_gsc_index.log`로 자동 GSC 단계 실행 확인.
- 10-23: GSC 재점검(10/lng·10/80·09/300 재크롤, 수정 7편·재작성 5편), 대기열 7편 색인요청은 자동 잡이 할당량 따라 처리.
- ⑧ 배경감시 꺼둠 유지(형 결정 대기), pm 쇼츠 edge_tts 403(형 결정), ToastDM 저장소 위치.
