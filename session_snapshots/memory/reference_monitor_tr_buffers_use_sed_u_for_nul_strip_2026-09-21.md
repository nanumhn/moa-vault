---
name: reference_monitor_tr_buffers_use_sed_u_for_nul_strip_2026-09-21
description: "Monitor 파이프에 tr -d '\\000' 을 끼우면 블록버퍼라 줄이 안 올라온다 — sed -u 's/\\x00//g' 로 쓸 것"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 78a64150-c81b-4263-9204-f4351af3460e
  modified: 2026-09-20T20:09:43.283Z
---

**`Monitor` 명령 파이프의 모든 단은 줄 단위로 흘려야 하는데, `tr` 은 그게 안 된다.**

2026-09-21 05:07 실측. 06:00 아투 발행을 지켜보려고 `atz_pipeline.log` 를 감시에 물리면서
bun 출력의 NUL 함정 때문에 `tail -f ... | tr -d '\000' | grep --line-buffered ...` 로 걸었다.
**양성 시험 줄을 넣었는데 경보가 0건이었다.** `tr` 은 출력이 파이프면 블록 단위로 모아뒀다가 내보낸다.

```bash
# ✗ 안 옴 — tr 이 블록버퍼
tail -f "$LOG" | tr -d '\000' | grep -a --line-buffered -iE "..."

# ✓ 즉시 옴
tail -f "$LOG" | sed -u 's/\x00//g' | grep -a --line-buffered -iE "..."
```

[확인: `printf 'a\000b\n' | sed -u 's/\x00//g' | od -c` 직접 실행] → `a b \n`. 제거도 되고 즉시 나온다.
`stdbuf` 도 이 환경에 있으므로 `stdbuf -oL tr -d '\000'` 도 대안이다.

**NUL 제거 단 자체는 빼면 안 된다** — [확인: python 으로 바이트 직접 집계 2026-09-21 05:1x]
`atz_pipeline.log` 는 **1,033,248바이트 중 NUL 359,066개**다. 진짜로 많다.
`atz_scheduled.ps1` 19·44행이 bun 출력을 `*>> $log` 로 그대로 붙이기 때문이다(파일 앞에 BOM `357 273 277` 도 있다).

★**NUL 유무를 bash `grep -qa $'\000'` 로 재지 말 것 — 그건 검사가 아니다.**
bash는 변수·`$'...'` 에 NUL을 담지 못해 **빈 문자열**이 되고, `grep -qa ''` 는 **모든 파일에 참**이다.
2026-09-21 내가 이걸로 "NUL 있음"을 판정해 형께 근거로 올렸다 — 결론은 우연히 맞았지만 **근거는 아무것도 재지 않았다.**
바이트 집계는 python `open(p,'rb').read().count(b'\x00')` 처럼 **NUL을 담을 수 있는 도구**로 할 것.

★**같은 날 메모리 파일에 진짜 NUL을 박아 넣는 사고도 냈다.** 이스케이프가 한 겹 벗겨져 `MEMORY.md` 에 NUL 1바이트가 들어갔고,
`grep` 이 그 파일을 "Binary file ... matches" 로 취급해서 발견했다. 리터럴로 치환해 수리(재조회 NUL=0·145줄 보존).
**메모리에 제어문자를 쓸 일이 있으면 `chr(0)` 같은 코드 조립 대신 리터럴 네 글자로 적을 것.**

같은 함정이 쇼츠 쪽에도 있다 → [[project_open_threads_2026-09-20_dawn_snapshot]] 의 `shorts_scheduled.ps1` UTF-16 항목.

**★이걸 잡은 건 양방향 시험뿐이다.** 걸자마자 양성 줄 1개 + 부정대조 줄 1개를 넣어
**양성은 오고 부정은 안 오는지** 둘 다 봐야 한다. 안 했으면 06:00 발행이 멈춰도 이 경로는 조용했을 것이다.
부트스트랩 ⑧의 *"걸고 나서 반드시 양방향으로 시험할 것"* 이 그래서 있다.

**시험 줄을 `atz_pipeline.log` 에 넣어도 안전하다** — [확인: `shorts_scheduled.ps1`·`atz_scheduled.ps1` grep]
이 파일을 **파싱하는 코드가 없다**(atz_scheduled 는 append만, shorts 는 자기 로그를 본다).

→ [[feedback_my_own_checks_fail_toward_false_positives_2026-09-20]] · [[feedback_check_tool_can_false_pass]]
