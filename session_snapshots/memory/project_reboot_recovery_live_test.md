---
name: project_reboot_recovery_live_test
description: 2026-07-18 재부팅 자동복구 시스템 구축+라이브 테스트 진행 중. 재부팅 후 돌아온 세션은 이걸 보고 형에게 복구 성공 확인부터
metadata: 
  node_type: memory
  type: project
  originSessionId: d0abf862-7dc4-496c-9ab4-5dcd8828296f
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

관련: [[project_moa_open_threads]] [[reference_moa_healthcheck]] [[feedback_discord_reply_tool]]
