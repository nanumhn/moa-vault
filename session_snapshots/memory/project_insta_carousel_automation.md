---
name: project_insta_carousel_automation
description: "인스타 캐러셀 자동화(9후킹공식+Higgsfield) — Higgsfield MCP 연결·nano_banana_pro 한글정확도 완벽·2크레딧/장 실측 완료(2026-07-18)"
metadata: 
  node_type: memory
  type: project
  originSessionId: dd59333f-1cb2-4fda-bccd-343506f1d489
  modified: 2026-07-18T09:55:19.498Z
---

2026-07-18 형이 외부 배포 문서 "Claude로 인스타그램 콘텐츠 자동화하기"(@nookitokki 배포, 인스타 캐러셀 자동화 스킬 패키지) 검토 지시. 문서=9후킹공식+복붙프롬프트30+higgsfield-carousel 스킬(키워드→후킹→캐러셀→Higgsfield 이미지→캡션).

**검토 결론:** 우리 이미 80% 보유(이서아 카피·한시우 미디어·데일리카드 n8n). 진행 가능. 수익엔 유입·원가절감·납품상품(인스타 캐러셀 자동화 납품 = 쇼츠 납품의 형제) 레버.

**무료 파트 완료·검수통과(서지안 PASS):**
- 9공식 후킹 프레임워크 → 모아 표준 편입, 가드레일 6조 재무장(지어낸숫자·공포마케팅·미신협박·가짜희소성 금지, 면책톤, 후킹≠낚시)
- k-saju 실전 샘플: 캐러셀 표지 후킹 8(저장각="12 signs vs 518,400")·전체설계1(표지+본문5+CTA, 결제연결)·데일리카드 후킹3
- 페르소나 프리셋 4스위치(형이 짚음): ①기본형 ②업종특화형(납품 재사용) ③톤통일형 ④고급설계형
- 파일: `D:\Develop\Claude_Channels\clo_studio\references\hooking-standard-and-samples.md` + `hooking-framework-9formulas.md`
- 발행 게이트: 카피에 가격($4.99/$7.99)·무료무카드 하드코딩 → 게시 시점 라이브 가격 WebFetch 확인 필수

**방향 확정(2026-07-18 형):** k-saju는 현행 시스템(ComfyUI/n8n) 유지, **모아 인스타 인플루언서 콘텐츠를 Higgsfield 캐러셀 자동화로 신규 운영**. 이 스킬 타깃 니치(비개발자 1인사업자·AI도구)가 모아 인플루언서와 100% 겹쳐 본진. 모아 인플루언서 캐러셀 샘플 **완료·검수PASS**(`moa-influencer-carousel-samples.md`): 모아 build-in-public 페르소나 프리셋 + 표지후킹8 + 저장각 캐러셀("1인사업자 오늘 30분 자동화 3가지", 표지+본문4+CTA, 무료웨비나 깔때기) + 릴스 짧은훅3. 내부닉네임 노출0 확인, 지어낸숫자0. 발행 전 형이 채울 것: [실제 사례] 빈칸 3곳(#2·#7·짧은훅3)·"30분" 실측 확정. 관련 [[project_moa_influencer]].

**✅ 연결·1차 테스트 완료(2026-07-18):** Higgsfield MCP OAuth 인증 성공(계정 ssky.park@gmail.com, **Free 플랜, 크레딧 10**). 세션 재시작 후 `/mcp`→Authenticate 브라우저 승인으로 ✔Connected.

**★ generate_image 호출 함정(중요):** 이 MCP는 스키마상 top-level `model`/`prompt`도 받지만 실제로는 **`params` 안에 `model`·`prompt`·`aspect_ratio`·`resolution`·`count`를 다 넣어야** 통과함(top-level만 주면 "prompt is required" 400). 안전하게 top-level + params 양쪽 다 채우면 OK. 실제 실행 model은 `nano_banana_2`로 매핑됨(별칭). job_status(sync:true)로 결과 URL 회수→curl 다운로드.

**★ nano_banana_pro 실측 결과:** 한글 정확도 **완벽(오탈자 0)** — "오늘의 사주"·"귀인을 만나는 하루"·"k-saju.me" 3개 텍스트 전부 자소 깨짐 없이 렌더. ComfyUI/Grok의 한글 약점 완전 해결. **크레딧 = 2K·4:5·1장당 2크레딧**(10→8 확인), 해상도 1856×2304, 속도 ~20초. 결론: 인스타 캐러셀·데일리카드 텍스트 이미지 엔진 강력 후보. 단 Free 10크레딧=2K 5장뿐 → 양산 시 구독/충전 필요(형 결정 대기). 미측정: 1K 소모량·image-to-image(모아 얼굴자산 참조).

★모아 얼굴자산 2종 확보: 로봇 마스코트 `brand\moa_vibe_logo\C_mascot.png` + 인물 모델시트 `brand\moa_model_sheets\`(10장). 기술레시피 `clo_studio\references\higgsfield-pipeline-notes.md`. 테스트 이미지 로컬: scratchpad\nano_test_saju.png.

**곁가지(k-saju 유입):** 인스타 the.wellness.society_(6.4만·인증 웰니스 큐레이터)가 데일리카드에 "send me this post" 댓글 → 형이 DM "featuring?" 보냄, 답 대기. 무료피처면 원본카드+크레딧요청(@ksaju.daily 태그+k-saju.me) 발송, 유료면 형 판단. 데일리카드 원본은 로컬 미저장(인스타 게시물에만)—향후 n8n 자동백업 고려.

**★크레딧 실측 교정(2026-07-18):** 내가 앞서 적은 "매월 무료 150크레딧"은 **틀린 정보**(팩트체크 실패 — 히그스필드 웹 일반 홍보문구를 MCP에도 적용된다고 오기재). 실제 API 확인: **Free 플랜 = 최초 10크레딧 딱 1회 지급, 월 리필 없음.** transactions에 grant 기록 0. nano_banana_pro 2K = 2크레딧/장 → 10개로 5장이 상한. `$1≈18크레딧`(auto_refill credits_per_dollar=18).
**유료 옵션(전부 카드필수, 형 결정):** ①3일 무료체험 $0→100크레딧(사진50장), 단 3일 후 자동 $49/월 결제(해지=챗에서 "cancel auto-renewal") ②PLUS 연간 $26/월(연결제)→1,000크레딧/월(사진500장) ←가성비추천 ③PLUS 월간 $49/월→1,000 ④ULTRA 연간 $63/월→3,000크레딧/월(+7일 nano_banana_pro 무제한) ⑤ULTRA 월간 $99/월→3,000. 클로 추천=남은 크레딧으로 테스트 마치고 인플루언서 운영 방향 확정 후 ②로. ★★함정: 플랜 화면의 "7-day unlimited/무제한"(Nano Banana 2·Kling 3.0·Seedance)은 **higgsfield.ai 웹에서만** 작동, **우리가 쓰는 MCP(클로드코드)에선 무제한 혜택 못 씀** — MCP에서 실제 쓰는 건 월 base 크레딧뿐(PLUS=1,000/월=nano_banana_pro 500장). 결제 판단은 "무제한 이득"이 아니라 "월 base 크레딧" 기준으로. 형이 웹 pricing 스샷으로 PLUS연간 확인함(2026-07-18), 결제는 방향확정 후로 보류. Higgsfield MCP 연결: `claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp` (계정=형). ★settings.json allowlist에 `mcp__higgsfield`(서버전체) 추가 완료=이미지도구 권한 재요청 안 뜸.

관련: [[reference_media_stack_2026-07]](ComfyUI 한글·얼굴 약점) · [[project_blog_ksaju]] · [[project_daily_card_image_date_bug]] 콘텐츠분업 원칙.
