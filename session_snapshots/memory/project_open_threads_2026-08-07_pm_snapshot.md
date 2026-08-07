---
name: project_open_threads_2026-08-07_pm_snapshot
description: 2026-08-07 14:00 KST 세션리셋 직전 저장 스냅샷 — 아투 쇼츠 수리·립싱크 뮤비 재작업 진행중·제나 2건 수리 완료
metadata:
  node_type: memory
  type: project
  originSessionId: 41852fa6-aaa9-4da0-ab85-15569009be61
  modified: 2026-08-07T05:25:47.023Z
---

2026-08-07 14:00 KST경, `MoaSessionRestartDay`(14:00 세션리셋) 직전 저장 시점 스냅샷.

## ★★ 열린 작업 — 다음 세션이 이어받을 것

**립싱크 뮤직비디오 재작업 진행 중 (media-head-siwoo, background agent)**
- 배경: 형이 인물사진+노래로 립싱크 요청 → 제나가 잘못 약속하고 실패 → media-head-siwoo로 이관 → 1차 결과물을 "완료"로 보고했으나 **형이 "이건 립싱크가 아니잖니"라고 정확히 지적**(268초 중 6초만 실제 립싱크, 나머지는 슬라이드쇼+뒷모습 컷 포함). 클로가 직접 ffmpeg 프레임 검증으로 확인 후 정정 보고, 재작업 착수.
- 진행상황(이 스냅샷 시점): 립싱크 컷 5곳 목표(196초 기존+37초+95초+226초+141초, 각 6초). **196초·37초·95초 컷 완성 + 클로가 직접 프레임 추출해 독립검증 완료.** 226초·141초 컷 및 최종 조립(전곡 mp4+디스코드용 프리뷰)은 미완료 — siwoo가 계속 작업 중이었음.
- 산출물 경로: `D:\Develop\moa-studio\_workspace\lipsync-2026-08-07\`
- **다음 세션 할 일**: siwoo가 완료 보고를 보내면(SendMessage로 옴) ①파일 존재 직접 확인 ②클로가 직접 ffmpeg 프레임 뽑아서 입 움직임 재검증(이 세션에서 확립한 패턴 — siwoo 자체보고 그대로 믿지 말 것) ③형이 보는 채널(그들만의대화 chat_id 1531912848433741825)로 보고+파일 첨부(용량 크면 preview 480p만 첨부, 원본 경로는 텍스트로).
- 비용: Kaggle 무료 GPU, 주간 할당 30h 중 2시간 미만 소모(여유 충분).

**조코딩 유튜브 영상 하드웨어 적용성 문의 — 형 응답 대기**
- 형이 조코딩(JoCoding) 쇼츠 링크(https://youtube.com/shorts/sP-XQBJuX2Y) 공유, "우리 시스템에 적용 가능한지" 문의.
- 제목만 확인됨: "진짜 내 컴퓨터에서 돌릴 수 있는 1위 모델의 등장 ㄷㄷㄷ" — 구체 모델명은 검색으로 못 찾음(영상 자체를 못 봄, 오디오/비주얼 이해 도구 없음).
- 클로가 형께 모델명 추가정보 또는 리서치본부(서윤) 조사 여부 물어봄 — **아직 형 응답 없음.**
- 참고: 우리 회의모델은 RTX 3060 6GB VRAM 제약(qwen2.5-7b Q4). 최근 "1위급" 로컬모델 대부분 14B~70B라 6GB로 못 돌릴 가능성 높다고 이미 안내함.

## ★ 이 세션에서 완료된 것 (요약, 상세는 오전 일지 참고)

- **아투 쇼츠 발행 실패 진단+수리**: 08-07 06:30 AM 쇼츠 실패 원인 = `publish.mjs`의 `setThumbnail()`이 try/catch 밖이라 YouTube 썸네일 403(처리중 인증오류)에 스크립트 전체가 죽음 → 비공개 미기록 고아 영상(V1SGP0mejyQ) 방치. 수동 복구(공개 전환+원장기록) + 재발방지 코드(try/catch, hasCustomThumbnail을 성공기준으로) + 테스트 38개 통과 + moa-studio 커밋(`10e810e`)+push 완료. 라이브: https://www.youtube.com/shorts/V1SGP0mejyQ
- **제나(Gemini 워커) 장애 2건 진단+수리**:
  1. 죽은 세션(conversation) 무한반복 — `data-jena/sessions.json`에서 죽은 채널 세션 삭제+재시작, `src/index.mjs`에 자동복구(재개 실패시 새 대화 1회 재시도) 추가. dex-jena-bridge 커밋 `f06c76f`.
  2. 더 근본적 원인 — agy가 **대화 맥락에 텍스트로만 언급된 mp4 경로**를 보고도 열어보려다 타임아웃(첨부 아니어도 재현됨, 클로가 agy.exe 직접 실행해 재현+수정 확인). `jena-workspace/AGENTS.md`+`dex-jena-bridge/templates/AGENTS.md`에 "오디오·영상 파일은 첨부든 언급이든 열지 마라" 규칙 추가. 커밋 `d015908`.
  - ★두 커밋 모두 **push 안 함** — dex-jena-bridge의 origin이 형 소유 저장소가 아니라 오픈소스 원저작자(`netwaif/codex-discord`) 저장소라서. 형 소유 백업 리모트가 따로 필요하면 다음에 형께 확인.
- **오전 세션 업무일지**: 옵시디언 `70 Record/2026-08-07.md`(오전 세션 섹션) + `09 업무 가이드/모아 자산 목록.md`(V1SGP0mejyQ 반영) 갱신+push 완료(archive-head-haru, 커밋 `d7a3f5e` → `nanumhn/owenlab-notes`).
- 재부팅 복구(04:00) 정상 처리 — 유실질문 회수, cron 6개 재등록, 아투 보류큐 비어있음 확인.

## 세션 관리
- 이 저장 cron(13:55 예약)이 예정보다 늦게 떴을 수 있음 — 늦더라도 끝까지 수행(리셋 스크립트가 flag를 최대 35분 대기).
- session_saved.flag는 이 메모리+vault 기록 직후 생성함.

관련: [[project_atz_image_mismatch_after_regen_2026-08-05]] [[reference_colab_lipsync_feasibility_2026-07-31]] [[project_dex_jena_daemon_silent_death_2026-08-06]] [[project_dex_jena_multiagent_2026-08-06]]
