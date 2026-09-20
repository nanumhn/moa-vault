---
name: project_shared_rules_sync_drifted_watcher_disabled_2026-09-20
description: 공통수칙 동기화가 2026-08-30부터 DRIFT인데 감시기(MoaSharedRulesWatch)가 경보 낸 상태로 꺼져 있다. 별건으로 쉐어룰 v202609009 패치가 09-06부터 미적용
metadata: 
  node_type: memory
  type: project
  originSessionId: 93500c76-6989-464e-b6a5-8e1e0efd648c
  modified: 2026-09-20T08:53:10.318Z
---

**2026-09-20 17:26 내가 직접 확인. 형 결재 대기 중 — 나는 `-Check`(읽기)만 했고 아무것도 안 고쳤다.**

## ① 감시기가 "경보를 낸 상태로" 멈춰 있다

`shared_rules_watch.log` 직접 열람 — **마지막 줄이 2026-08-30 07:37 `DRIFT — 어긋남 감지`** 다. `OK`가 아니다.
08-24 11:20 에도 같은 내용으로 한 번 울렸고, 둘 다 `알림 발송함` 까지 찍혀 있다.

관리자 3888 잡 상세: `enabled:false` · `lastStartedAt:null` · `nextRunAt:null`.
즉 **2026-08-29 관리자 이관 이후 한 번도 안 돌았다.** 왜 꺼졌는지는 **모른다** — 고의인지 이관 사고인지 확인 못 했다.

내가 2026-09-20 17:26 에 `moa_shared_rules_sync.ps1 -Check` 를 직접 재실행: **EXITCODE=2**, 오늘도 그대로다.

```text
SSOT: D:\Develop\moa-vault\00_Common\SHARED_RULES.md
최신 0 / 어긋남 4 / 없음 0
  D:\Develop\Claude_Channels\CLAUDE.md
  D:\Develop\dex-workspace\AGENTS.md
  D:\Develop\jena-workspace\AGENTS.md
  D:\Develop\dex-jena-bridge\templates\AGENTS.md      (모두 "공통 수칙 블록이 아예 없음")
```

★**과장하지 말 것** — 네 파일 모두 **맨 위에서 SSOT를 직접 읽으라고 가리킨다**(CLAUDE.md 첫 줄이 그것). 그러니
*"워커들이 규칙을 모른 채 돌았다"* 는 결론은 **근거가 없다.** 어긋난 것은 **복사본 블록**이고,
실제 피해가 있었는지는 **확인 못 했다.** 다음 세션도 여기서 더 나가지 말 것.

`-Apply` 가 수리 모드다. **형 결재 전에는 돌리지 말 것.** 잡을 켜는 것도 상태변경이다 → [[feedback_temporary_restricted_authority_2026-08-28]]

## ② 별건 — 쉐어룰 버전 패치가 09-06부터 미적용

`C:\Users\user\.moa\pending_shared_rules_v202609009_REQ-20260906-SHAREDRULES-01.patch` (직접 열람).
**v202608009 → v202609009** 로 올리는 패치. 사유는 **D4(결재 카드 의무화)·D5(멘션 의무화)** 신설분.

★**머리말 버전은 헷갈리지 말 것**: 규칙 본문 D4·D5 는 **이미 SSOT 에 들어가 있고**, 안 올라간 건 **버전 숫자뿐**이다.
`SHARED_RULES.md` 859행이 여전히 `Shared_Rules_v202608009` 이므로 **답변 머리말은 v202608009 가 맞다**(2026-09-20 17:28 재열람).
패치가 적용되면 그때 v202609009 로 바꾼다. → [[reference_shared_rules_marker_digits_only_2026-08-26]]

## 함정

`moa_shared_rules_watch.ps1` 은 **UTF-16** 이라 `grep`·`iconv -f UTF-16LE` 로 읽으면 깨진다. PowerShell 로 읽을 것.
→ [[reference_ps51_cp949_breaks_korean_files_2026-08-24]]

관련: [[project_unified_console_monitor_migration_2026-08-30]] (감시 5종 Disabled 는 정상 — **단 이 건은 관리자에서도 `enabled:false` 라 다르다**) · [[feedback_absence_of_record_is_not_absence_of_problem_2026-09-06]]
