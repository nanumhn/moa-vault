---
name: reference_daily_card_image_date_bug
description: 데일리 사주카드 - (1)이미지↔캡션 어긋난 날짜버그 원인·수정(CLOSED) (2)★콘텐츠 분업 원칙: 카드=심플 한줄 / 인스타캡션=3~4줄 리딩+CTA. "카드 내용추가" 요청은 캡션에 넣기. CTA="What do your own Four Pillars say?"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4e434952-0e4a-4a91-9a85-1b63b25294aa
---

2026-06-30 형이 어제/오늘 데일리 사주카드 두 장을 비교해 잡은 버그. k-saju daily 카드(n8n→디스코드 발송)에서 **캡션 텍스트는 그날 사주대로 바뀌는데 카드 이미지는 캡션과 어긋남**.

## 진짜 원인 (노드 직접 확인으로 확정 — 표현 두 번 정정함)
**핵심 메커니즘(정확):** n8n `Send to Discord` 노드는 디스코드 webhook에 **embed `image.url`로 이미지 '링크'만 박는다(파일 다운로드·업로드 아님).** 확인됨: jsonBody = `embeds[0].image.url = imageUrl`, 워크플로우에 이미지 바이너리 다운/업로드 노드 없음. 그 imageUrl이 수정 전 **날짜 없는 `?fmt=square`** 였다 → 매일 카드가 같은 주소를 가리킴 → 디스코드가 같은 주소=같은 그림으로 처리 → 어제·오늘 카드 이미지가 **둘 다 동일(乙丑)**. 캡션 글자는 메시지에 박제돼 그날 사주로 따로 만들어지니 글만 바뀜.
- 라우트(`saju-studio/src/app/api/og/daily-card/route.tsx`)도 `?d=`를 안 읽고 `kstToday()`로 렌더 → `&d=날짜` 붙여도 응답 바이트 동일(X-Vercel-Cache MISS). 일진 6-29=甲子·6-30=乙丑.
- ⚠️ 표현 주의: "이미지가 나중에 retroactively 바뀐다"는 처음 설명은 부정확. 형이 "다운받아 업로드하는데 어떻게 바뀌냐" 정확히 반박 → 확인해보니 **업로드가 아니라 링크 전달**이었음. 정확한 표현 = "날짜 없는 같은 링크라 디스코드가 같은 그림을 보여줌". 관측 결정증거 = 두 카드 이미지가 서로 동일(둘 다 乙丑).

## 수정 (적용·배포 완료)
- 라우트: `resolveDate(?d=YYYY-MM-DD)` 추가, 있으면 그 날짜 고정·없으면 kstToday 폴백. JSON `cardUrl`에 `&d=날짜` 박음. 커밋 `85d8455` (nanumhn/k-saju main, Vercel 배포 확인).
- n8n 워크플로우 **`tarotDaily00001`**(유일 active, 디스코드 webhook 발송. IG용 tarotDaily00002는 휴면): `Build Caption`의 imageUrl을 `?fmt=square&d=${d.date}`로 정규화.

## 재발 방지 가드 (형 0순위 요청 — 두 겹)
1. 구조적: 이미지가 날짜로 핀 → 캡션과 같은 단일 응답에서 파생, 어긋날 수 없음.
2. 게시 직전 검증 노드 신설: `Build Caption→Verify Caption/Image Match(Code)→Match?(IF)→[true]Send to Discord / [false]Send Alert`. 이미지 URL에 박힌 날짜로 data 재조회해 캡션 사주와 대조, 불일치면 게시 차단+디스코드 ⚠️경고.

## 🔴 후속 사고 + 복구 (2026-07-01) — 어제 수정이 워크플로우를 깨뜨림
07-01 08:00 카드가 **안 나감**(형이 잡음). 원인=어제 Build Caption/Verify 노드 수정이 **결함 2개**를 넣음(첫 번째가 두 번째를 가림):
- **결함 A: 문자열 내 실제 개행** — jsCode의 작은따옴표 문자열이 `\n` 이스케이프가 아니라 진짜 개행문자로 저장돼 SyntaxError. **원인 도구=쉘 heredoc이 `\\n`→실제개행으로 붕괴**시킴. → **★교훈: n8n Code 노드는 쉘 heredoc로 편집 금지. n8n UI 직접 or 이스케이프 프로그램처리 import로만.**
- **결함 B: `new URL()` 사용** — n8n Task Runner 샌드박스는 `URL` 전역 미노출(허용: Buffer/setTimeout/btoa/atob/TextEncoder/FormData 등, URL 없음). A 고쳐도 `URL is not defined`로 또 죽었을 것. 6-29 성공실행엔 new URL 없었음(대조확정). → 두 노드 다 URL 없이 순수 문자열 처리로 교체(출력 동일).
- 복구법: workflow export 백업 → jsCode 교체 → `n8n import:workflow` → `update:workflow --active=true` → **`docker restart n8n`(메모리 재로딩 필수, import가 자동 비활성화함)**.
- 검증: 수동실행 id=43 success, Verify match=true, Send to Discord 2xx, 카드=07-01 丙寅 Yang Fire "Open Up" 라이브 일치. **단 오늘 카드는 08:00 아닌 수동실행 시각(~15:17 KST)에 나감.** 내일부터 08:00 자동(같은 경로 success 증명됨).
- 디스코드 카드는 **webhook(id 1516986...) 채널**로 감 — 형↔클로 대화채널(1501858476362829834)과 다름. 그래서 대화채널 fetch로는 카드 확인 불가, 실행success+webhook 2xx로 검증.

## ★콘텐츠 분업 원칙 확정 (2026-07-08) — 카드=심플 / 캡션=풍성
형이 "카드 문구(> Rest is not a detour today)가 단순해 보인다, 3~4줄 추가하자"고 함. 내가 처음에 **카드 이미지 안에** 3~4줄 리딩+CTA를 다 넣었는데 → 형이 "카드에는 내용을 빼기로 했는데?"로 반려. **형의 진짜 의도 = 카드 이미지는 예전처럼 심플 유지, 부실해 보이던 인스타 캡션(글) 쪽을 풍성하게.** (형이 인스타에 직접 올림 → 캡션이 짧아 게시물이 빈약해 보였던 것.)
- **원칙: 카드 이미지 = 한 줄 body(심플·디자인 우선) / 인스타 캡션 = 3~4줄 리딩 + CTA(내용 풍성).** 앞으로 "카드 내용 추가" 요청 = 캡션에 넣는다, 카드 렌더에 욱여넣지 말 것.
- CTA 확정 문구(형 선택): **`What do your own Four Pillars say?`** (사주 브랜드 정체성 + 호기심 유발. "과연 오늘 당신의 운세는?" 톤 후보 A `So — what does today hold for you?`도 있었으나 형이 원안 채택). 캡션 맨 아래, 링크 앞.
- 구현: route.tsx는 카드 심플 원복(커밋 `3015c52`, resolveDate·?data JSON·READINGS 상수 유지). `?data` JSON이 body(리딩 전문)·essence·cta·cardBody(카드용 한 줄) 분리 제공 → n8n Build Caption이 리딩+CTA를 캡션에 조립. 리딩 30편(오행5×6)은 rule-based, 일진 시드로 매일 로테이션. 원문 `moa-vault/10_Wiki/Marketing/2026-07-08_daily_card_readings.md`.
- n8n 캡션 수정도 안전절차 준수(export→파일에디터→JSON라운드트립 주입→import→docker restart→실엔진 수동실행 검증). heredoc 금지 재확인. active v3=tarotDaily00001. (v4 IG Auto-Post=tarotDaily00002는 inactive, 켤 때 동일 패치 필요.)

## 최종 상태 — ✅ CLOSED (2026-07-03)
자동발송 2회 연속 정상 확인: execution id=44(07-02 08:00 KST) success, id=46(07-03 08:00) success. 형이 07-03 카드 수신 확인. 버그 완전 종결. 관련교훈: 생성≠검증, 수정 후 실제 엔진실행으로 확인해야(라이브 로직만 돌린 게 08:00 엔진 death를 못 잡았음). 재발시 media-head-siwoo.

관련: [[reference_n8n_ig_meta_block]] [[project_audit_2026-06-25_revenue_ignition]] [[feedback_verify_before_alarm]]
