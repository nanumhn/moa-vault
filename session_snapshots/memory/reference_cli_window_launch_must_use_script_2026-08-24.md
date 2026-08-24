---
name: reference_cli_window_launch_must_use_script_2026-08-24
description: 덱스·제나 창은 moa_cli_window.ps1 로만 띄운다 — .cmd 직접 호출하면 권한 등급이 달라 중계기가 못 붙는다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5fba1c85-e880-4953-a8f0-3246cdd5fb47
  modified: 2026-08-24T01:55:35.508Z
---

**2026-08-24 10:51 실측 사고.** 제나 창에 새 공통 규칙을 물리려고 재시작하면서 `C:\Users\user\.moa\_cli_window_jena.cmd` 를 **PowerShell에서 직접 호출**했다. 창은 떴는데 **중계기가 못 붙었다.**

```
제나 → ⚠️ CLI 창 'jena'이 없다 — moa_cli_window.ps1 -Who jena 로 띄워라
       (확인 실패: 창(pid=27484)에 붙지 못했다: ATTACH FAILED err=5)
```

**원인 2겹**
1. **권한 등급(integrity)이 달라진다.** 등록부(`cli_windows.json`)의 `integrity`는 `Medium(explorer)` 인데, 내 셸에서 직접 띄우면 그 셸 등급을 물려받는다. 중계기는 Limited/Medium이라 **더 높은 등급 프로세스의 콘솔에 붙을 수 없다** → `err=5`(접근 거부).
2. **등록부가 갱신되지 않는다.** `.cmd` 는 창만 띄우고 `cli_windows.json` 의 `pid`를 안 고친다. 중계기는 **죽은 옛 pid**를 계속 본다(그땐 `err=87`).

**How to apply**
- **창을 띄우거나 다시 띄울 땐 반드시** `powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\user\.moa\moa_cli_window.ps1 -Who <dex|jena>`.
- `_cli_window_*.cmd` 를 직접 부르지 말 것. `cli_windows.json` 의 pid를 손으로 고치는 것도 **반쪽 수리다** — pid는 맞아도 권한 등급은 못 고친다(내가 그렇게 하고 "고쳤다"고 보고했다가 형이 제나에게 말 거는 순간 터졌다).
- ★**검수는 재는 도구를 맞게 골라야 한다.** 나는 내 프로세스로 `capturePane` 을 돌려 "창 붙기 확인 완료"라고 보고했는데, **내 권한으로는 붙는다.** 정작 붙어야 하는 건 **중계기**다. **실제 소비자로 재라** — 제나에게 메시지를 보내 답이 오는지가 진짜 검수다.
- ★그리고 **말로만 하지 말고 기록해라.** 나는 이 교훈을 디스코드에 적고 파일엔 안 남겨서 **3분 뒤에 똑같이 틀렸다.** 형이 *"이건 어디에 기록하는데??"* 라고 물어서 발견.

관련: [[reference_dex_jena_hidden_window_launcher_2026-08-23]] · [[project_dex_jena_cli_window_bridge_2026-08-23]] · [[feedback_pinocchio_clo_dont_assert_without_checking]] · [[feedback_check_tool_can_false_pass]]
