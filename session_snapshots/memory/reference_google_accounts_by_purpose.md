---
name: reference_google_accounts_by_purpose
description: 크롬 디버그 프로필의 구글 계정 2개 용도 구분 — ssky.park=GPT 이미지 / info.nanumn=아투 소유
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-27T06:56:51.683Z
---

`C:\chrome-debug-profile` 안에 **크롬 프로필이 2개** 있고, 각각 다른 구글 계정이다 (형 확인 + 실측 2026-07-27).

```
Default     | BlackHeart          | ssky.park@gmail.com     →  GPT 이미지 생성 작업용
Profile 1   | 박기효.SMDsolutions   | info.nanumn@gmail.com   →  아투(american-todayz) 소유 ★
```

형 화면 기준: **작업표시줄 크롬 아이콘 2개 중 우측 = info.nanumn, 좌측 = ssky.park** (형 확인 2026-07-27).

**아투 브라우저 작업(Blogger 레이아웃·테마·위젯)은 반드시 `Profile 1` 창에서 해야 한다.** Default 창에서 열면 `blogger.com/blog/layout/7410844827165474756`이 **다른 블로그(7948556767907504863, koreadart)로 조용히 리다이렉트**되고, 그 계정 블로그 목록에는 아투가 아예 없다.

## ★계정이 막는 것과 안 막는 것을 혼동하지 마라
```
글 생성·수정·라벨·발행   Blogger API 토큰       계정 무관, 항상 됨
테마·레이아웃·위젯 편집   브라우저 로그인 필요    ← 여기만 Profile 1
```
2026-07-27 목차 작업에서 Default 창이 막히자 "계정 때문에 못 한다"로 갈 뻔했는데, **하려던 일(목차 CSS)은 글 본문에 `<style>`을 넣어 API만으로 끝났다.** 브라우저가 막히면 **그 일이 정말 브라우저를 요구하는지부터** 되물어라 — 테마를 안 건드리는 우회가 오히려 안전할 때가 많다(테마는 외부 CDN 기반이라 업데이트 시 되돌아간다).

## ★함정 — `authuser`를 바꿔서는 안 된다. 프로필을 바꿔야 한다
2026-07-27에 `?authuser=0/1/2/3`을 전부 두드렸는데 넷 다 같은 리다이렉트였다. **크롬 프로필은 쿠키 저장소가 아예 분리돼 있어서, Default 프로필 안에서는 authuser를 뭘로 줘도 info.nanumn 세션에 닿을 수 없다.** 진입 성공 시 URL에 authuser 파라미터가 아예 안 붙는다(`?pli=1`만).

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
