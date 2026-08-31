---
name: project_ig_carousel_observe_next_run_2026-08-31
description: "[실전 이슈 001] IG 캐러셀 5장 발행 — 2026-08-31 실제 게시 성공으로 해결. 운영 ksajuCarouselV5는 아직 미수정(별도 승인 필요)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-31T03:37:42.292Z
---

**최종 결론(2026-08-31 12:35 KST)**: 오랜 기간 막혀있던 케이사주 Instagram 5장 캐러셀 자동발행 실패가 **완전 격리 워크플로를 통한 실제 게시 성공으로 해결됨**. 운영 워크플로 `ksajuCarouselV5`는 **아직 수정 안 됨** — 아래 "동작 확인된 조합"을 운영에 반영하려면 별도 승인·작업 필요.

## 근본 원인 (실측으로 확정)
- 문제는 이미지 포맷(JPEG/WebP)도, "Meta가 동적 URL을 거부한다"는 가설도 아니었다(제나가 08-31 별도 시험으로 "100% 확정"이라 주장했으나, [[feedback_dont_coach_magic_phrase_past_guard]]류의 성급한 단정 — 실제로는 이 세션에서 k-saju.me의 동적 API(`/api/og/card-jpeg`)를 그대로 써서 성공했다).
- **실제 원인은 요청 도메인 + credential 조합**: 운영 워크플로는 `graph.instagram.com` + 구 credential(`igGraphTokenKS1`)을 쓰는데 이게 실패(code 190/9004)했다. **`graph.facebook.com` + 새 credential(`IG Graph Token (ksaju.daily) - new`, id `VCULFgF3wJiZOpmu`)** 조합으로 바꾸자 자식 컨테이너 생성부터 최종 `media_publish`까지 전부 성공했다.

## 동작 확인된 조합 (운영 반영 시 이대로)
- 자식 컨테이너: `POST https://graph.facebook.com/v26.0/17841416122910487/media` body `{image_url, is_carousel_item: true}`
- 부모 컨테이너: `POST https://graph.facebook.com/v26.0/17841416122910487/media` body `{media_type: "CAROUSEL", children: [...], caption}`
- 발행: `POST https://graph.facebook.com/v26.0/17841416122910487/media_publish` body `{creation_id: <부모컨테이너ID>}`
- 인증: Generic Credential Type / Query Auth / `IG Graph Token (ksaju.daily) - new`
- 이미지 URL은 k-saju.me의 동적 API(`/api/og/card-jpeg?card=...&d=YYYY-MM-DD`) 그대로 사용해도 문제없다 — 정적 서빙(toastdm) 불필요.

## 2026-08-31 실제 게시 결과 (증거)
- 부모 컨테이너: `18148726813537431` (status_code: FINISHED)
- 최종 게시 media id: `18125645755814499`
- permalink: `https://www.instagram.com/p/DcsB6JFmzh8/`
- timestamp: `2026-08-31T03:35:19+0000`

## 과정에서 나온 함정 (다음에 참고)
- n8n에서 media_publish를 "Execute step"(단일노드 테스트)으로 실행하면 **응답이 안 잡히고 40초씩 멈춘 것처럼 보이며, n8n 감사로그(`n8nEventLog.log`)에도 전혀 기록되지 않는다** — 단일노드 테스트는 애초에 로그/이력에 안 남는 n8n의 특성. 이 때문에 실제 게시 여부를 판단할 수 없는 상황이 발생했었다.
- 이 상태에서 별도 노드를 "Execute step"으로 실행하면 n8n이 "캐시된 입력 없음"을 이유로 **상위 노드(media_publish 포함)를 자동으로 재실행**해버릴 수 있다 — 재시도 금지 지침을 어길 뻔한 사고 원인. 이번엔 다행히 실제 계정에 이중 게시는 안 됐음을 읽기전용 조회로 확인했다.
- **해결책**: 실제 게시처럼 되돌릴 수 없는 단일 호출은 "Execute step"이 아니라, Manual Trigger 1개 + 해당 노드 1개짜리 별도 워크플로를 만들어 **"Execute workflow"로 정식 실행**해야 결과가 확실히 잡히고 감사로그에도 남는다.

## 남은 일
- 운영 `ksajuCarouselV5`에 위 조합(도메인·credential) 반영 — 아직 미실행, 형/덱스 승인 필요.
- 격리 테스트에 쓴 임시 워크플로(`igPublishStageA`, `igVerifyOnly`, `igPublishFinal`, `igReconTest002clo`)들은 정리 필요(삭제 여부 결정 안 됨).

**병행 이슈**: [실전 이슈 002] k-saju 블로그는 별개 사안, 같은 스레드계열(1543776714197565491)에서 진행 — n8n MDX 생성 노드의 이중 `---` frontmatter 버그 원인 확정, 수정 패치 준비됐으나 미적용(형 결재 대기, `REQ-20260831-BLOG-01`).
