---
name: project_gsc_atz_report_2026-07-26
description: 2026-07-26 GSC 일일 리포트에 아투(american-todayz) 섹션 추가 완료 — 179p 산출 근거와 sitemap 과다표기 함정
metadata: 
  node_type: memory
  type: project
  originSessionId: 0a067acf-5754-4274-b604-42fb4d537377
  modified: 2026-07-26T02:01:43.688Z
---

**형 지시로 매일 09:05 구글 검색 리포트에 아투를 추가했다. 검수 4회 반려 끝에 PASS.**

## 결과 (2026-07-27 09:05 첫 발송 예정)
```
④ 아투 american-todayz.com
  색인: sitemap 179p (과거제출 4건 제외) / 노출페이지 0p
  노출 0 · 클릭 0 · CTR ― · 순위 ―
  기준일 … · 연결 OK(D+2) · 노출 아직 0 — 색인/유입 대기 단계
  속성 sc-domain:american-todayz.com
```
파일: `C:\Users\user\.moa\search_console_report.mjs` / `search_console.config.json`(`extraSites[]`) / `SEARCH_CONSOLE_SETUP.md`

## ★ 핵심 함정 — GSC sitemaps API 단순합은 과다표기다
`sitemaps` 응답을 그냥 더하면 **236p**가 나오는데 실제 글은 179개다. 내역:
```
179  www…/sitemap.xml                  2026-07-23 제출  ← 현행
 26  www…/feeds/posts/default?orderby   2025-04-27      ← 같은 글 중복
 26  www…/feeds/posts/default?alt=rss   2025-04-17      ← 같은 글 중복
  3  blog.american-todayz.com/feeds     2025-04-07      ← 글 0개 빈 블로그
  2  blog.american-todayz.com/sitemap   2025-04-04      ← 같은 빈 블로그
```
- **해법: `lastSubmitted`가 `staleSitemapDays`(90) 초과면 제외.** 잔재가 전부 450일 이상이라 정확히 179가 나오고 빈 블로그도 자동 제외된다.
- **`lastSubmitted` 없거나 파싱 불가 → "현행"으로 포함.** 과다표기를 고치려다 과소표기로 넘어가는 게 더 나쁘다.
- 폐기안: "호스트별 최대 사이트맵만 채택"(→182p). 원리적으로도 한 호스트에 URL 집합이 다른 사이트맵 둘이 있으면 작은 쪽을 버려 과소표기가 된다.
- k-saju는 stale 0건(합계 54 = 현행 54)이라 **같은 필터를 통일 적용해도 ①② 출력이 바이트 불변**이다 → 특례 분기 없이 단일 경로 유지 가능.
- 사이트맵 응답의 `indexed`는 5건 전부 0으로 온다(구글이 안 채움). **코드는 이 필드를 안 쓴다** — 쓰면 "색인 0" 오보가 된다.

## 아투 GSC 속성 (혼동 주의)
- 속성이 **2개 공존**한다: `sc-domain:american-todayz.com`(권한 있음, 사용 중) + `https://www.american-todayz.com/`(권한 없음). 형 화면에 보이는 것과 서비스계정에 붙은 것은 다르다 — 반드시 `sites.list`로 확인할 것.
- 서비스계정 `moa-sc@moa-search-console.iam.gserviceaccount.com`, 권한 `siteRestrictedUser`.
- **형이 할 일은 없다.** DNS TXT·속성 추가 불필요. GSC가 "도메인 속성을 추가하세요" 권장사항을 띄우지만 이미 있으므로 무시.

## 색인 실태 [확인 — URL Inspection API]
- robots.txt 정상(`Disallow: /search`만). GSC "robots.txt 차단 52p"는 **라벨/검색 페이지**이고 막는 게 맞다.
- 홈·`/2026/07/blog-post.html`은 **색인됨**, `eu.html` 등은 "발견됨-크롤 대기". 신규 도메인 크롤 예산 문제이지 설정 오류가 아니다.
- non-www에 색인이 없는 것도 정상(www로 리다이렉트 → 구글은 최종 목적지만 색인).

## 남은 별건
1. `색인:` 라벨이 실제로는 제출 수 → ①②까지 걸리는 형 리포트 형식 변경이라 형 통보 후 진행 (미착수)
2. **정리 작업 — 형이 직접 수행 대기 (2026-07-26 절차 전달 완료)**

### 정리 작업 조사 결과 [확인]
**옛 사이트맵 4건 삭제 = 안전. 삭제 권고.**
- 색인 손실 없음 — 구글 공식: "사이트맵을 삭제해도 구글은 그 사이트맵도 URL도 잊지 않는다. 크롤을 멈추려면 robots.txt가 필요" (support.google.com/webmasters/answer/7451001)
- feeds에만 있고 `sitemap.xml`에 없는 글 URL **0개**(179 = 전체 글 수, 100% 커버). feeds는 최신 25개+홈만 노출
- Blogger 자동 재제출 없음 — robots.txt엔 `sitemap.xml`만 선언. GSC 사이트맵 리포트는 **직접 제출/API 제출분만** 표시(robots.txt 발견분은 안 뜸) → 리포트에 있다 = 사람이 2025-04에 제출한 것
- 되돌리기 가능(재제출). 실익은 GSC 화면 정리뿐이나, 빈 블로그를 지우면 `blog.` 사이트맵 2건이 "가져올 수 없음" 오류로 상시 표시되므로 **블로그 정리 → 4건 일괄 삭제** 순서가 낫다

### ★★ 형 DNS 작업 시 절대 금지 (치명적)
```
apex TXT  google-site-verification=P-bdR_2…  ← sc-domain 소유확인. 지우면 아투 리포트 전체 사망
www       CNAME → ghs.google.com             ← 본체
apex      A 216.239.32.21/.34.21/.36.21/.38.21 ← 본체 naked 리다이렉트
```
지울 것은 `blog` CNAME 한 줄뿐. www와 blog는 별개 레코드라 상호 영향 없음.

### 빈 블로그 정리 순서 (도메인 해제를 먼저)
1. Blogger에서 **"아메리칸 투데이 블로그"**(본체는 "아메리칸 투데이") 선택 → 설정 → 게시 → 맞춤 도메인이 `blog.`로 시작하는지 확인 후 해제
2. 설정 → 블로그 관리 → 삭제. **"Permanently delete" 금지**(일반 Delete는 Trashed blogs에서 Undelete 가능, 영구삭제는 URL 재사용 불가). 복구 기간 일수는 공식 문서에 없음 [확인 불가]
3. DNS에서 `blog` CNAME 삭제 → 즉시 `www.american-todayz.com` 정상 확인
4. GSC 사이트맵 4건 삭제
5. 검증: `bun run search_console_report.mjs --dry` → ④가 **179p 그대로**여야 정상(이미 필터로 빠져 있어 숫자 불변이 맞음)

## 교훈 (세 사람 모두에게서 같은 유형이 나왔다)
**확인할 수 있는 것을 확인하지 않고 단정했다.** 파일 하나 열거나 API 한 번 치면 끝날 일이었다.
- 나: 폐기 지시를 명시적으로 취소하지 않고 새 지시를 얹음 → 낡은 안으로 4.5KB 구현됨 / 검수관 판정을 검증 없이 받아 담당자를 질책 / 형 스크린샷만 보고 속성 종류 단정
- 검수관: 로그의 `Unable to connect`만 보고 "형 채널 발송 near-miss"로 단정(실제로는 로컬 discard 포트) / 이미 고쳐진 스냅샷으로 반려
- 담당자: 자기 판단을 "검수관 요구"로 잘못 인용
→ `completion-gate`에 추가하기로 한 체크 2개 (아직 미반영):
1. **코드·config·문서를 한 세트로 갱신했는가** — 이번에 문서가 두 번 뒤처졌고 둘 다 형이 읽는 매뉴얼이 실제 동작과 어긋나는 형태였다
2. **제출물 안에 자기모순이 있는가** — 판정 규칙 형태: *제출 메시지·주석·문서에 산출물 수치를 부정하거나 한정하는 문장("엄밀히는 X", "남은 오차", "다만 정확하지는 않다")이 있으면 자동 반려. 담당자가 스스로 적은 한정어는 결함의 자백이다. 한정어가 사라지도록 산출물을 고치거나, 한정어가 맞다면 산출물을 그 값으로 바꾼다.* 182p 건은 제출 메시지의 "엄밀한 현행은 179p" 한 줄로 즉시 걸린다.

관련: [[reference_moa_healthcheck]] [[feedback_qa_gate_before_report]] [[feedback_verified_facts_only]] [[project_atz_image_overhaul_2026-07-26]]
