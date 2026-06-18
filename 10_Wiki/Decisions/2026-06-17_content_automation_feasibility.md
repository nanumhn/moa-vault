---
title: 콘텐츠 자동화 파이프라인 기술 타당성 분석 (k-saju.me SNS 자동 생성·게시)
date: 2026-06-17
author: cto-seojin
status: 결정됨 — 형이 로컬 n8n 채택 (2026-06-17). n8n Docker 설치 완료(포트 5678, 볼륨 n8n_data). 내 분석은 자체 하네스 우위였으나 형이 n8n 선택. 자동게시 승인병목/계정정지 리스크는 본문 그대로 유효.
scope: k-saju.me용 인스타/틱톡 카드·숏폼 자동 생성 + 자동/반자동 게시
---

# 콘텐츠 자동화 파이프라인 — 기술 타당성 (k-saju.me)

> 형 질문: "n8n/Make 스타일 '데이터→Router→카드 자동생성→버튼 하나로 업로드, 20분에 영상 10개, 95% 자동화' — 우리도 됨?"
> 한 줄 답: **생성 자동화는 우리 자산으로 거의 다 됨(이미 80% 구현됨). 자동 "게시"가 진짜 병목 — 승인 심사가 핵심 제약이라 솔직히 어렵다. 그래서 v1은 "완전 자동 생성 + 1클릭 반자동 게시"가 정답.**

---

## 1. 우리가 이미 가진 것 (생성은 거의 완성 상태)

| 자산 | 위치 | 파이프라인 역할 |
|---|---|---|
| **OG 카드 렌더러** | `saju-studio/src/app/api/og/keyword-card/route.tsx` | ★핵심. `next/og`로 동적 카드 PNG 생성. **이미 story(1080×1920) / square(1080×1080) / wide(1200×675) 3포맷 지원** — 인스타 피드·스토리·틱톡 슬라이드 그대로 커버. URL 파라미터(`?fmt=&k=&ke=&b=`)로 텍스트만 바꿔 무한 변주. Node runtime 고정(한국어 hang 회피 학습됨). |
| **사주 엔진** | `saju-studio/src/lib/saju/engine.ts` (47KB) | 콘텐츠 "데이터(JSON)" 소스. `generateReading()` / `generateDailyCard()` / `generatePremiumReport()` / `generateTrend()` — rule-based 한·영 텍스트를 구조화 객체로 반환. 카드 슬라이드 텍스트를 코드로 무한 생성 가능. |
| **데일리 카드 페이지** | `saju-studio/src/app/[locale]/daily/page.tsx` | 라이브 기능. 카드 콘텐츠 데이터 그대로 재사용. |
| **서아 TikTok 슬라이드쇼 스크립트 5편** | `moa-vault/10_Wiki/Marketing/k-saju_tiktok_slideshow_batch1.md` | ★게시용 완성 텍스트. 슬라이드별 자막이 표로 정리됨 → OG 렌더러 `?k=&b=` 파라미터에 1:1 매핑됨. **즉, 스크립트→카드 PNG가 거의 코드 한 줄.** |
| ComfyUI (8188, SDXL) | 로컬 | 배경 일러스트/오행 비주얼 사전 생성. **Vercel 라이브는 localhost 접근 불가** → 자산은 사전 배치(빌드타임/스토리지 업로드). 카드 텍스트엔 OG, 분위기 이미지엔 ComfyUI 분업. |
| LM Studio (qwen) | 로컬 | 캡션/해시태그 변주 생성. 동일하게 사전 생성. |
| 하네스 (에이전트/cron) | — | n8n의 "워크플로우 오케스트레이터" 역할을 대체. 스케줄 배치·승인 게이트·보고 루프 내장. |

**결론:** 광고 이미지가 파는 "데이터→Router→카드생성"의 **생성 절반은 우리가 이미 가졌다.** OG 렌더러가 사실상 자체 Bannerbear/Canva API다. 추가 외부 카드생성 SaaS 불필요.

---

## 2. "20분에 영상 10개" 의 실체 — 영상이 아니라 슬라이드쇼

광고가 말하는 "영상 10개"는 대부분 **텍스트 슬라이드쇼**(정지 카드 N장 + 트렌딩 사운드)다. 진짜 편집 영상이 아니다. 그리고 우리 서아 스크립트도 정확히 그 포맷(9:16 텍스트 슬라이드쇼).
- 슬라이드쇼 = OG 렌더러로 PNG 7~8장 뽑기 → 끝. 영상 인코딩조차 불필요(인스타 캐러셀·틱톡 포토 모드는 이미지 업로드).
- 진짜 영상(자막 모션 등)이 필요하면 그때 ffmpeg/Remotion 추가 — v3 이후.
- **즉 "20분 10개"는 우리 스택에서 과장 아님. 생성은 분 단위로 가능.** 문제는 항상 게시다.

---

## 3. 자동 "게시" — 현실적 제약 (★핵심, 정직하게)

### 3-1. Instagram (Meta Graph / Instagram Platform API)
출처: developers.facebook.com/docs/instagram-platform/content-publishing (2025-03-24 업데이트 반영)

| 항목 | 현실 |
|---|---|
| 계정 요건 | **Instagram 프로페셔널 계정(Business/Creator)** 필수. 개인 계정 불가. |
| 앱 | Meta 개발자 앱 + **App Review로 `instagram_content_publish` 권한 승인** 필요. 미승인 앱은 본인 테스트계정에만 게시 가능. |
| 미디어 호스팅 | "media must be hosted on a publicly accessible server" — 게시 시점에 **공개 URL로 이미지/영상이 떠 있어야 함**(Meta가 cURL로 당겨감). → 우리 카드 PNG를 Vercel/스토리지 공개 URL로 올려야. OG 렌더러 라우트가 이미 공개 URL이라 그대로 됨. |
| 포맷 지원 | **단일 이미지 / 영상 / 캐러셀(여러 이미지·영상) = 가능.** "**Reels and stories are not supported**" — 공식 문서 명시. (Reels는 별도 reels 미디어 타입으로 일부 가능하나 story는 API 게시 불가.) |
| 발행 한도 | `/{ig-id}/content_publishing_limit` 엔드포인트로 잔여 확인. **계정당 24시간 25개 게시 제한**(문서화된 캡). |
| 추가 게이트 | Page Publishing Authorization(PPA) 완료 안 된 연결 페이지는 게시 불가. |

→ **요약: IG 자동 게시는 "기술은 됨, 절차가 빡셈". Business 계정 + 앱 + App Review 승인이 며칠~몇 주 병목. 캐러셀(슬라이드쇼) 자동 게시는 가능. 스토리는 API로 불가(수동 또는 Reels로).**

### 3-2. TikTok (Content Posting API)
출처: developers.tiktok.com/doc/content-posting-api-*

| 항목 | 현실 |
|---|---|
| 모드 | **Direct Post**(바로 게시) vs **Upload/Draft**(틱톡 앱 초안으로만 보냄, 사용자가 앱에서 최종 게시). |
| ★승인 병목 | **"All content posted by unaudited clients will be restricted to private viewing mode."** — 미감사(unaudited) 앱이 올린 건 **무조건 비공개(SELF_ONLY)**. 공개 게시하려면 **앱 audit 통과 필수.** |
| 권한/스코프 | `video.publish`(직접 게시) / `video.upload`(초안). 토큰당 **6 req/분** 제한. |
| 포토 모드 | Photo(슬라이드쇼) 게시 엔드포인트 존재 — 우리 텍스트 카드와 정확히 맞음. |

→ **요약: TikTok은 IG보다 더 빡셈. audit 통과 전엔 올려도 비공개라 마케팅 의미 없음. audit는 실제 작동 데모·가이드라인 준수 심사라 시간 걸림. audit 전 차선 = "Upload(초안) 모드" — 자동으로 틱톡 앱 초안함까지 넣어두고 폰에서 1탭 게시.**

### 3-3. 승인 없이 가능한 차선 (반자동 — v1 정답)
승인 병목을 우회하는 합법·안전 루트:
1. **완전 자동 생성** → 카드 PNG + 캡션 + 해시태그 한 묶음을 폴더/대시보드에 떨궈둠.
2. **IG**: Meta **Creator Studio 후속/Business Suite 예약** 또는 승인 후 캐러셀 자동. 승인 전엔 생성물 1클릭 업로드.
3. **TikTok**: **Upload(draft) 모드**로 자동으로 앱 초안에 꽂아두기(audit 불필요, 비공개 제약은 "초안"이라 무관) → 폰에서 1탭 발행.
4. 핵심: **사람이 게시 버튼만 누름. 생성·포맷·예약은 100% 자동.** 이게 광고가 숨기는 진짜 "95% 자동화"의 정직한 버전.

---

## 4. 기성 도구(n8n/Make) vs 자체 스크립트/하네스

| 기준 | n8n / Make.com | 자체 스크립트 + 하네스 (추천) |
|---|---|---|
| 카드 생성 | 외부 Bannerbear 등 유료 노드 필요 | **OG 렌더러 이미 보유 — 추가비용 0** |
| 콘텐츠 데이터 | 외부 DB/시트 연동 | **사주 엔진이 소스 — 직결** |
| 게시 API | IG/TikTok 노드 제공(편함) but **승인 병목은 동일**(노드도 우리 앱 토큰 필요) | 직접 호출. 승인 병목 동일. |
| 비용 | Make 실행당 과금 / n8n 셀프호스팅 시 서버 관리 | Vercel cron·하네스 cron = **사실상 0** |
| 유지보수 | 노코드라 빠른 프로토타입, but 로직 복잡해지면 디버깅 난해 | TS로 버전관리·테스트·재사용. 사주 엔진과 한 코드베이스 |
| 한국 운영 | 클라우드 SaaS, 한국 특화 이슈 적음 | 우리 인프라라 데이터·키 통제 우월 |
| 락인 | 플랫폼 종속 | 없음 |

→ **결론: 자체 하네스가 명백히 유리.** 이미 카드생성·콘텐츠소스·스케줄러를 다 가졌고, n8n을 써도 게시 승인 병목은 똑같이 남는다. n8n은 "우리에게 없는 부품을 빌려주는 도구"인데 우리는 그 부품을 이미 가졌다. **유일한 n8n 고려 사유는 "코드 없이 형이 직접 만지고 싶을 때"뿐.** 그 경우만 별도 검토.

---

## 5. 단계별 로드맵 + 난이도/기간

| 단계 | 내용 | 난이도 | 기간(실작업) |
|---|---|---|---|
| **MVP — 반자동 생성** | 서아 스크립트 5편을 OG 렌더러로 카드 PNG 일괄 출력. 스크립트(JSON)→슬라이드 N장→ZIP/폴더. 캡션·해시태그 동봉. 형이 폰으로 수동 업로드. | 낮음 (자산 재사용) | **1~2일** |
| **v1.5 — 생성 대시보드** | 토픽/오행/날짜 입력 → 카드셋·캡션 미리보기·다운로드. ComfyUI 배경 사전생성 연동. 워터마크 A안(`your daily saju · k-saju.me`) 합성. | 중 | **3~4일** |
| **v2 — 예약/배치 + 초안 푸시** | cron 배치 생성. **TikTok Upload(draft) 자동 푸시**(audit 불필요) → 폰 1탭 발행. IG는 Business Suite 예약 큐로. 데일리 카드 매일 자동 생성. | 중상 (TikTok OAuth/draft 연동) | **4~6일** |
| **v3 — 완전 자동 게시** | IG App Review(`instagram_content_publish`) 승인 + Business 계정 → 캐러셀 자동 게시. TikTok audit 통과 → Direct Post. 발행 한도(IG 25/일)·품질 게이트·보고 루프. | 높음 (**승인 심사가 기간 지배** — 코드보다 심사 대기가 길다) | 코드 5~7일 + **승인 대기 수일~수주(우리 통제 밖)** |

> 기간은 코드 작업 기준. v3의 진짜 비용은 코드가 아니라 **플랫폼 심사 통과**(데모·정책준수 입증)다. 여기서 과장하지 않는다.

---

## 6. 리스크

| 리스크 | 내용 | 완화 |
|---|---|---|
| **계정 정지 (1순위)** | 자동 대량 게시 = 스팸/봇으로 탐지. 신규 계정·동일 패턴 연타 특히 위험. | 게시 빈도 사람급(일 1~3개)으로 제한. 멀티계정 변주(narae 전략)도 사람 페이스 준수. **다크패턴/대량연타 금지(메모리 user_value_first).** |
| **승인 병목** | IG App Review·TikTok audit 미통과 시 v3 막힘. | v2(반자동·초안)로 매출 시작. 승인은 병렬 추진. |
| **API 정책 변경** | IG가 2025-03 reels/story 미지원 명시 등 수시 변경. | 게시 어댑터를 한 모듈로 격리(`isConfigured()` 패턴), 정책 변경 시 그 모듈만 교체. |
| **품질관리** | 자동 생성 카드의 사실오류(특히 POST4 K-pop 일주 단정). | 게시 전 사람 승인 게이트 필수. K-pop은 안전버전만. |
| **사운드 저작권** | 원곡/K-pop 음원 상업사용 위험. | in-app 라이선스 음원/royalty-free만. |
| **Vercel localhost 차단** | ComfyUI/LM Studio 라이브 접근 불가. | 자산 사전생성→스토리지 업로드(메모리 ksaju_live 학습됨). |

---

## 7. 추천 (1순위 시작점)

> ### 🥇 1순위: **MVP "반자동 생성기" 즉시 착수 (1~2일)**
> 서아 슬라이드쇼 스크립트 5편 → OG 렌더러로 카드 PNG 일괄 생성 + 캡션/해시태그 묶음 출력. 형이 폰으로 1클릭 게시.
>
> **이유:**
> 1. **ROI 최고·리스크 최저.** 자산(OG렌더러+엔진+스크립트)이 이미 다 있어 신규 개발 거의 없음. 승인 병목 0. 계정 정지 위험 0(사람이 게시).
> 2. **오늘 만든 콘텐츠를 내일 게시 가능** — 매출 라인(k-saju) 마케팅 즉시 가동.
> 3. v2/v3 자동게시는 이 생성기를 그대로 재사용 — 버린 작업 없음.
>
> **그다음:** 게시가 손에 익으면 v2 TikTok 초안 자동푸시(audit 불필요). IG App Review·TikTok audit는 그 사이 병렬 신청.

**자동게시 완전체(v3)는 "쉽다"가 절대 아니다 — 승인 심사가 기간을 지배한다. 그러나 "자동 생성 + 1클릭 게시"는 우리가 이미 거의 다 가졌고 며칠이면 된다. 그게 현실적 정답.**

---
출처: developers.facebook.com/docs/instagram-platform/content-publishing · developers.tiktok.com/doc/content-posting-api-get-started · .../content-posting-api-reference-direct-post (2025~2026 기준, 2026-06-17 확인)
