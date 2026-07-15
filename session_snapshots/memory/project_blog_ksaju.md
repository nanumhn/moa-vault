---
name: project_blog_ksaju
description: blog.k-saju.me 영문 astrology 블로그 — SEO 유입 + 애드센스 신규 라인
metadata: 
  node_type: memory
  type: project
  originSessionId: 0c7866f4-370c-48e7-8670-5ad78d2b0ce0
---

k-saju 영문 astrology 블로그 프로젝트. 2026-06-21 형 지시로 착수.

**목적:** 1순위 k-saju.me 구독 SEO 유입, 2순위 애드센스 보조 수익.
**Why:** 국내 IT 블로그 애드센스(CSO 반려) → 같은 자동화 역량을 k-saju SEO 채널로 전용. 방문 1인당 구독기대가치 $0.36 vs 광고 $0.003 → 약 100배 효율.

**기술 스택:**
- 코드: `D:\Develop\k-saju-blog` (Next.js 16 + Tailwind v4 + MDX, 빌드 통과)
- GitHub: nanumhn/k-saju-blog (로컬 커밋 `3374587`, push 대기)
- 도메인: blog.k-saju.me (서브도메인, 비용 $0)
- 배포: Vercel (NEXT_PUBLIC_SITE_URL=https://blog.k-saju.me)
- DNS: CNAME blog → cname.vercel-dns.com (형이 hosting.co.kr에서 설정)

**콘텐츠 자동화:**
- n8n 매일 08:10 KST → qwen2.5-7b MDX 생성 → GitHub push → Vercel 자동 배포
- 계획서: `moa-vault/10_Wiki/Marketing/blog_ksaju_content_plan_30days.md`
- 카테고리 5개: Korean Saju Basics / Five Elements & Day Master / Daily Saju & Timing / Eastern vs Western / Love·Career·Compatibility
- Day 20(글 20편): 애드센스 신청 마킹

**★2026-07-08 대사건 — SEO 감사·품질게이트·보안 (형 질책→시스템 강화):**
- 형 "블로그 SEO 맞게 되나?" → 서아 전수감사: 형식SEO(canonical/OG/JSON-LD/sitemap)는 탄탄하나 **자동생성(qwen) 글에 사주 용어오류 다발**. 21편 중 13편 수정·push(커밋 26d2431·dc4ec40). 치명 예=오행"오항"오타, 10천간 날조(吉谷文), "사주=인도Jyotish"환각, 대운=일진혼동, 출생시각매핑오류. **손글 4편은 완벽=문제는 자동생성 파이프라인 한 곳.** 감사전문 `moa-vault/10_Wiki/Marketing/2026-07-08_blog_seo_audit.md`(§4에 n8n 프롬프트 개선안).
- **형 질책** "유료서비스에 오타=신뢰훼손, 월2천만 프로젝트에 치명사고, 이래서 고객서비스 하겠나". 근본진단=**사람 산출물엔 지안 게이트 있는데 자동생성엔 발행전 게이트 없어 무검수 라이브**. → 이중방어 구축:
  1. **예방**: n8n blogAutoPost001 "Pick Today Topic" 노드 SYSTEM_PROMPT에 §4 용어사전+키워드전략+SEO규칙 주입(생성품질↑).
  2. **차단**: 발행전 **자동 품질게이트** 신설 — Build MDX→[Validate Quality(Code)]→[IF pass?]→pass:GitHub Push / fail:Discord알림+push스킵. 룰=용어 A1~A11(오항·오행로마자·천간날조·Jyotish·음력·행성·상극방향·일간오정의·대운혼동·시각매핑) FAIL + M1(의료/YMYL) + SEO구조 WARN. **지안 실증검수(자기하네스로 실제 pre-fix qwen원문 10편)로 10/10 차단+좋은글 21/21통과+오탐0 증명.** 게이트가 감사도 놓친 오류 1건 추가적발·수정(what-is-saju "celestial bodies"→920d56c). ★한계=관측된 유형은 다 커버하나 신종은 룰추가 루프 필요(범용 팩트체커 아님).
- **★보안 로테이션**: n8n "GitHub Push MDX"(HTTP Request) 노드에 **GitHub PAT 평문 하드코딩** 발견(기존부터). moa-vault git이나 아직 untracked=외부유출0. 조치=①vault 백업3파일 PAT 마스킹+`90_Backups/` gitignore ②형 새 fine-grained PAT(k-saju-blog Contents R/W) 발급→n8n **Header Auth credential `github-blog-pat`**(Value=`Bearer <PAT>`, 공백1칸필수)로 이전→노드를 credential참조로 전환·평문Authorization헤더제거→읽기전용 GET 200검증→형 옛토큰 revoke. write권한은 다음 08:10 정기발행으로 최종확인. ★교훈=n8n HTTP노드 토큰은 credential로, 평문 헤더 금지.

**현재 상태 (2026-07-03 갱신):**
- ✅ 라이브 **16편**(기존 9 + 신규 7 발행). sitemap 16 반영. n8n 자동생성 매일 08:10 main push 작동.
- 🔴→✅ **2026-07-03 사고+완전수리**: 06-27 이후 자동생성 글들이 라이브에 안 올라감(형이 잡음). 진짜 원인=아래 '운영함정'의 frontmatter 빌드크래시가 **재발**(06-27엔 글만 수리하고 생성기를 안 고쳐 재발). 이번엔 근본까지 수리: ①미발행 7편 제목 따옴표 수리·발행(FF push) ②`src/lib/posts.ts` `matter()` try/catch로 깨진 글 1편이 사이트 전체 못 죽이게(커밋 cf791d8) ③n8n `blogAutoPost001` "Build MDX Payload" 노드가 title/description 항상 따옴표+이스케이프하게 수정(생성기 원천봉쇄, docker restart로 적용). ✅**07-04 08:10 첫 실전 검증 통과**: 새 글 `what-saju-says-about-career-path` 자동생성·커밋(9ac8258)→빌드정상→라이브 200, sitemap 18편, watchdog 블로그항목 전부 🟢. 재발사고 완전 종결. ④오타 k-suju.me→k-saju.me 3편 수리(6e18c62). ⑤통합 watchdog가 '블로그 라이브 미반영(빌드실패)'을 상시 자동 감지하게 구축.
- ✅ **유입 SEO 영어 블로그 2편 수동 발행·라이브·검수통과(2026-06-27)**: `/blog/saju-vs-bazi-vs-chinese-zodiac`, `/blog/how-to-read-your-saju-in-english`. 소스=`moa-vault/10_Wiki/Marketing/k-saju_seo_pack_acquisition_2026-06-26.md` CHANNEL 1A/1B. push 5052151. 본문 UTM(utm_source=blog) 살아있음.
- ⏳ 이미지 5자리 비어있음(글A 3·글B 2) → 시우(media) 후속 커밋. placeholder는 발행시 제거됨.
- ⏳ Reddit 가치글(CHANNEL 2, 본문 링크0) = 형 수동 게시 대기(r/Saju·r/Bazi).

**★2026-07-09 SEO 인덱싱 감사 (나라/강나라) — 유입 0의 진짜 병목 발견:**
- 형 "SEO 검색결과 체크가 스케줄에 있냐"→없음 확인→나라 실측. **결론: blog.k-saju.me 22글이 구글 검색에 사실상 안 잡힘(노출 0 관측).** robots/noindex/사이트맵 전부 정상=기술차단 아님. 콘텐츠도 멀쩡(더 만들 필요 없음).
- **유력 원인 = Google Search Console에 사이트맵 미제출 + 신규도메인 색인 대기 + 레드오션 키워드.** 구글이 글 '발견' 자체를 못 하는 상태. → **이게 애드센스/유입 0의 진짜 첫 단추.**
- **최우선 액션(형 결재 대기): "GSC 등록 + 양 사이트(blog+k-saju) 사이트맵 제출".** 형 구글 계정 필요(소유확인)라 형 클릭+클로 안내(디스코드 셋업 방식). 정확 인덱스 수치도 GSC 연동해야 나옴(WebSearch는 site:연산자 아님).
- 정기 인덱싱 체크 잡 스펙 준비됨(주1회 월 08:00, 인덱스수 증감·커버리지%·안잡힌 새글 알림). GSC API 연동 시 정확수치 자동수집. cto 구현 대기.
- **★2026-07-09 GSC 병목 해결 완료**: 진짜 원인=형이 GSC에 **k-saju.me만 속성 등록+사이트맵 제출**했고 **blog.k-saju.me는 별도 서브도메인이라 미등록**(GSC는 서브도메인=별개 사이트 취급)→blog 사이트맵 미제출→22글 미발견. 조치=blog.k-saju.me를 URL접두어 속성으로 추가, HTML 메타태그 인증(서진이 layout.tsx metadata verification.google에 심고 배포·라이브 렌더 확인, 커밋 d26f7b4)→형 확인 통과→**blog.k-saju.me/sitemap.xml 제출 완료**. 이제 구글 색인 대기(신규도메인이라 며칠~몇주). 확인=GSC 페이지(색인)/Sitemaps 리포트. ★교훈=서브도메인은 GSC 별도 등록 필수.
- **★2026-07-14 GSC API 서비스계정 연동 완성 — 색인 모니터링 정확값 전환**: 형이 구글 클라우드 서비스계정 생성(STEP1~6)→JSON을 `C:\Users\user\.moa\gsc_service_account.json` 배치(클로가 Downloads에서 mv, 비밀키 미열람·client_email만 추출=`moa-sc@moa-search-console.iam.gserviceaccount.com`)→GSC 두 속성(k-saju.me·blog.k-saju.me)+인스타에 서비스계정 Restricted 권한부여. 지원(data-finance)이 배선 마무리: ①웹훅=기존 모아 헬스체크 웹훅이 `healthcheck.config.json`에 **있었으나 UTF-8 BOM 때문에 JSON.parse 조용히 실패**하던 것→BOM제거(`/^﻿/`) 폴백으로 재사용(형 개입0, 새 비밀0). ②인스타 `sc-creator-profile:` 소셜속성=Search Analytics API 미지원(400 INVALID_ARGUMENT)→선제 스킵·"미지원" 표시(Meta Graph API 영역, 형 결정 보류). **실측 데이터(07-11 기준·구글2일지연): k-saju.me 색인12p/노출1/클릭0/순위44.0, blog 색인29p/노출12/클릭0/순위60.1. 클릭0=D+n 수집초기 정상(에러 아님).** MoaSearchConsole 잡(매일 09:05 KST) 디스코드 정상 발송 확인. 수정=`search_console_report.mjs`(웹훅 폴백 L186·인스타 폴백 L259~), 산출=`search_console_last_report.txt`. ★교훈=PS5.1 저장 config는 BOM 때문에 mjs JSON.parse가 조용히 깨진다(BOM제거 필수). 인스타 실지표는 GSC 아닌 Meta Graph API. 다음=순위 44~60위(4~6페이지)라 랭킹 작업이 다음 단계.
- **★2026-07-14 GSC 색인 진행 실측 + 색인 가속 요청**: 형 "k-saju 구글 검색 모니터링 어떻게 되냐"→나라+클로 GSC 스크린샷 실측. **사이트맵 2개 다 상태=성공**(k-saju.me 발견12·blog 발견29, 합 41 URL). 근데 개요 색인생성=**색인1/미색인1**로 표시. `k-saju.me/input` URL검사=**"발견됨-현재 색인 안됨" + 최근크롤링 "해당없음"**(구글이 발견만·크롤 전). blog.k-saju.me 홈은 URL검사="Google에 등록되어 있음"(색인완료). **판정=기술고장 아님, 신생도메인 정상 초기 크롤/색인 지연 + GSC개요 집계랙**(site: 실측선 이미 여러 글 색인됨=개요 수치가 stale). 조치=형이 **URL검사→색인생성요청**으로 우선순위 10개(수익 4: 메인/input/daily/trends + 블로그 상위글 6) 밀어줌, "등록됨"은 패스·"미색인"만 요청, **10건 확인·요청 완료**. 다음=3~5일 뒤 색인수 재확인→두자릿수 오르면 랭킹작업(롱테일/내부링크/브랜드혼동 k-saju.co.kr). ★교훈=성급한 추정("GSC 미등록") 대신 실제 GSC 화면 확인이 정확했다. 관측(스크린샷·site:)/추정 분리. 색인 안 된 페이지는 순위 자체가 없으니 "색인 가속"이 랭킹보다 선행.
- **★2026-07-09 블로그 개선 2건**: ①k-saju.me 유입 링크 전부 새 창(target=_blank rel=noopener) — 누락 2곳(히어로·헤더) 수정+본문은 MDX a오버라이드 일괄, 커밋 29d2b32. ②번호형 페이징 신설(페이지당 12글, 홈=1p·/blog/page/2, rel next/prev+canonical, 무한스크롤X SEO친화), 커밋 38c0924.
- ★통합 현황(대시)보드는 형이 백로그로 지시(추후 묶음릴리즈): 시스템헬스+SEO+수익+커뮤니티+자동화 한 화면.

**★운영 함정 (2026-06-27 발견):**
- **배포 브랜치는 `master` 아니라 `main`** (origin/HEAD→main, n8n도 main에 포스팅). master에 push하면 라이브 반영 0 + n8n 글 유실 위험. 항상 main.
- **n8n LLM(qwen)이 frontmatter 불량 mdx를 생성하면 사이트 전체 빌드가 조용히 깨짐**(무따옴표 콜론 title 등 → YAML 파싱 실패 → Vercel 배포 무음 실패, 라이브가 마지막 정상커밋에 얼어붙음). ✅ **2026-07-03 근본수리 완료(위 참조)**: posts.ts try/catch(깨진 글만 skip, 빌드 안 죽음) + n8n Build 노드 title/description 강제 따옴표. **★교훈: 자동생성 콘텐츠는 '잡이 돌았다'로 끝내면 안 됨 — 생성물이 깨져 배포가 조용히 실패할 수 있으니 반드시 '라이브 실제 반영'까지 확인해야**(watchdog 감시항목에 포함). 06-27엔 산출물만 고치고 생성기를 안 고쳐 재발했음 = 근본수리 안 하면 반복.

**How to apply:** 다음 세션에서 "블로그" 언급 시 이 맥락 참조. 발행은 main 브랜치, frontmatter 정합 먼저 확인.
