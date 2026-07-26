---
name: project_atz_image_overhaul_2026-07-26
description: 2026-07-26 아투(american-todayz) 이미지 전면 개편 — 4축 배치 + Pexels 스톡 도입. 재개용 스냅샷
metadata: 
  node_type: memory
  type: project
  originSessionId: 0a067acf-5754-4274-b604-42fb4d537377
  modified: 2026-07-26T02:00:52.774Z
---

**형 지적으로 시작된 작업: 아투 블로그 이미지가 기사마다 거의 동일하게 나오는 문제 수리 + Pexels 스톡 도입.**

## 근본원인 [확인 — 소스 + 실제 PNG 육안 대조]
`D:\Develop\moa-studio\tools\atz-pipeline\image.mjs`
- `conceptFor()`가 하드코딩 키워드 7분기 + 기본값으로만 프롬프트 선택 → 반도체/무역 기사는 **항상 같은 문장**("stacked shipping containers at a port... semiconductor wafer close-up")
- `sectionConcept()`도 그 base를 재사용 → 한 기사 안 4장도 유사
- 변하는 건 seed뿐 → 구도만 미세 변화, 소재 동일
- 증거: `hero_2026-07-25_45411.png` vs `hero_2026-07-25_48065.png` — 다른 기사인데 둘 다 "항구 크레인+컨테이너+기울어진 검은 칩+자갈"
- 별건: 네거티브 프롬프트(노드 7)가 빈 문자열이라 STYLE의 "no text"가 무력 → 이미지에 `HANEE`, `04` 같은 글자 박힘

## 형이 확정한 방향
1. **4축 분리** ← 핵심 요구. 기사가 애플+중국+반도체+미국정부처럼 여러 겹이면 이미지도 축을 나눠야 한다. 히어로/sec1~3에 축 하나씩, 같은 축 중복 금지.
2. **기업 로고 사용 허용** — "사실적인 내용이면 기업 로고 괜찮다. 우선 사용하고 문제 제기 있으면 보완." (내가 상표권 우려를 냈고 형이 재확인 → 진행). 지키는 선: 왜곡·비방 합성 금지, 후원 오해 배치 금지, 어디에 썼는지 장부 기록(교체 추적).
3. **히어로 사진 형이 직접 선택: Pexels id `14917510`** (밴쿠버 애플스토어 야경, 로고 선명)
   - ★정정 [확인 2026-07-26, YOLO 검출 + 육안]: 이 사진에 **사람이 있다**(persons=8 — 매장 앞 역광 실루엣 행인, 내부 손님). 식별 가능한 얼굴은 없어 편집용으로는 무리 없지만 "인물 없음"은 사실이 아니다. 형 선택이라 그대로 배치했고 경고만 로그에 남긴다.
4. 배치안: 히어로=애플스토어 / sec1=중국 공장(id 27382424) / sec2=SK하이닉스 DRAM(id 38361204) / sec3=백악관(id 129112)

## Pexels 도입 [확인 — 실제 API 호출]
- 키: `D:\Develop\moa-studio\_workspace\american-todayz\.env` 의 `PEXELS_API_KEY` (git 제외 확인). **키 값은 어디에도 기록하지 않음.**
- 3사 비교 결론: **Pexels 1순위**(200req/h·2만/월, 크레딧 달면 한도 해제) > Pixabay(100req/분+24h 캐시 의무) > **Unsplash 비추**(핫링크 강제·다운로드 트리거 API 의무·작가 크레딧+프로필 링크 필수, 기본 50req/h)
- 라이선스: 3사 모두 상업적 사용·애드센스 OK. 2019년 이후 콘텐츠는 재판매/스톡 재배포만 금지.
- **함정 3개 (실측)**:
  - 이미지 CDN이 **python urllib UA를 403 차단** → curl `-A "Mozilla/5.0"` 또는 fetch에 UA 헤더 필요
  - 검색 결과에 **인물 얼굴 혼입**(클린룸 연구원) → 자동 제외 필터 필요. 검색어로는 안 걸러진다
  - 작가명이 **키릴 문자면 cp949에서 깨짐** → 크레딧 UTF-8 처리 필요
  - `apple`만 검색하면 **과일 사과**가 섞인다 → 회사 맥락 단어(store/iphone/macbook) 동반 필수
- 검색어 구성이 품질을 좌우한다: `apple store iphone`(섞음)은 결과가 희석돼 진짜 애플 사진이 안 나오고, `apple store`로 정확히 치면 애플스토어 실사진이 나온다. 내가 이걸 몰라 "애플 사진 거의 없다"고 형에게 오보했다가 정정했다.
- 정책: 스톡 사진엔 `자료사진 · Pexels` 캡션 + 사진 페이지 링크(형이 API 신청서에 약속한 사항)

## 인물 필터 (한시우 구축 [확인])
- **YOLOv8n(COCO person) 1순위** — 모델 `D:\Develop\ComfyUIPtb\ComfyUI\models\ultralytics\bbox\yolov8n.pt`(고정 경로, 재다운로드 없음). 실행은 ComfyUI 임베디드 파이썬(ultralytics·torch·cv2 이미 설치).
- Haar 얼굴검출은 **방진복·마스크 인물을 3/4 놓쳤다** → 1순위로 쓰면 안 된다(폴백으로만).
- ★**검출은 반드시 CPU 고정**(`device='cpu'` + `CUDA_VISIBLE_DEVICES=''`). ComfyUI 가 6GB VRAM 을 물고 있으면 CUDA 초기화가 죽어 프로세스째 실패한다(인물판정 불가 6/6 실측). 같은 이유로 **스톡 수집 → Flux 생성 순서로 단계 분리**.
- 한계: 아주 작게 찍힌 원거리 인물은 놓친다(선박 갑판 승조원 실측).

## 스톡 검색 함정 4종 (한시우 실측·수정 완료)
- **동음이의 기업명**: `apple` 단독 → 전부 과일. 코드가 맥락 단어 자동 부착(`apple store building`) → 진짜 애플스토어. 기업명 20개 맥락 맵 + alt 과일/자연 어휘 재차단.
- **랜드마크 동음이의**: `capitol building` → 쿠바 아바나 카피톨리오·조지아/아이다호 주의사당이 나온다. `washington dc` 자동 부착으로 해결.
- **글자 박힌 피사체**: alt 필터에 복수형 누락으로 여권("travel documents")·계약서("contract papers with Scrabble tiles")가 통과했다. 복수형·contract/papers/scrabble 추가.
- **필터로 검색어가 깎이는 사고**: "search engine" → 'search'가 글자필터에 걸려 'engine' 만 남고 **자동차 엔진 사진** 채택. 정리 후 1단어면 스톡을 포기하고 Flux 로 간다.
- **부정 뉘앙스 회피(형 지시)**: 국가 상징 컷에 매연·폐허·시위가 들어가면 기사에 없는 논조가 생긴다. 기사 제목·본문에 해당 주제가 있을 때만 허용(`articleAllowsNegativeTone`).

## 진행 상태 (2026-07-26 10:10 시점)
- 한시우(media-head-siwoo) 작업 중: `stock.mjs`(신규) `scene-prompt.mjs`(신규 32KB) `reimage-post.mjs`(신규) `person_filter.py`(신규) + `image.mjs`/`run.mjs`/`config.mjs` 수정. **아직 완료 보고 없음 — 12장 육안검증 미확인.**
- 윤서진(cto-seojin) 작업 중: GSC 일일 리포트에 아투 섹션 추가.
- **승인 대기 중인 애플/중국 메모리 기사** 이미지 4장을 새 로직으로 교체해 형에게 재확인받는 것이 다음 관문.

관련: [[reference_flux_image_pipeline_2026-07]] [[reference_image_tool_by_korean_text]] [[feedback_publish_with_images]] [[project_moa_open_threads_2026-07-24]]
