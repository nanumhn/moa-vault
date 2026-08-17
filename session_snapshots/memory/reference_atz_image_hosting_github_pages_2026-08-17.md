---
name: reference_atz_image_hosting_github_pages_2026-08-17
description: "아투 블로그 썸네일 무작위 404/429 근본원인=raw.githubusercontent.com 핫링크 오용. GitHub Pages로 이전 완료, 발행 전 빌드확인 가드 필수"
metadata:
  node_type: memory
  type: reference
  originSessionId: 72a74dde-7240-4f53-a0e9-ca1b1f4a8404
  modified: 2026-08-17T16:41:02.971Z
---

2026-08-17 형이 아투 블로그 카드 이미지가 군데군데 빈 흰 박스로 뜨는 걸 스크린샷으로 발견. "최근 것만 안 보인다"는 첫 관찰은 오진이었고(날짜와 무관하게 무작위), 실제 원인은 **`raw.githubusercontent.com`을 이미지 CDN처럼 핫링크한 것** — 이 주소는 소스코드 열람용이라 요청이 몰리면 IP 단위로 무작위 429를 뱉는다. 7/25 이후 파이프라인으로 발행된 글 49개 전부가 위험군이었고(그 이전 176개는 Blogger 자체서버라 안전), 3주 넘게 조용히 간헐 장애 상태였다.

**수리 내용** (`nanumhn/moa-blog-assets` 저장소):
- GitHub Pages 활성화(`gh api --method POST repos/.../pages`) + `.nojekyll` 추가(순수 정적파일이라 Jekyll 처리 우회 필요, 없으면 빌드가 이상하게 실패함)
- 이미지 주소 상수를 `raw.githubusercontent.com/.../main` → `nanumhn.github.io/moa-blog-assets`로 교체
- 기존 49개 LIVE 글의 이미지 URL을 posts.patch로 부분갱신(본문만, 제목·라벨 안 건드림) — 처리 전 1건으로 안전성 증명 후 나머지 진행, 사후 225건 전수 재점검(옛 주소 잔여 0, 제목/라벨 누락 0)
- 대표이미지 PNG(600KB~3.3MB) → JPEG q82(150~250KB, 실측 88% 감소, 인코딩 실패시 원본 PNG 자동 폴백)

**★재발 방지가 핵심이었다**: Pages로 옮겨도 **push만으로는 자동 빌드가 안 돈다**(실측 2/2 자동트리거 실패, 한 번은 25분 멈춰 있다 실패). API로 직접 빌드를 걸면 54~75초 만에 성공. 그래서 이미지 push 직후 빌드를 명시적으로 걸고 완료까지 기다리는 가드를 파이프라인(`pushAssets`)에 추가했다 — 이게 없었으면 방금 고친 증상이 신규 글에서 그대로 재발했을 것. 빌드 실패해도 발행 자체는 막지 않음([[feedback_ontime_publish_over_qa]] 원칙 적용).

**jsDelivr는 검토했다가 기각**: 처음엔 182MB 레포에 대해 503/404가 나서 "못 쓴다"고 오판했는데, 사실은 첫 요청이라 캐시가 안 데워진 것뿐이었다(재시도하니 정상). 그래도 최종적으로 Pages를 선택한 이유는 jsDelivr의 `@main` 캐시가 새로 올린 파일을 한동안 못 보여줄 위험이 있어서(우리 패턴=push 직후 발행이라 "새 이미지가 아직 안 보임"이 정확히 우리가 막아야 할 문제) — Pages는 빌드 완료를 직접 확인할 수 있어 통제 가능하다는 게 결정적이었다.

**How to apply**: 외부 이미지/자산을 다시 호스팅할 일이 생기면 raw.githubusercontent.com은 애초에 후보에서 제외할 것(공식적으로 핫링크 금지 주소). GitHub Pages를 쓸 땐 `.nojekyll` 필수 + "push=빌드 트리거"라고 가정하지 말고 반드시 실측으로 확인할 것. 대용량 정적 자산 CDN이 필요하면 jsDelivr보다 먼저 실제 캐시 갱신 지연을 측정해볼 것.

**남은 기술부채(별건, 급하지 않음)**: `tools/blogger-publish/blogger.mjs`의 `updatePost`/`getPost`/`revertToDraft`(93줄)가 커밋된 적 없이 로컬에만 있음 — 클린 클론하면 깨짐. 이번 작업에선 그 코드에 의존하지 않고 Blogger API 직접호출로 우회했지만, 원본 파일 자체는 언젠가 정리 필요.

**★후속 강화 (같은 날, 커밋 548136a)**: "빌드 성공" 상태만으로는 부족해서(빌드는 성공해도 방금 올린 파일이 아직 프로퍼게이션 안 됐을 구간 존재), 합격 기준을 "방금 올린 URL이 실제로 200 뜨는지"로 상향. 신규 파일로 실제 push→200까지 65초 실증. 그리고 작업 중 **잠복 장애를 하나 더 발견**: `nanumhn/moa-blog-assets` 로컬 clone이 원격보다 1커밋(`.nojekyll` 추가분) 뒤처져 있었음 — 이 상태면 다음 파이프라인 push가 구조적으로 거절되고 그 회차 이미지가 조용히 버려짐(에러 없이 사라지는 유형이라 한참 뒤에나 발견됐을 것). 뒤처짐 해소 + push 거절 시 자동 pull-후-재시도하도록 고침. 이 저장소는 파이프라인 밖에서도 직접 커밋이 들어가므로(.nojekyll처럼) 같은 유형 재발 가능 — 그래서 자동복구를 넣음.

**★인수인계 — 다음 세션이 확인할 것**: 2026-08-18 06:00 KST 아투 정기발행이 이 새 경로(Pages+빌드가드+200확인)를 처음 실전에서 타는 회차다. 발행 로그에 "새 이미지 N장 서빙 확인" 류 로그가 찍혔는지, 실제 글에 이미지가 정상 붙었는지 확인할 것.

관련: [[project_atz_hallucination_fix_2026-07-27]] [[feedback_ontime_publish_over_qa]]
