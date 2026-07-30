---
name: reference_google_accounts_by_purpose
description: 구글 계정별 자산 소유 + ★authuser 규칙 정정(2026-07-30) — 프로필에 로그인된 계정 중에선 authuser가 먹는다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-30T00:42:31.640Z
---

`C:\chrome-debug-profile` 안에 **크롬 프로필이 3개** 있고, 각각 다른 구글 계정이다 (2026-07-30 `Preferences` 전수 확인).

```
Default     | BlackHeart          | ssky.park@gmail.com     →  ★ChatGPT(글쓰기·이미지)
Profile     | 나눔엔               | nanumn.com@gmail.com    →  유튜브 3채널(나눔엔·모아 들을래·해의 이름)
Profile 1   | 박기효.SMDsolutions   | info.nanumn@gmail.com   →  ★Blogger 4개 · 애드센스 · 아투 유튜브
```

## ★★ 크롬을 띄울 땐 반드시 `--profile-directory` 를 지정한다

**안 주면 "마지막에 쓰던 프로필"로 열린다.** 2026-07-30 이것 때문에 반나절을 잃었다 —
프로필을 안 주고 띄웠더니 `Profile`(나눔엔)로 열렸고, 거기서 ChatGPT를 보니 로그아웃 상태라
**형이 이미 로그인해 두셨는데도 "로그인 안 됐다"고 형에게 대여섯 번 요청했다.**
형의 "GPT 쓰려면 사용자 선택에서 BlackHeart를 선택해야 해" 한마디로 풀렸다.

```bash
# ChatGPT 작업
chrome.exe --user-data-dir=C:/chrome-debug-profile --profile-directory=Default        "https://chatgpt.com/"
# Blogger·애드센스 작업
chrome.exe --user-data-dir=C:/chrome-debug-profile --profile-directory="Profile 1"    "https://www.blogger.com/..."
```

**한 인스턴스에 여러 프로필 창이 동시에 뜰 수 있고, CDP 9222는 그 창들의 탭을 전부 보여준다.**
그래서 "탭마다 계정이 다르게 보이는" 현상이 생긴다 — 계정이 섞인 게 아니라 **창(프로필)이 섞인 것**이다.
작업 전 판정법: 그 탭에서 계정 표시를 읽어 목표 프로필인지 확인한다.

형 화면 기준: **작업표시줄 크롬 아이콘 2개 중 우측 = info.nanumn, 좌측 = ssky.park** (형 확인 2026-07-27).

**아투 브라우저 작업(Blogger 레이아웃·테마·위젯)은 반드시 `Profile 1` 창에서 해야 한다.** Default 창에서 열면 `blogger.com/blog/layout/7410844827165474756`이 **다른 블로그(7948556767907504863, koreadart)로 조용히 리다이렉트**되고, 그 계정 블로그 목록에는 아투가 아예 없다.

## ★계정이 막는 것과 안 막는 것을 혼동하지 마라
```
글 생성·수정·라벨·발행   Blogger API 토큰       계정 무관, 항상 됨
테마·레이아웃·위젯 편집   브라우저 로그인 필요    ← 여기만 Profile 1
```
2026-07-27 목차 작업에서 Default 창이 막히자 "계정 때문에 못 한다"로 갈 뻔했는데, **하려던 일(목차 CSS)은 글 본문에 `<style>`을 넣어 API만으로 끝났다.** 브라우저가 막히면 **그 일이 정말 브라우저를 요구하는지부터** 되물어라 — 테마를 안 건드리는 우회가 오히려 안전할 때가 많다(테마는 외부 CDN 기반이라 업데이트 시 되돌아간다).

## ★`authuser` 규칙 — 2026-07-30 정정 (예전 표현이 나를 잘못 이끌었다)

**정확한 규칙: `authuser`는 "그 프로필에 이미 로그인된 계정들" 중에서만 고른다.**

- 목표 계정이 그 프로필에 로그인돼 **있으면** → `authuser=N`으로 닿는다. **된다.**
- 로그인돼 **있지 않으면** → authuser를 뭘로 줘도 못 닿는다. 그때만 프로필을 바꿔야 한다.

2026-07-27에 "authuser는 소용없다"로 적어둔 건 **그날 Default 프로필에 ssky.park 하나만 로그인돼 있었기 때문**이지, authuser가 원리적으로 무력해서가 아니었다.

**2026-07-30 실측 — 같은 프로필 안에서 계정이 갈렸다:**
```
adsense.google.com            → "nanumn.com@gmail.com은 애드센스 계정이 없습니다"  (authuser=0)
adsense.google.com?authuser=1 → pub-6268517976287068 정상 진입 ✅              (info.nanumn)
```
이날 `C:\chrome-debug-profile` Default 에는 **nanumn.com(=0)과 info.nanumn(=1)이 동시에** 로그인돼 있었다. 옛 메모대로 "프로필을 바꿔라"만 믿었으면 이 한 줄짜리 해결을 놓쳤다.

**판정 순서:** ① 그 프로필에 목표 계정이 로그인돼 있나(`myaccount.google.com` 또는 서비스의 계정 전환 화면) → ② 있으면 authuser 돌려보기 → ③ 없으면 그때 프로필 교체 or 로그인 요청.

**서비스별로 기본 계정이 다를 수 있다** — 같은 프로필에서 Blogger는 info.nanumn을, 유튜브는 nanumn.com을 잡았다.

**ChatGPT는 별개다** — openai.com 쿠키라 구글 로그인과 무관하고, 구글 계정을 추가해도 기존 세션이 밀려나지 않는다.

CDP에서는 Profile 1 창이 **별도 target**으로 잡히므로, 그 target을 선택해 이동하면 열린다.

**Why:** 2026-07-27 재부팅 후 세션이 `ssky.park`로 돌아와 아투 레이아웃 진입이 막혔다. 리다이렉트가 조용해서 "권한 없음"인지 "계정 다름"인지 구분이 안 됐고, 원인 확정에 2시간 가까이 소요됐다. 관련: [[reference_chrome_debug_setup]]

## ★프로필을 지정해 직접 띄우는 법 (형 호출 불필요)
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir=C:\chrome-debug-profile \
  --profile-directory="Profile 1" \        # ← 이 한 줄이 핵심. 없으면 Default(ssky.park)로 열린다
  --no-first-run --no-default-browser-check \
  "https://www.blogger.com/blog/layout/7410844827165474756"
```
프로필 목록 확인: `C:\chrome-debug-profile\Local State`의 `profile.info_cache` (PowerShell `ConvertFrom-Json`).

**형 손이 필요한 경우는 로그인 자체(세션 만료)뿐이다.** 세션이 살아 있으면 위 명령으로 내가 직접 연다.

**How to apply:** 재부팅·세션 리셋 후 아투 브라우저 작업 전에 **어느 크롬 프로필 창인지부터 확인**한다. 위 `--profile-directory`로 띄우거나, 이미 떠 있으면 CDP target 목록에서 Profile 1 창을 골라 이동하면 된다. 판정법 — Blogger 홈 블로그 목록에 아투가 보이는가. 안 보이면 **authuser를 돌리지 말고 프로필을 바꿔라**(그 삽질이 원래 2시간의 정체다). 계정 로그인 자체가 필요하면 형에게 요청(직접 로그인 금지).
