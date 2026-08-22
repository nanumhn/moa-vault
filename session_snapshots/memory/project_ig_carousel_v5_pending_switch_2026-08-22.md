---
name: project_ig_carousel_v5_pending_switch_2026-08-22
description: "인스타 캐러셀 5장(v5) 전환 완료 — 2026-08-23 08:00이 첫 실전, 그 결과 확인이 남았다"
metadata: 
  node_type: memory
  type: project
  originSessionId: 89a3f818-94be-41ca-9b73-e70966618f5f
  modified: 2026-08-22T14:29:11.677Z
---

2026-08-22 밤. 형 지시 *"5장으로 배포해"*(23:01) → **당일 전환 완료.**

## 최종 상태 (2026-08-23 00:35 확인)
- **v5 `ksajuCarouselV5` = ON**, 트리거 `Every Day 08:00`, **꺼진 노드 없음**(게시 노드까지 활성)
- **v4 `tarotDaily00002` = off** — 두 개가 동시에 올려 중복 게시되는 일 없음
- `igAlert0001`(실패 알림) = ON 유지
- **★2026-08-23 08:00 이 첫 실전이다. 결과를 반드시 확인할 것** — 안 올라갔으면 형에게 바로 보고.

## 검증한 것 (실제 인스타 API 왕복)
웹훅으로 dry-run(게시 노드만 끈 채) → **실행 216 = success**. 자식 컨테이너 **5개** + 부모 캐러셀 컨테이너 실제 생성(`18147067078537431`).
슬라이드 순서 = hook → daily → keyword → action → cta.
**`media_publish`(진짜 게시)만 미검증** — 08:00 이 그 검증이다.

## ★1차 dry-run 실패와 교훈 (미리 안 돌려봤으면 하루 날아갔다)
`ExpressionError: "Get IG User ID" node has 1 item(s) but you're trying to access item 1`
자식 컨테이너 노드는 **슬라이드 5개마다 1회씩** 도는데 `$node["X"].json` 은 **같은 인덱스의 아이템**을 찾는다 → 2번째부터 없다.
**수리 = `$('X').first().json`** 로 전부 교체(6곳). **n8n 에서 fan-out 뒤에 앞 노드를 참조하면 항상 이 형태를 써야 한다.**

## 곁들여 나온 사실
**캐러셀이 여태 안 됐던 진짜 이유는 메타 앱심사가 아니었다.** 카드 5장 중 `hook`/`action`/`cta` **3장이 2026-08-16 이후 한 번도 커밋된 적이 없어** 라이브가 404였다. 워킹트리에만 있었다. 앱심사가 필요한 건 **댓글→DM** 쪽이지 게시가 아니다. PR #17 로 커밋·배포함(+ `card-jpeg` 공용 라우트 신설 — 메타는 JPEG 만 받는데 `next/og` 는 PNG 만 낸다).

## 다음에 n8n 만질 때 함정
- import 는 워크플로에 **`id` 필드 없으면 NOT NULL 오류**로 실패
- **`MSYS_NO_PATHCONV=1` 필수** (없으면 `/tmp/...` 가 윈도 경로로 바뀌어 ENOENT)
- CLI 로 바꾼 건 **`docker restart n8n` 해야 반영**된다
- `n8n execute --id` 는 인스턴스가 떠 있으면 **포트 5679 충돌**로 못 쓴다 → 임시 웹훅 트리거로 우회
- **DB를 `docker cp` 로 복사해 읽으면 WAL 때문에 최신이 안 보인다** — 실제로 "워크플로가 없다"고 오판할 뻔했다. `database.sqlite-wal` 도 같이 복사하거나 `n8n list:workflow` 로 확인. [[feedback_verify_before_alarm]]
- `user_api_keys` 의 키는 **해시라 API 에 그대로 안 먹는다**(403)
- 하네스 차단 회피용 권한: 형이 `Bash(git push:*)` 와 `Bash(docker exec:*)` 를 Allow 에 추가함. **콜론 없는 `Bash(git*)` 형식은 작동하지 않는다**

관련: [[project_ksaju_instagram_carousel_2026-08-16]] · [[project_ksaju_instagram_zero_reach_2026-08-16]]
