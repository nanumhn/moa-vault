# 덱스·제나 멀티모델 워커 도입 실행계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** OpenAI Codex("덱스")와 Google Antigravity/Gemini("제나")를 디스코드 봇 워커로 붙여, 클로(지휘자)가 작업을 위임할 수 있게 만든다.

**Architecture:** 오픈소스 브리지(`netwaif/codex-discord`, Node.js + discord.js)를 윈도우 네이티브로 패치해서 쓴다. 각 CLI(codex.exe, agy.exe)를 서브프로세스로 구동하고, 디스코드 채널 메시지를 중계한다. 상시구동은 tmux 대신 우리가 이미 검증한 Windows Task Scheduler + Hidden PowerShell 패턴(`MoaAckBot` 선례)을 쓴다.

**Tech Stack:** Node.js 22+(시스템에 v24.18.0 설치 확인됨), discord.js v14, OpenAI Codex CLI(`@openai/codex`), Google Antigravity CLI(`agy`), PowerShell(상시구동 스크립트), Windows Task Scheduler.

**상태: 2026-08-06 전체 완료.** Task 0~6 전부 종결, 덱스·제나·클로 셋 다 실채널에서 응답 확인. 상세 로그는 `C:\Users\user\.moa\dex_jena_setup_progress.md` 참고.

## Global Constraints

- 조사 근거: `10_Wiki/Projects/2026-08-06-dex-nai-multiagent-design.md` §1 (모든 실현성 판단이 여기서 나옴)
- WSL 사용 금지 — 윈도우 네이티브로만 간다 (design.md §2, 접근법 C 기각 사유)
- tmux 불요 — headless 모드만 쓴다
- 브리지 저장소는 특정 커밋에 고정하고 코드 리뷰 없이는 업데이트하지 않는다 (design.md §6, 공급망 주의)
- 토큰·봇 계정 비밀번호는 AI 대화창에 붙여넣지 않는다 — 형이 직접 파일에 적는다 (모든 하네스 작업 공통 원칙, CLAUDE.md)
- 매 작업 승인 게이트 없음 — 클로가 판단해서 진행하고 결과만 보고 (design.md §5)

---

### Task 0: 형 수동 사전작업 (디스코드 봇 계정 2개 + 최초 로그인)

이 태스크는 코드가 아니라 **형이 직접 해야 하는 일**이다. 클로는 이 단계에서 안내만 하고, 완료 확인 후 다음 태스크로 넘어간다.

**형이 할 일 — 디스코드 봇 계정 생성 (2회 반복, 덱스용 1개 + 제나용 1개):**

1. `discord.com/developers/applications` → New Application → 이름 입력(예: "덱스", "제나")
2. Bot 탭 → Reset Token → 토큰 복사 (한 번만 보인다, 안전한 곳에 임시 보관)
3. 같은 화면 Privileged Gateway Intents → **MESSAGE CONTENT INTENT** 켜고 Save
4. OAuth2 → URL Generator → SCOPES: `bot` / 권한: View Channels·Send Messages·Read Message History·Embed Links·Attach Files 다섯 개 체크
5. 생성된 URL을 브라우저로 열어 서버에 초대

**형이 할 일 — 채널 4개 준비:**

기존 채널(형-클로 대화)은 그대로 두고, 새 채널 3개를 만든다: `#작업`, `#회의`, `#수다`. 개발자 모드를 켜고(설정→고급) 각 채널 ID를 복사해 둔다.

**형이 할 일 — 각 CLI 최초 로그인 1회:**

- Codex: 클로가 Task 2(스모크 테스트)에서 설치 명령을 안내하면, `codex login` 실행 후 ChatGPT Plus 계정으로 브라우저 로그인
- Antigravity: 클로가 Task 2에서 설치 명령을 안내하면, `agy login`(또는 동급 명령) 실행 후 구글 계정 로그인

- [x] **Step 1: 클로가 형에게 위 항목을 체크리스트로 전달**하고, 봇 토큰 2개·채널 ID 4개(기존+작업+회의+수다)·형 사용자 ID를 로컬 파일(예: `D:\Develop\dex-jena-bridge\.env`, 아직 없으면 이후 태스크에서 생성)에 형이 직접 적도록 안내
- [x] **Step 2: 완료 확인** — 형이 "다 했어" 또는 토큰/ID 값이 채워진 파일 경로를 알려주면 다음 태스크로 진행

---

### Task 1: Codex/Antigravity CLI 설치 + 최우선 리스크 스모크 테스트

**목적:** design.md §7의 최대 리스크("`codex exec -s workspace-write`가 윈도우에서 headless로 도는가")를 가장 먼저 확인한다. 이게 막히면 나머지 작업은 무의미하므로 최우선.

**Files:**
- Create: `D:\Develop\dex-jena-bridge\smoke-test-codex.ps1`
- Create: `D:\Develop\dex-jena-bridge\smoke-test-agy.ps1`

**Interfaces:**
- Consumes: 없음 (최초 태스크)
- Produces: `codex.exe`·`agy.exe`의 절대경로 (Task 4의 `.env` 설정에서 사용), headless 실행 가능 여부 판정(Task 3의 브리지 배선 여부를 결정)

- [x] **Step 1: Codex CLI 설치**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

- [x] **Step 2: 형에게 `codex login` 대화형 로그인 요청** (ChatGPT Plus 계정). 완료 후 `codex --version`으로 설치 확인.

- [x] **Step 3: elevated 샌드박스 최초 셋업 확인**

```powershell
codex exec -s workspace-write "echo hello > D:\Develop\dex-jena-bridge\smoke-test-output.txt"
Get-Content D:\Develop\dex-jena-bridge\smoke-test-output.txt
```

Expected: `smoke-test-output.txt`에 `hello`가 쓰여 있어야 한다. UAC 프롬프트가 뜨면 형에게 최초 1회 승인 요청(design.md에서 예상된 동작). 승인 후 재실행해서 무인으로 통과하는지 확인.

- [x] **Step 4: 실패 시 폴백 확인** — elevated가 끝내 안 되면 `codex exec -s workspace-write --sandbox unelevated`로 재시도. 이것도 실패하면 **여기서 멈추고 형에게 보고** — 나머지 태스크(덱스 관련)는 보류.

- [x] **Step 5: Antigravity CLI 설치**

```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

- [x] **Step 6: 형에게 `agy login`(또는 동급 최초 인증 명령) 요청** (구글 계정). 완료 후 `agy --version` 또는 `%LOCALAPPDATA%\agy\bin\agy.exe --version`으로 설치 확인.

- [x] **Step 7: 두 실행파일의 절대경로를 기록해 둔다** (Task 4에서 사용):
  - Codex: `codex --version`이 성공한 셸에서 `(Get-Command codex).Source` 실행해 경로 확보 (보통 `%LOCALAPPDATA%\Programs\...\codex.exe` 형태)
  - Antigravity: `%LOCALAPPDATA%\agy\bin\agy.exe`

- [x] **Step 8: 결과 요약해서 형에게 보고** — 두 CLI 다 무인 headless 실행 가능한지 여부가 이후 태스크 진행 여부를 가른다.

---

### Task 2: 브리지 저장소 확보 + 코드 리뷰 + 커밋 고정

**Files:**
- Clone: `D:\Develop\dex-jena-bridge\` (from `https://github.com/netwaif/codex-discord`)

**Interfaces:**
- Consumes: 없음
- Produces: `dex-jena-bridge/src/codex.mjs`, `dex-jena-bridge/src/agy.mjs`, `dex-jena-bridge/index.mjs` (Task 3에서 패치 대상), `dex-jena-bridge/.env.example` (Task 4에서 참고)

- [x] **Step 1: 클론**

```powershell
cd D:\Develop
git clone https://github.com/netwaif/codex-discord.git dex-jena-bridge
cd dex-jena-bridge
git log -1 --format="%H %ci"
```

커밋 해시를 design.md에 기록해 둔다(고정 버전 추적용).

- [x] **Step 2: 코드 리뷰 — 3개 파일을 반드시 읽는다**
  - `index.mjs` — 메인 로직, `TUI_ENABLED` 게이트(65번 줄 근처) 확인, 디스코드 메시지 핸들링 전체 훑기
  - `src/codex.mjs` — `child_process.spawn` 호출부, 실행 인자(`exec -s workspace-write` 등) 확인
  - `src/agy.mjs` — PATH 조작 부분(macOS `sysctl` 접미사 버그 위치) 확인
  - `package.json` — 의존성이 `discord.js`뿐인지, 수상한 postinstall 스크립트 없는지 확인

- [x] **Step 3: 리뷰에서 이상 징후(원격 코드 실행, 알 수 없는 외부 호출, 난독화 코드)가 없는지 확인.** 있으면 여기서 중단하고 형에게 보고. 없으면 진행.

- [x] **Step 4: 이 커밋에 태그를 달아 고정**

```powershell
git tag dex-nai-pinned-v1
```

---

### Task 3: 윈도우 패치 (agy.mjs PATH 버그 수정)

**Files:**
- Modify: `D:\Develop\dex-jena-bridge\src\agy.mjs`
- Test: `D:\Develop\dex-jena-bridge\src\agy.test.mjs` (신규)

**Interfaces:**
- Consumes: Task 2에서 클론된 저장소
- Produces: 윈도우에서 PATH가 깨지지 않는 `agyEnv()` 함수

- [x] **Step 1: 현재 버그 위치 확인**

`src/agy.mjs`에서 `agyEnv()` 함수(또는 동급 이름)를 찾아, `PATH`에 `:/usr/sbin:/sbin`을 무조건 붙이는 부분을 특정한다.

- [x] **Step 2: 실패하는 테스트 작성**

```javascript
// src/agy.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agyEnv } from './agy.mjs';

test('agyEnv does not corrupt PATH on win32', () => {
  const originalPlatform = process.platform;
  Object.defineProperty(process, 'platform', { value: 'win32' });
  try {
    const env = agyEnv({ ...process.env, PATH: 'C:\\a;C:\\b' });
    assert.ok(!env.PATH.includes(':/usr/sbin:/sbin'), `PATH corrupted: ${env.PATH}`);
  } finally {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  }
});
```

- [x] **Step 3: 테스트 실행해서 실패 확인**

```powershell
cd D:\Develop\dex-jena-bridge
node --test src/agy.test.mjs
```

Expected: FAIL (PATH가 오염됨을 확인)

- [x] **Step 4: 최소 수정 — `process.platform` 가드 추가**

`agyEnv()` 안에서 `:/usr/sbin:/sbin` 접미사를 붙이는 줄을:

```javascript
if (process.platform !== 'win32') {
  env.PATH = `${env.PATH}:/usr/sbin:/sbin`;
}
```

로 감싼다 (기존 macOS 동작은 그대로 보존).

- [x] **Step 5: 테스트 재실행해서 통과 확인**

```powershell
node --test src/agy.test.mjs
```

Expected: PASS

- [x] **Step 6: 커밋**

```powershell
cd D:\Develop\dex-jena-bridge
git add src/agy.mjs src/agy.test.mjs
git commit -m "fix(agy): guard macOS PATH suffix behind platform check for Windows"
```

---

### Task 4: `.env` 설정 (실행파일 절대경로 + 채널·토큰)

**Files:**
- Create: `D:\Develop\dex-jena-bridge\.env` (형이 직접 값 채움, 클로는 자리만 만듦)

**Interfaces:**
- Consumes: Task 0의 봇 토큰·채널 ID, Task 1의 CLI 절대경로
- Produces: 브리지가 읽는 환경설정 완성본

- [x] **Step 1: `.env.example`을 복사해 `.env` 생성**

```powershell
cd D:\Develop\dex-jena-bridge
Copy-Item .env.example .env
```

- [x] **Step 2: `.gitignore`에 `.env`가 이미 포함돼 있는지 확인, 없으면 추가**

```powershell
Select-String -Path .gitignore -Pattern "^\.env$"
```

없으면:

```powershell
Add-Content .gitignore ".env"
```

- [x] **Step 3: 클로가 형에게 채울 항목을 표로 전달** — 값은 클로가 입력하지 않고 형이 직접 `.env` 파일을 열어 채운다:

| 항목 | 값 출처 |
|---|---|
| `DISCORD_TOKEN`(코덱스 봇용) | Task 0에서 발급받은 덱스 토큰 |
| `DISCORD_TOKEN`(제미나이 봇용, 별도 `.env`면 분리) | Task 0에서 발급받은 제나 토큰 |
| `WORK_CHANNEL_ID` | Task 0에서 만든 `#작업` 채널 ID |
| `MEETING_CHANNEL_ID` | Task 0에서 만든 `#회의` 채널 ID |
| `CHAT_CHANNEL_ID` | Task 0에서 만든 `#수다` 채널 ID |
| `CODEX_BIN` | Task 1 Step 7에서 확보한 codex.exe 절대경로 |
| `AGY_BIN` | Task 1 Step 7에서 확보한 agy.exe 절대경로 (`%LOCALAPPDATA%\agy\bin\agy.exe`) |

- [ ] **Step 4: 형이 채웠다고 확인하면, DRY_RUN 모드로 형식만 검증**

```powershell
cd D:\Develop\dex-jena-bridge
$env:DRY_RUN=1; node index.mjs
```

Expected: 토큰·경로가 정상 파싱됐다는 로그, 실제 디스코드 연결은 안 함. 토큰 값 자체가 화면에 출력되지 않는지 확인.

---

### Task 5: 상시구동 스크립트 (Task Scheduler, `MoaAckBot` 패턴 재사용)

**Files:**
- Create: `C:\Users\user\.moa\dex_nai_bridge_daemon.ps1`

**Interfaces:**
- Consumes: Task 4의 `.env` 완성본
- Produces: 재부팅에도 살아남는 상시 프로세스

- [x] **Step 1: 기존 `MoaAckBot` 스크립트를 참고 템플릿으로 읽는다**

```powershell
Get-Content "C:\Users\user\.moa\*ackbot*" -ErrorAction SilentlyContinue
Get-ScheduledTask -TaskName "MoaAckBot" | Format-List *
```

- [x] **Step 2: 데몬 스크립트 작성**

```powershell
# C:\Users\user\.moa\dex_nai_bridge_daemon.ps1
Set-Location "D:\Develop\dex-jena-bridge"
node index.mjs
```

- [x] **Step 3: Task Scheduler 등록**

```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\Users\user\.moa\dex_nai_bridge_daemon.ps1"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit (New-TimeSpan -Hours 0)
Register-ScheduledTask -TaskName "MoaDexNaiBridge" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest
```

- [x] **Step 4: 수동으로 1회 시작해서 확인**

```powershell
Start-ScheduledTask -TaskName "MoaDexNaiBridge"
Start-Sleep -Seconds 5
Get-ScheduledTaskInfo -TaskName "MoaDexNaiBridge"
```

Expected: `LastTaskResult`가 실행 중이거나 0.

- [ ] **Step 5: `MoaMcpGuard`와 같은 방식으로 죽으면 재시작하는 감시도 고려** — 첫 배포에서는 생략하고, 실사용 중 불안정하면 추가한다(YAGNI).

---

### Task 6: 통합 스모크 테스트 — 실제 디스코드 채널에서 확인

**Files:**
- 없음 (수동 검증 태스크)

**Interfaces:**
- Consumes: Task 5까지 전부
- Produces: "덱스·제나가 실제로 반응한다"는 확인

- [x] **Step 1: `#작업` 채널에서 덱스에게 간단한 코딩 질문**을 던져보고, 덱스 봇 이름으로 응답이 오는지 확인
- [x] **Step 2: `#작업` 채널에서 제나에게 간단한 리서치 질문**을 던져보고, 제나 봇 이름으로 응답이 오는지 확인
- [x] **Step 3: `#수다` 채널에서 자유 대화 1회씩 확인**
- [x] **Step 4: 문제 있으면 design.md §7 리스크 표 기준으로 원인 분류** (샌드박스 문제 / 토큰 문제 / PATH 문제 등)
- [x] **Step 5: 전부 통과하면 형에게 완료 보고 + vault에 결과 기록**

---

### Task 7 (후속, 계획에 없던 것): 지휘자 봇이 워커를 부를 수 있게

형이 실사용 테스트하다 발견 — **클로가 디스코드로 덱스·제나에게 일을 시킬 수 없었다.** 이 프로젝트의 설계 목적("클로가 지휘자로서 작업 분배") 절반이 죽어 있던 상태.

**Files:**
- Modify: `src/routing.mjs`, `src/index.mjs`, `.env.example`, `.env.gemini.example`
- Test: `test/routing.test.mjs`

- [x] **원인** — `classifyMessage()`가 `if (isBot) return 'context'`를 `if (!allowed)`보다 **먼저** 검사. 봇 메시지는 허용목록과 무관하게 무조건 참고용 처리라, `ALLOWED_USER_IDS`에 클로를 넣어도 소용이 없었다. 봇끼리 반응해 무한루프 도는 걸 막는 **의도된 안전장치**라 통째로 풀면 안 됨
- [x] **수정** — 가드를 푸는 대신 `TRUSTED_BOT_IDS` 신설, 거기 든 ID만 사람과 동일 취급. 클로 하나만 등록. 목록 밖 봇(덱스↔제나 포함)은 그대로 context-only, `isMe` 검사는 여전히 최우선, 신뢰 봇도 `ALLOWED_USER_IDS`를 통과해야 함(관문 2개). 비워두면 기존 동작과 동일
- [x] **TDD** — 7케이스 추가, 3개 red 확인 후 수정 → routing 20/20 green
- [x] **라이브 검증** — 같은 채널에서 수정 전 클로 메시지는 무응답(01:13), 수정 후 동일 시도에 덱스가 7초 만에 "핑" 응답(01:21). 제나 무반응, 봇 연쇄 없음
- [x] 커밋 `1dbd424`

**부수 발견:** `Stop-ScheduledTask`는 워커(node 자식)를 죽이지 않는다. 고아가 `data*/daemon.pid` 락을 쥐어 다음 기동이 실패하고 빠른실패 5회로 포기 → **재시작이 조용히 영영 안 되는 함정.** 데몬 스크립트에 기동 전 고아 수거를 추가했고, 판별은 반드시 **env 파일 경로**로 한다(`node.exe` 이름으로 잡으면 형의 다른 node를 죽인다).

---

## 관련
[[2026-08-06-dex-nai-multiagent-design]] · [[feedback_autonomy_delegation]] · [[reference_harness_change_ledger]]
