---
name: reference_agents_md_only_injected_at_session_start_2026-08-24
description: 워커 지침(AGENTS.md)은 세션 시작·compaction 때만 주입된다 — 파일만 고치면 살아있는 창은 옛 규칙으로 계속 일한다
metadata:
  type: reference
---

**2026-08-24 실측(서지안 검수).** 덱스 지침 파일을 고쳤는데 **살아있는 창은 안 물었다.** codex rollout 의 `world_state.agents_md` 를 전수로 훑어 확인:

```
02:24:59Z  len=1748   ← 창 기동 시
02:39:04Z  len=1748   ← compaction 시 (재주입되지만 파일이 그대로였음)
(그 사이 질문 4번 — 한 번도 재주입 안 됨)
02:59:48Z  창 재시작
03:03:19Z  len=2360   ← 새 지침 들어옴
```

**즉 주입 시점은 ①세션 시작 ②compaction 뿐이다.** 파일을 고쳐도 **에러도 통지도 없이** 옛 규칙으로 계속 일한다.

**How to apply**
- **지침을 고쳤으면 반드시 창을 다시 띄운다** — `moa_cli_window.ps1 -Who <dex|jena> -Kill` 후 재실행([[reference_cli_window_launch_must_use_script_2026-08-24]]).
- **"파일에 적었다"를 완료로 보고하지 마라.** 도달했는지는 `world_state.agents_md` 길이로 잰다.
- ★`world_state` 는 **BOM을 문자 하나로 센다** (2359가 아니라 2360). 길이로 대조할 땐 이걸 감안한다.
- **`resume` 으로 띄우면 지침은 새로 들어오지만 그 창이 이미 학습한 것도 그대로 남는다.** 그래서 "새 규칙 덕인가 학습 덕인가"는 원리적으로 못 가른다 — 행동 변화를 재려면 **새 대화**여야 한다(대신 형 맥락이 사라진다).

**왜 중요한가** — [[reference_dex_agents_md_drift_2026-08-21]] 의 "덱스 2주 표류"에는 이 겹이 더 있었다. 그때는 원인을 "복사배포에 통지가 없어서"로만 봤다.

관련: [[project_dex_jena_cli_window_bridge_2026-08-23]] · [[feedback_report_only_100_percent_done]]
