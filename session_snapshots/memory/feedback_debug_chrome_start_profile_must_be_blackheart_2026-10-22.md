---
name: feedback_debug_chrome_start_profile_must_be_blackheart_2026-10-22
description: "디버그 크롬(9222)은 반드시 BlackHeart(Default)로 먼저 띄운다 — Profile 1로 먼저 띄우면 GPT 탭이 info.nanumn에 열려 '로그아웃' 오진"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5616e34e-0a8b-4712-8936-42d261b54e8c
  modified: 2026-10-22T03:39:29.248Z
---

디버그 크롬(C:\chrome-debug-profile, 9222)의 **시작 프로필은 BlackHeart(Default, ssky.park)** 여야 한다. 형 지적 2026-10-22 12:35 ("크롬은 프로필 BlackHeart 로 접속해야지").

- 10-22 08:26 클로가 GSC 작업용으로 크롬을 `--profile-directory="Profile 1"`(info.nanumn)로 처음 띄움 → 그 뒤 아투 발행 GPT 작성기가 CDP `/json/new`로 연 chatgpt 탭이 Profile 1 쪽에 열림 → "메인이 안 떴다" 3회 → qwen 폴백 → 보류. 클로는 이걸 "ChatGPT 로그아웃"이라 오진해 형에게 재로그인을 요청했다.
- 확인: 크롬 재기동(moa_debug_chrome_up.ps1, Default) 후 작성기 판정 함수 그대로 돌려 composer=true, loginBtn=false.

**Why:** /json/new 는 시작 프로필 컨텍스트에 탭을 연다. 같은 user-data-dir 에 프로필 3개(Default=GPT, Profile=유튜브, Profile 1=Blogger·GSC).
**How to apply:** 크롬이 꺼져 있으면 항상 moa_debug_chrome_up.ps1 로 먼저 띄우고, Profile 1 창은 그 뒤 `chrome.exe --profile-directory="Profile 1" <url>` 로 덧붙인다. atz_gsc_index.mjs·atz_desc_auto.mjs 의 openOwnTab 에 이 순서를 넣었다(백업 .bak-20261022b). "GPT 로그아웃" 판단 전에 탭이 어느 프로필인지부터 본다. 관련 [[project_atz_gsc_audit_2026-10-22_followup]]
