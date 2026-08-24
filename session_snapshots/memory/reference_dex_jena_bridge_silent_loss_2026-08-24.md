---
name: reference_dex_jena_bridge_silent_loss_2026-08-24
description: 덱스·제나 중계기의 조용한 유실 4종(승인요청·미탐·4분 타임아웃·재시작 유실)과 수리 내용
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5fba1c85-e880-4953-a8f0-3246cdd5fb47
  modified: 2026-08-23T20:43:25.059Z
---

2026-08-24 새벽, 형 지적("덱스 요청건이 디스코드로 요청 안오네")에서 시작해 `D:\Develop\dex-jena-bridge` 에서 **조용한 유실 4종**을 찾아 고쳤다. 커밋 4개, `main` 반영(원격 push 불가 — origin이 남의 레포 `netwaif/codex-discord`).

**① 승인 카드는 요청 경로에만 있었다** — 카드가 나오는 자리는 `wincon.mjs` 의 `pasteToPane`/`waitForReply` 안뿐이었다. 즉 **디스코드에서 말을 걸었을 때만** 창을 들여다본다. 덱스·제나가 **자기 일을 하다 스스로** 승인창을 띄우면 아무도 안 본다.
→ `wincon.detectApproval()`(읽기 전용) + index.mjs 에 20초 주기 상시 감시. 화면 지문이 바뀔 때만 카드를 내고, 요청 경로가 낸 카드도 같은 지문 자리에 기록해 두 경로가 겹쳐도 한 장만 나간다.

**② ★codex 명령승인 문구를 판정기가 못 잡았다(미탐)** — `Would you like to run the following command?` / `› 1. Yes, proceed (y)` 화면이 **"승인창 아님"** 으로 통과했다. 구조 규칙도 못 잡는다: 이 화면의 안내는 `esc to cancel` 이 아니라 선택지 끝의 `(esc)` 라서 `MENU_HINT_RE` 에 안 걸린다. **그 상태에서 글이 들어갔으면 Enter가 `1. Yes, proceed` 를 눌러 명령이 사람 확인 없이 실행됐다.** 코드 주석에 "codex 명령승인 문구는 아직 못 봤다"고 적혀 있던 그 구멍이고, 형 스크린샷이 처음 보여줬다. → `APPROVAL_MARKERS` 에 실측 문구 2개 추가. 오탐 대조군 7개 통과.

**③ ★4분 넘는 작업은 답이 통째로 사라졌다** — `waitForReply` 의 `timeoutMs`(240초)가 **턴 전체의 상한**이었다. 넘으면 답을 접고 나가고, 그 뒤 창에 나온 진짜 답은 아무도 안 가져간다. 실패 코드도 알림도 없다. **실측: 덱스가 18분 24초 걸려 낸 앤블 SaaS 분석 보고서가 디스코드로 한 글자도 안 갔다.** → `timeoutMs` 의 뜻을 '조용해질 때까지'에서 **'조용한 채로'** 로 바꿈(화면이 움직이면 기한 연장, 절대 상한 `REPLY_MAX_MINUTES` 기본 30분). 상한에 걸리면 `settled=false` 로 "아직 작업 중일 수 있어요"를 붙인다.

**④ 재시작 중 온 메시지는 통째로 유실된다** — 디스코드는 꺼진 봇에게 나중에 주지 않는다. 클로 세션엔 회수 루틴이 있는데 덱스·제나엔 없었다. 형이 제나에게 보낸 사진이 **워크스페이스에 도착조차 안 한** 게 이것. → `clientReady` 에서 회수. 폭주 방지 5겹: 채널당 최근 1건만 / 60분 창 / 회수 id를 되먹이기 **전에** 기록 / `RECOVER_MISSED=off` / `classifyMessage` 로 '나를 부른 말'만.

**함정 (다음에 또 걸린다)**
- **`Stop-ScheduledTask` 는 자식 node 를 안 죽인다.** 껐다고 믿고 시험하면 시험 자체가 가짜가 된다 — `Get-CimInstance Win32_Process` 로 확인 사살할 것.
- 중계기 out.log 는 **stdout 버퍼링 때문에 30초쯤 늦게** 찍힌다. 로그가 비었다고 "안 돌았다"로 읽지 말 것(실제로 오판했다).
- 감시자 합격 판정은 **카드의 멘션 대상**으로 갈랐다 — 요청 경로 카드는 요청자를, 상시 감시 카드는 형을 부른다. 로그만 보면 못 가린다.

관련: [[feedback_check_tool_can_false_pass]] · [[feedback_mark_confirmed_vs_guess_with_falsifier]] · [[project_dex_jena_cli_window_bridge_2026-08-23]] · [[reference_dex_jena_hidden_window_launcher_2026-08-23]]
