---
name: project_eco_sort_game
description: "Eco Sort — 쓰레기 분리수거 캐주얼 퍼즐 게임(버스잼류), 형 신규 아이디어 2026-07-20. AOS 스토어 출시 목표"
metadata: 
  node_type: memory
  type: project
  originSessionId: 52eac969-0ff4-429c-8e76-f1eb7d3b847a
  modified: 2026-07-20T05:37:47.763Z
---

**Eco Sort (가제)** — 형이 2026-07-20 "버스잼/버스소트류 퍼즐게임 만들어보고 싶다"며 시작한 신규 게임 프로젝트.

**컨셉:** 버스잼 메커닉(색깔 매칭 정렬) + **쓰레기 분리수거 테마**(형 선택 — 공익·환경·교육 명분). 색깔 쓰레기를 맞는 수거 오브젝트로 탭해서 정리, 다 치우면 클리어. 맨 앞 아이템만 탭 가능(순서 퍼즐성), 색 안 맞으면 임시 보관칸(6칸) 대기(꽉 차면 실패).

**차별점:**
- **교육 훅:** 쓰레기가 진짜 사물(페트병=플라스틱🟦/신문지=종이🟨/유리병=유리🟩/캔=캔·고철🔴/바나나=일반·음식물🟫) → 놀면서 배움. 부모 타겟·스토어 심사·바이럴 유리.
- **수거 오브젝트 3종(형 요청)** 스테이지 테마로 분기: 분리수거함(집앞)·그물망(바닷가, 물에 뜬 쓰레기 건지기)·분리수거 트럭(거리, 꽉 차면 출발).
- **★최대 강점 = 에셋 무한 무료 생성**(시우 로컬 ComfyUI). 남들은 스톡/외주, 우린 스킨·테마 공짜 양산.

**현황(2026-07-20 프로토 완성):**
- 코드: `D:\Develop\eco-sort` (순수 canvas·의존성0·서진 제작). 실행: `index.html` 더블클릭 or `bun serve.js`→localhost:5178(폰=PC아이피:5178 같은와이파이). 시스템 node 없어 bun 사용. 디버그 `?auto=1&stage=N`, `ECO.autoPlay()`.
- 구현: 코어루프(탭→분리→수거함 5개차면 수거→클리어)+임시보관칸+콤보/점수, 4스테이지(집앞 함/공원 트럭/바닷가 그물망/번화가 트럭). 솔버테스트로 4스테이지 클리어가능 증명+런타임에러0.
- 에셋: 시우 12종 전량 생성 완료(로컬 ComfyUI SDXL+rembg, **직접비 $0**), `public\assets\`에 asset-map 파일명대로 저장→플레이스홀더 자동교체 완료. 쓰레기5(귀여운 캐릭터페이스)+수거3(bin 중립/net/truck)+배경4(home/park/beach/street). 원본·컨택시트=`assets_raw\`. asset-map 원본=`src\core.js` ASSETS + `public\assets\README.md`.
- 형 플레이 피드백 대기 중(손맛·난이도·아트톤).

**다음 스텝:** 형 피드백 → 사운드(탭/수거/클리어)+별점·제한탭 목표 → 스테이지 6~8개 확장 → **Capacitor 래핑→안드로이드(AOS) 빌드→Play스토어**(개발자계정 $25 형). 수익=스테이지간 광고+힌트/되돌리기 리워드광고+광고제거 IAP(광고/과금은 프로토 미포함, 나중). iOS는 AOS 검증 후(애플 $99/년+클라우드빌드 EAS로 Mac불요, 인앱결제30%는 설계로 회피).

**참고:** 앱 스토어 출시 일반 지식은 형이 toastdm 앱 보고 물어본 데서 확장됨(iOS+AOS 코드1개 Capacitor/Expo, AOS 먼저 추천).

관련: [[reference_media_stack_2026-07]] [[reference_node_runtimes]] [[reference_chrome_debug_setup]] [[feedback_publish_with_images]] [[user_calls_user_hyung]]
