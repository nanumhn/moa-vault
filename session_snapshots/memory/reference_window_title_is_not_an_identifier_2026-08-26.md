---
name: reference_window_title_is_not_an_identifier_2026-08-26
description: 같은 터미널 PID가 조회 시각에 따라 MOA-dex / MOA-jena 를 번갈아 돌려준다 — 창 제목으로 생존을 판정하면 안 된다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8fba9994-0cb1-4297-b6d4-f80fee0ca625
  modified: 2026-08-26T00:50:46.963Z
---

**같은 프로세스가 36분 만에 다른 이름을 돌려줬다.** 실측 `[확인]` 2026-08-26:

```
09:07  Get-Process WindowsTerminal → pid 10396 · MainWindowTitle = "MOA-dex"
09:43  Get-Process              → pid 10396 · MainWindowTitle = "MOA-jena"
```

**원인**: Windows Terminal 은 **창 여러 개를 프로세스 하나**에 담는다. `MainWindowTitle` 은 프로세스당 **하나만** 돌려주고, 그 값은 **그때 앞에 나와 있는 창**이다. 덱스와 제나가 같은 터미널 프로세스(10396) 밑에 살면 **둘 중 하나만 보이고, 어느 쪽이 보일지는 조회 시각에 달렸다.**

## 이것 때문에 실제로 형께 오보를 올렸다

2026-08-26 09:07, 새 세션 첫 보고에서 **"제나 창이 없습니다"** 라고 단정했다. 근거는 `Get-Process WindowsTerminal | MainWindowTitle` 에 `MOA-dex` 만 나온 것이었다.
**제나는 멀쩡히 살아 있었다**(`agy.exe` pid 13340, 08:37 기동). 형이 *"제나야, 지금 어떻게 지내?"* 한 줄로 10초 만에 정상 답을 받아 뒤집혔다.

**하마터면 멀쩡한 제나를 죽이고 재기동할 뻔했다.** 실행기가 *"이미 실행 중"* 으로 막아준 덕에 안 죽었다 — **내 판단이 막은 게 아니다.**

## 그래서 생존 판정은 이렇게 한다

1. **★제일 확실한 건 말을 걸어보는 것이다.** 프로세스 목록·창 손잡이는 전부 **간접 증거**고, **답이 오는 것만 직접 증거**다. 형이 조회 세 번보다 정확했던 이유가 이것이다.
2. **이름 + 실행경로로 잡는다.** 안 흔들리는 값:
   - 덱스 = `codex.exe` · `C:\Users\user\AppData\Local\Programs\OpenAI\Codex\bin\codex.exe`
   - 제나 = `agy.exe` · `C:\Users\user\AppData\Local\agy\bin\agy.exe`
3. **창을 세야 하면 `EnumWindows` 로 전수조사**한다. `MainWindowTitle` 은 프로세스당 하나뿐이라 **여러 창을 담는 호스트에는 못 쓴다.**
4. **pid 단독 판정 금지** — 재활용된다: [[reference_pid_reuse_defeats_liveness_check_2026-08-26]]

## 곁가지로 같이 확인된 것

- **`node.exe` 경로만으로는 서비스를 못 가른다.** 다리 2개·nblog·suno 가 전부 `C:\Program Files\nodejs\node.exe` 다. **`Get-CimInstance Win32_Process` 로 `CommandLine` 까지** 봐야 갈린다(`Get-Process` 에는 명령줄이 없다).
- **로그가 있다고 로그 증분으로 생존을 판정하면 안 된다.** `comfyui_8188.log` 는 04:35 이후 5시간째 안 늘었지만 ComfyUI 는 살아 있었다. **조용해도 되는 놈이 있다** → 포트 응답으로 재라.
- **TCP 연결만 되는 것도 생존이 아니다.** 포트를 물고 죽은 프로세스도 연결은 받는다. **응답 바이트가 돌아오는 것**까지 봐야 한다.

관련: [[feedback_pinocchio_clo_dont_assert_without_checking]] · [[reference_dex_jena_hidden_window_launcher_2026-08-23]]
