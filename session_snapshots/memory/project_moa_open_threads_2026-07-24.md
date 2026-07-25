---
name: project_moa_open_threads_2026-07-24
description: 모아 열린 작업 스냅샷 2026-07-24 — 아투 뉴스 자동화·쇼츠 개선·로고·주간전략 리포트. 형 결정 3개 대기. 재개용
metadata: 
  node_type: memory
  type: project
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-25T17:42:51.018Z
---

2026-07-23~24 세션 열린 작업 스냅샷(세션 리셋 재개용). american-todayz(아투)=Blogger 미국/트럼프 뉴스 블로그 자동화가 이날 메인.

**★ 형 결정 대기 (재개 시 이어서):**
1. 📊 **주간 전략 리포트 톤** — 테스트 발행 완료(웹훅 채널). 형이 톤·항목·깊이 OK/조정 판단 대기.
2. 🎨 **로고 = 확정·반영 완료(2026-07-24).** 엠블럼=gpt_A(독수리), 워드마크=AMERIC★N TODAYZ(별 통합). 쇼츠 상단바 로고 2.2배 확대·BGM 볼륨업(0.28)·아웃트로 CTA 엠블럼↔워드마크 좌우나란히+세로중앙정렬(보이는높이 일치, PNG투명여백보정) 전부 형 승인("잘 되었어 굿"). 쇼츠=완성형 마감(브랜딩·목소리·이미지·BGM·전환·로고). NewsShort.tsx CtaCard line178-213 / shorts_03_web.mp4(6.89MB).
3. ✅ **Blogger API = 자동발행 개통 완료(2026-07-24).** 형 GCP 세팅+client_secret(info.nanumn@ 소유계정, 첫 시도는 koreadart/sskyis 계정이라 403→계정교체) + OAuth 프로덕션 게시(테스트상태면 access_denied+7일만료) → 재인증 성공(token.json refresh_token 저장, .gitignore). blogId=7410844827165474756. **draft 발행 테스트 성공**(postId 6952210974660810699, 샘플글 호르무즈 기사, 라벨5종, status=DRAFT). 형 확인링크=blogger.com/blog/posts/7410844827165474756 → 육안확인 후 공개전환 대기. ★이미지 처리 해결(2026-07-24): Blogger API는 이미지 직접업로드 없음→URL만. moa-studio는 private라 raw 404 → 전용 public 레포 **nanumhn/moa-blog-assets** 신규생성, Flux이미지 push→raw.githubusercontent URL을 본문<img>임베드($0). draft에 이미지4장 삽입완료(update-post.mjs=posts.patch로 초안갱신, 반복캡션제거·AI생성문구 하단1회). 파이프재사용: Flux생성→moa-blog-assets push→raw URL→img임베드. ★남은건 형이 첫글 공개전환 + n8n 파이프라인화(RSS→하루2회생성→디스코드승인→cli.mjs발행+update-post).

**완료된 것 (이 세션):**
- 아투 자동포스팅 **기획안**(검수·형승인), 큐레이션 로직(후보10건 총평→1선), 샘플글+블로그 완성본(이미지4·검수), 로그채널 웹훅.
- **모니터링 3종**: 헬스체크 사이트추가·글수176 기준선+증감추적·GSC(형 등록+sitemap 176 제출 완료).
- **쇼츠 v1→v2**: AI필 개선. 목소리=여성 SunHi+연음교정(자막원문/음성분리, 사전 `tts_samples/liaison_preprocess.py`), 이미지=Pexels 실사 섞기. Remotion 레이어(데이터주도 재사용 `remotion/src/american-todayz/`). 남은 3단계=전환·BGM + 로고 크게(로고 확정 후 v3).
- **주간 전략 리포트**: 매주 월 07:30 cron(세션전용→CLAUDE.md 재등록룰 ③). 웹훅=`_workspace/weekly-strategy/.env`.
- Blogger 발행코드 `tools/blogger-publish/`(bun, authorize/blogger/cli.mjs, 자격증명 대기).

**미결/다음(2026-07-25 형 결정 4건 처리):**
- ① **전자책 PDF 라인** — 형 "심도기획". CSO 기획안 완료(`_workspace/ebook-line/기획안.md`). ★파일럿 추천=**영문 사주 입문 전자책**(k-saju Gumroad 기존활용, 한계비용~$0, 2~3주, 보수적 20~50부/$150~500 슬로우빌드). 서아집필→시우표지→지안검수→Gumroad. **★형 Yes/No 대기**("열자" or "무료 미니가이드만 먼저" 초저리스크 모드).
- ② **서지안 검수게이트** — 형 "부착". cto가 블로그(atz-pipeline)+쇼츠(youtube-publish) 발행전 자동 품질게이트(체크리스트 코드화 qaGate, 카드에 ✅/❌, 미달 보류/반려) 구현중(background).
- ③ **주간 전략 리포트 톤** — 형 승인("톤 좋아, 진행하다 개선"). 액션 없음.
- ④ **Higgsfield 유료전환** — 형 "더 테스트". 실측=무료4크레딧으론 영상불가(최저 kling3_0_turbo 5초=7.5cr, get_cost 실측·생성0·크레딧보존). ★media-head 판단=**아투 뉴스쇼츠 단독으론 지금 No(Ken Burns $0로 충분·AI모션이 뉴스신뢰도 리스크·병목은 유입/배포)**, Yes조건=모아 인플루언서/립싱크 페르소나 라인 가동시(그게 Higgsfield 본령). 형 판단대기(보류 권장).

**★ 유튜브 쇼츠 자동발행 배선(2026-07-24~25, 형 지시 "쇼츠 자동발행도"):**
- 채널=@american-todayz(youtube.com/@american-todayz), Blogger와 **동일계정 info.nanumn@**·**동일 GCP프로젝트 advance-sonar-503415-u0**. 정책=**하루 1건**(블로그2·유튜브1), 중복소재 재업로드 차단. 썸네일·메타데이터는 디스코드 승인카드로 로그.
- 코드 `D:\Develop\moa-studio\tools\youtube-publish\`(bun, 12파일, feat/youtube-publish-wiring 커밋 a97878d): config(youtube.upload+force-ssl 스코프·cat25 News&Politics·ko·private)·authorize·youtube(uploadVideo/setThumbnail/setPrivacy/validateShorts 9:16≤3분/getMyChannel)·metadata·discord(승인카드)·ledger(1일1건+dedup)·publish·whoami. dryrun 8 PASS.
- **★인증 완료(2026-07-25 00:14).** client_secret 설치→`bun run auth`(형 브라우저 허용 info.nanumn@)→token.json refresh_token 저장(authorized_user, 프로덕션앱이라 만료없음, gitignore). `whoami`로 채널 확인=**American-Todayz / @american-todayz**(정확·구독148·영상230), **channelId=UCi-1dhBZ-3Hu2ZMXmV5sPSg**(비밀아님) → **config.mjs CHANNEL_ID 반영 완료**. 배선 100%.
- ★★**아투 첫 유튜브 쇼츠 공개 완료(2026-07-25)**: 비공개테스트→형 "공개 하자"→**공개 전환 완료**. **videoId=3GO2ufomlEA, public, https://youtube.com/shorts/3GO2ufomlEA**. 메타 API실측 확인(제목 "트럼프 호르무즈 경고, 기름값·물가 한국은 #Shorts"·cat25 News&Politics·ko·아동용false·60초·태그10개[american todayz/국제유가/기름값/미국뉴스/아투/유가/이란/트럼프/한국경제/호르무즈]·설명=요약+블로그CTA+구독CTA+출처+해시태그5·자극어0). 쇼츠판정 충족. 원장 published, 오늘 1일1건 슬롯소진, quota~1650/10000. **인증→메타생성→검증→비공개업로드→승인→공개 E2E 배선 실동작 검증 완결**.
- ★**썸네일 부착 완료(2026-07-25)** → **유튜브 쇼츠 자동발행 풀세트 완성.** media-head가 ThumbnailCover.tsx 신규제작(remotion/src/american-todayz/, Root.tsx에 Still AtzThumbnail 1080×1920 등록, CONFIG만 교체해 재사용) → 렌더. **채널 전화인증은 이미 돼있었음**(막힌건 순전히 용량 2.37MB>2MB, JPG 0.41MB 재압축으로 통과). cto `thumbnails.set` HTTP200 items:1 부착확정(videos.list 교차확인). ★유튜브 썸네일 .jpg URL은 항상 1280×720 16:9 컨테이너로 서빙됨(세로원본 실패 아님, API items:1이 authoritative — CDN치수로 오판말것). 형 확인=studio.youtube.com/video/3GO2ufomlEA/edit(즉시), 공개쇼츠는 CDN 수분전파. **용량재발방지**: media-head가 `remotion/scripts/render_thumb.sh`(renderStill→JPG q95→78 백오프 ≤1.8MB 자동) 추가. **인증→대본·메타생성→검증→업로드→공개→커스텀썸네일 E2E 완결**. 메타+태그+썸네일 3종 다음발행부터 자동. quota~1700/10000.
- ★다음(형 제안대기): 정식운영에 서지안 검수게이트 부착. 다음 유튜브 영상은 내일(오늘 1일1건 소진).
- ★★**쇼츠 품질 완전체 구축(2026-07-25, 형 승인 "커밋"):** 형이 어제쇼츠 썸네일 없다 지적→조사결과 **커스텀썸네일은 정상(검색/공유엔 뜸), 유튜브 Shorts탭/피드는 영상 첫프레임 강제사용**이 원인. 해결·구축:
  ① **첫프레임 브랜드 썸네일**: NewsShort 맨앞 0.5초 ThumbnailCover 정지홀드+크로스페이드(scenes.ts COVER 데이터주도, 커버만 교체하면 썸네일+첫프레임 동시변경). Shorts탭서도 강렬. 
  ② **SEO 메타데이터**(강나라 전략→metadata.mjs): buildShortsTitle(키워드앞배치28~42자·금지어가드BANNED_WORDS) / Description **7줄**(검색스니펫2+무슨일/왜중요/한국영향/현황5, 지어내기금지가드) + **블로그딥링크(유입되먹임)**+구독링크?sub_confirmation=1+출처 / Tags 브랜드5+소재동적=12~15 / Hashtags 3~5 #Shorts선두.
  ③ **디스코드 승인카드**(discord.mjs): 썸네일 인라인이미지+제목+7줄설명+태그/해시태그+"발행"안내(블로그카드 UX동일). 아투 로그 웹훅 채널로 발송.
  ④ **쇼츠 발행 체크리스트** 확립(영상9:16/첫프레임썸네일/커스텀썸네일/SEO4종/카테고리25/품질/승인카드) → 카드가 ✅/❌ 표시, 서지안 게이트 기준. **어제쇼츠(3GO2ufomlEA)는 유지(재업로드X, 형지시).** cto가 커밋+nanumhn push 진행중. 발행트리거: `bun run publish -- --file shorts_03.mp4 --meta meta.json --from-article --card --thumb thumb.png` → 형 "발행" → `--live --video <videoId>`. 썸네일 맞춤설정은 채널 전화인증 필요(안돼있으면 그때 안내). 그 후 서지안 검수게이트 부착.

**★ 아투 자동발행 Phase2 진행(2026-07-24):**
- **1단계 E2E 골격 관통 완료(라이브 검증).** `D:\Develop\moa-studio\tools\atz-pipeline\`(bun 무의존, 미커밋). 6모듈+run.mjs: fetch-news(GNews RSS)→curate(큐레이션로직.md JS이식)→generate(qwen 글+품질게이트)→image(ComfyUI Flux→moa-blog-assets push→raw URL)→blogger-publish 어댑터(DRAFT 생성)→discord(승인카드 웹훅). 실제로 RSS60건→큐레이션→qwen글→Flux이미지→Blogger DRAFT 2건→디스코드카드까지 한바퀴 돎.
- 설계결정: stage1은 n8n 아닌 단일 bun 스크립트(로컬 프로세스 체이닝). n8n은 stage2 스케줄/승인루프에 얹기.
- **stage2 완료(A/A로).** MoaAtzPublish 스케줄러 매일 06:00/19:30 KST → DRAFT+디스코드카드까지 무인. 승인발행=형 "발행"→secretary가 `cd tools/atz-pipeline; bun run.mjs --live --slot=am|pm`(또는 --post=id) 실행→공개전환. state.json에 슬롯별 최신DRAFT 기록. 슬롯AM/PM·중복방지(7일+jaccard≥0.6). 커밋 4410198 nanumhn푸시. 스크립트 `C:\Users\user\.moa\atz_scheduled.ps1`. blogger.mjs publishDraft+publish-draft.mjs.
- **정책확정(형): 둘 다 상주.** 로그온작업 `MoaAiServersUp`(스크립트 `C:\Users\user\.moa\moa_ai_servers_up.ps1` 멱등: LM Studio 헤드리스 `lms server start`+qwen로드 / ComfyUI 8188 down시만 기동) + atz_scheduled.ps1이 스케줄 직전 ensure(-Wait240) 이중안전망. ★VRAM 실측(6GB): 강제동시 peak 5985/6144(97%) OOM없이 완주, 실파이프는 순차라 여유. 공존 빡빡→타 GPU앱 동시켜면 위험, 첫며칠 모니터. 무리면 GPT이미지 폴백(단 크롬로그인 필요라 무인06:00 부적합→ComfyUI 1순위, GPT는 보조). ★내일 06:00 첫 무인사이클 관측 예정(로그 atz_pipeline.log·카드), 정상시 서지안 검수게이트 부착. 로그: ai_servers_up.log.
- ★대기중 첫 AM DRAFT=postId 7871487347750707615("트럼프 이 주사로 젊어질수있다"…가십성이라 발행 비추천, 품질개선 백로그 사례). **발행 안 함(보류).**
- ★★**블로그 자동발행 승인루프 첫 라이브 발행 성공(2026-07-25)**: PM슬롯 스케줄러가 DRAFT+디스코드카드 생성 → 형 "발행" → `bun run.mjs --live --post=<id>`로 공개 완료. **첫 공개글=postId 3169901805581651378, https://www.american-todayz.com/2026/07/eu-301.html** ("트럼프 EU구글 과징금 보복관세…무역법301조", 경제/한국관련, score6.43). **스케줄러→큐레이션→생성→DRAFT→카드→형승인→공개 E2E 무인루프 실동작 검증 완결.** ★품질메모: 본문495자로 게이트(700자) 미달(짧음)·단일출처(한겨레) — 형 "차차개선" 하에 발행. 개선백로그=RSS원문 풍부화. ★형 제안대기: 다음발행부터 서지안 검수게이트를 stage2에 부착할지.
- 차차개선 백로그(형 지시 "내용 차차 개선"): RSS원문본문 수집으로 facts풍부화(글 짧은 근본원인)·감점사전에 가십/라이프스타일 보강·qwen 중국어드리프트 완화(모델교체)·슬롯2 하루2건+재발행7일차단. + 서지안 검수는 stage2에서.
- ★**품질개선 2건 완료·형 확정대기(2026-07-25, 커밋 전 uncommitted):**
  ① **블로그 파이프 강화**(형 "내용 풍부·이미지 3~4장 기본"): atz-pipeline **6파일 uncommitted**(fetch-news/generate/image/run/discord/+). fetch-news=구글뉴스 리다이렉트 실기사URL해석+본문추출. generate=원문주입·목표1200~1800(최소1000)·게이트700→1000·**qwen 중국어드리프트 버그수정**(재시도 마지막반환→최선후보선택[한자혼입탈락→게이트→길이]). image=1장→**히어로+섹션3=4장**(각<h3>앞, 고지 하단1회). discord.mjs=**카드 이미지 4장 인라인 갤러리**(멀티embed 같은url공유, 형이 "링크말고 직접보게" 요구—카드가 히어로1장 URL만 보여 1장 오해했던 것 해결. 실제글엔 4장 다 있었음). 형이 카드 4장 육안확인 OK. 이후 형 "1.5배 더 풍부" 요구→목표 1600~1800 상향. **★2번째 개선판 발행 완료(2026-07-25): postId 3177867210472435493, https://www.american-todayz.com/2026/07/eu.html ("트럼프 EU 구글제재 맞불 무역조사"), 본문 1829자(495→3.7배)·이미지4·한자0·가십아님.** 개선사이클(본문풍부화·이미지4·카드인라인·가십중국어가드) 실발행 검증 완결. ★**cto가 6파일 커밋+nanumhn push 진행중**(발행성공 확인). generate 목표 1.5배 상향이 기본값.
  ② **헬스체크 개선**(형 "계정표기+유튜브 추가"): `.moa/healthcheck.config.json`(account필드+youtubeChannels신설)·`moa_healthcheck.ps1`(블로그 이름(계정)표기·[유튜브 발행]섹션 RSS무료파싱). DryRun OK·BOM유지. 계정=info.nanumn@. 유튜브RSS 최근15개=기준선(신규+N/최근업로드N시간전 핵심). **★형 확정시 커밋.** [[reference_moa_healthcheck]]

**이날 배운 것:** [[reference_gpt_image_chrome_system]](GPT는 로고 등 텍스트는 '이미지박스' 프로젝트말고 일반대화에서=지침충돌회피) · [[feedback_discord_formatting]](BOM없는 UTF-8 첨부 모바일 깨짐→본문은 메시지로) · Blogger OAuth Testing+민감스코프=refresh token 7일만료(프로덕션 게시로 해소). 검수게이트가 실질결함 다수 차단(출처불일치·저작권·7일만료).

관련: [[project_blog_ksaju]] [[reference_moa_healthcheck]] [[reference_flux_image_pipeline_2026-07]] [[project_moa_influencer]]
