---
name: project_reboot_recovery_live_test
description: 2026-07-18 재부팅 자동복구 시스템 구축+라이브 테스트 진행 중. 재부팅 후 돌아온 세션은 이걸 보고 형에게 복구 성공 확인부터
metadata: 
  node_type: memory
  type: project
  originSessionId: d0abf862-7dc4-496c-9ab4-5dcd8828296f
  modified: 2026-07-19T02:51:23.141Z
---

**2026-07-18 세션에서 진행 중이던 것: 서버 재부팅 자동복구 시스템 구축 + 리얼 테스트.**

배경: 형 리부팅 테스트에서 재부팅 후 자동복귀가 반쪽만 동작(다운타임 메시지 유실 + 복귀 무통보)해서 형이 수동 리부팅함. 그걸 고침.

구축 완료(같은 세션):
- 로그온 작업 `클로드 코드 디스코드 연결` 재부팅 내성 강화(배터리·45초 지연·3회 재시도)
- `MoaBootNotify` + `moa_boot_notify.ps1` — 부팅 시 형에게 복귀중/완료 웹훅 + `session_boot.flag` 작성
- `MoaServerReboot` + `moa_server_reboot.ps1`(수·일 04:00, 저장→알림→shutdown /r). 기존 `MoaSessionReset`은 Disabled.
- CLAUDE.md 세션시작 루틴에 "session_boot.flag 있으면 fetch_messages로 다운타임 유실 메시지 회수" 추가
- AutoAdminLogon=1 확인 → 재부팅 후 무인 자동로그인 → 로그온작업 자동발화

★ **재부팅 후 돌아온 나(새 세션)가 할 일:**
1. `C:\Users\user\.moa\session_boot.flag` 확인 → 있으면 `mcp__plugin_discord_discord__fetch_messages`로 최근 히스토리 회수, 재부팅 동안 형이 보낸 미응답 메시지 처리
2. 형(blackheart_00, chat_id 1501858476362829834)에게 **"✅ 재부팅 복구 성공 — 저 자동으로 돌아왔어요"** 먼저 인사(reply 도구). 이게 리얼 테스트의 성공 판정이다.
3. flag 파일 삭제
4. 남은 것: 복귀 알림 웹훅이 헬스체크 채널로 감 → 이 대화방으로 옮길지 형이 결정 대기(형-only 웹훅 필요할 수 있음). 재부팅 주기(수·일 2회) 메모리 관찰 후 조정 여지.

**2026-07-19 업데이트 — 새 실패모드 발견 + 수신 워치독 추가:**
- 일요일 04:00 `MoaServerReboot` 예정대로 재부팅됨(04:01). 근데 04:02 세션은 떴는데 형이 04:31 "클로~" 불러도 **무응답** → 04:43 재시작. 형 스샷으로 확인.
- **근본원인 = "살아있는데 귀 닫힘"**: 재부팅 직후 세션은 떠도 Discord 실시간 수신 gateway가 제때 안 붙는 경우가 있음. 시동알림 🚀(직접 curl이라 성공)은 나가서 형은 "떴네" 하고 말 걸지만, 형 메시지는 세션에 전달 안 됨. 기존 session_boot.flag 회수 루틴은 "세션 시작 시 backlog"만 커버 → 세션이 이미 뜬 뒤 온 라이브 메시지 누락은 못 잡았음.
- **조치 ① 수신 워치독 cron** `2,7,12,17,22,27,32,37,42,47,52,57 * * * *` (5분마다, 형이 5분 선택). fetch_messages로 Discord 직접 조회 → 내 마지막 실제 답장보다 형 마지막 메시지가 나중이면 자동 처리·응답. 세션 내부 타이머라 gateway 죽어도 동작. 세션 전용이라 **매 세션시작 재등록 필요**(CLAUDE.md 세션시작 체크리스트 ②에 박음). 자동알림(🚀🔄✅)은 답장으로 안 침·중복응답 금지.
- **조치 ② 모델표시 버그 수정**: `notify-startup.sh`가 settings.json(모델필드 없음)→sonnet-4-6 기본값으로 잘못 표기하던 것. hook input JSON의 실제 model 읽도록 수정([1m] 접미사 strip). 실제 모델은 계속 opus-4-8이었음(다운그레이드 아님).
- 형 결정 대기: 워치독 지연 10분→5분 단축 여부.

관련: [[project_moa_open_threads]] [[reference_moa_healthcheck]] [[feedback_discord_reply_tool]] [[reference_discord_send_glitch_and_tz]]
