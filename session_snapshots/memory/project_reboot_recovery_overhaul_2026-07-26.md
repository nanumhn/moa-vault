---
name: project_reboot_recovery_overhaul_2026-07-26
description: 2026-07-26 재부팅 자동복구 전면 수리 + 실전 재부팅 테스트. 재부팅 직후 세션은 이 파일부터 읽고 복구 인사 → 결과 보고
metadata: 
  node_type: memory
  type: project
  originSessionId: bfee855a-4885-4e0f-9c18-74ee3104257e
  modified: 2026-07-25T20:55:57.962Z
---

**2026-07-26 새벽, 재부팅 자동복구 체인 전면 수리 후 실전 재부팅 테스트를 실행했다.**

## ★ 테스트 결과 — 성공 (2026-07-26 05:48 재부팅, 실측)
| 단계 | 시각 | 경과 |
|---|---|---|
| T0 재부팅 명령 | 05:48:59 | 0:00 |
| T1 부팅완료 | 05:49:51 | 0:52 |
| T8 사이트 200 | 05:50:26 | 1:27 |
| T5 LM Studio | 05:50:53 | 1:54 |
| T2 claude 기동 | 05:51:05 | 2:06 |
| T7 n8n | 05:51:28 | 2:29 |
| **T3 디스코드 연결** | 05:51:49 | **2:50** ← 목표 5분 달성 (직전 48분) |
| T4 부트스트랩 완료 | 05:53:11 | 4:12 |
| T6 ComfyUI | 05:55:14 | 6:15 (모델 로딩 탓에 항상 꼴찌) |
| T9 전 서비스 정상 | 05:55:14 | 6:15 |

`result=OK / t3=2:50 / t9=6:15` — 목표(T3≤5분·T9≤10분) 둘 다 통과. webhook=sent, marker=removed 정상.

- **48분 → 2분 50초.** 단일 최대 기여 = `MCP_TIMEOUT` 30초→120초.
- 형에게 줄 실용 숫자: **"말 걸어도 되는" 약 3분 / "이미지까지 되는" 약 6분.**
- `moa_ai_servers_up.ps1`의 `$Args` 자동변수 충돌 버그(→`ArgList` 개명) 이번 부팅에서 에러 0건으로 실전 검증됨. qwen2.5-7b-instruct 정상 로드 확인.
- 부트스트랩 자동실행 정상: 새 세션이 형 메시지 없이 스스로 flag 감지 → fetch로 유실 메시지 회수 → cron 3종 재등록 → 복구 인사.
- **T4는 `session_boot.flag`가 삭제될 때 찍힌다** = 부트스트랩(나)이 지워야 마킹된다. 순서: 부트스트랩 작업 끝 → flag 삭제.
- T9(전체완료)는 사실상 ComfyUI 기동 시간이 결정. 형 체감 복구는 T3 기준.

## 재부팅 직후 새 세션이 할 일 (순서대로)
1. `C:\Users\user\.moa\recovery_timeline.log` 의 **가장 마지막 run 블록**을 읽어 T1~T9 실측치 확인 (T3=디스코드 연결 = 형 말이 들리기 시작한 시각, T9=전체완료)
2. `mcp__plugin_discord_discord__fetch_messages`(channel `1501858476362829834`)로 다운타임 중 형 메시지 회수
3. 형에게 **복구 인사 + 단계별 시간표**를 reply로 보고. 기준선 대비 판정:
   - 직전 사고(2026-07-26 04:01 재부팅): **T3 = 48분** ← 이게 고치려던 문제
   - 목표: **T3 ≤ 5분, T9 ≤ 10분**. 넘으면 실패로 보고하고 원인 재분석
4. `session_boot.flag` 정리, cron 3종 재등록(CLAUDE.md 참조)

## 이번 사고의 근본원인 (실측 확정 — 기존 문서의 통설과 다름)
- **MCP 사망 원인 = 연결 30초 타임아웃** (`Connection failed: ... timed out after 30000ms`). 기존에 알려진 "login 실패 시 process.exit(1)"이 아니었다 → **`MCP_TIMEOUT=120000`(사용자 환경변수)로 해결.** 이게 수리의 핵심.
- BootNotify가 claude.exe 존재만으로 "복귀 완료" 오보 → 형이 정상인 줄 오해
- 파수꾼 쿨다운 20분 고정 → 부팅 직후에도 20분 대기하며 30분 낭비
- `MoaAiServersUp`이 15분 작업제한 초과로 강제종료되며 **ComfyUI를 동반 사망**시킴 (LastTaskResult=267014). 포트충돌(10048)은 오진 — 그 err 로그는 2026-07-21자 stale이었다
- ACK봇이 귀먹은 상태에서 "작업 중이에요"로 답해 형이 정상으로 오해 (가장 나빴던 부분)
- 재시동은 2회가 아니라 **3회**(04:07 세션 자체 재시동이 파수꾼 장부에 안 잡힘)

## 수리 내용
신규 6: `moa_common.ps1`(판정 헬퍼 통일) `moa_recovery_timeline.ps1`(T0~T9 계측, claude와 독립) `moa_reboot_test_start.ps1`(T0 마커) `moa_preflight.ps1`(발사 전 GO/NO-GO) `moa_mcp_probe.ps1` + 메시지 템플릿 3
변경 6: `moa_boot_notify.ps1`(MCP까지 확인해야 ✅) `moa_mcp_guard.ps1`(부팅30분 비상모드·쿨다운5분·3회 에스컬레이션·2중근거 오탐방어) `moa_launch_when_online.ps1`(예열 대상을 marketplaces→**plugins\cache**로 교정) `moa_session_respawn.ps1` `moa_ack_bot.ps1`(정직화) `moa_ai_servers_up.ps1`(11분 하드 데드라인)

## 알려진 트레이드오프 (형에게 고지 완료)
오탐 방어 때문에 **"MCP가 붙었다가 세션 도중 죽는"** 경우는 자동 재시동 대신 형에게 알림만 간다 (claude MCP 로그가 계속 '연결 성공'이라 두 근거가 엇갈림 → 재시동 거부). 형 원칙("살아있는 걸 죽이는 게 훨씬 나쁘다")을 따른 결과. 실제 중도 사망이 관측되면 "5회·15분 이상 지속 시 자동 복구"로 완화할 것.

## 검증 노하우 (반복 실수 방지)
- **로그를 `tail`로 잘라 보고 판단하지 마라.** `[TEST] -SimulateDeaf` 마커가 DEAF 줄 **바로 위**에 따로 찍히는 구조라, 끝부분만 보면 "살아있는 걸 죽였다"고 오판한다. 실제로 이 세션에서 형에게 오탐 경보를 냈다가 정정했다. 줄번호(`grep -n`)로 앞뒤를 함께 봐라.
- PowerShell `[int]$ts.TotalMinutes`는 절사가 아니라 **반올림** — 초가 30 이상이면 분이 1분 부풀려진다. 시간 계측에 쓰면 목표 판정이 뒤집힌다.

관련: [[reference_discord_mcp_connect_fail]] [[project_reboot_recovery_live_test]] [[reference_mcp_guard_watchdog]] [[feedback_verified_facts_only]]
