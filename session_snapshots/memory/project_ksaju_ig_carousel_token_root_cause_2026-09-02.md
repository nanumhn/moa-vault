---
name: project_ksaju_ig_carousel_token_root_cause_2026-09-02
description: 케이사주 인스타 캐러셀(ksajuCarouselV5) 8/31 이후 재발 근본 원인 확정 및 수리 완료 — 도메인/credential 배선이 아니라 토큰 자체 무효화가 원인
metadata: 
  node_type: memory
  type: project
  originSessionId: 601bd9e6-2fd7-4480-bb19-5eb59ee597d0
  modified: 2026-09-02T00:56:09.125Z
---

**결론(2026-09-02)**: 8/31에 "해결됨"으로 기록됐던 [[project_ig_carousel_observe_next_run_2026-08-31]] 이후에도 인스타 캐러셀이 09-01, 09-02 계속 실패했다. 진짜 원인은 그 메모리가 짐작한 "운영 워크플로 미반영"이 아니라 **토큰 자체의 짧은 수명**이었다.

## 실측 경위
- n8n DB(`workflow_entity.nodes`)를 직접 SQL로 조회해보니, 실제 매일 도는 트리거 "Every Day 08:00"의 경로는 **이미 8/31에 graph.facebook.com + 새 credential(`IG Graph Token (ksaju.daily) - new`, id `VCULFgF3wJiZOpmu`)로 완전히 배선돼 있었다.** 도메인·credential 이름 문제가 아니었다.
- 이 워크플로 안에는 트리거가 **3개**(`Every Day 08:00` 완전수리됨 / `Every Day 08:` 부분수리(퍼블리시 단계는 여전히 구 credential) / `Every Day 08:0` 마찬가지)나 있어서 캔버스를 눈으로만 보고 판단하면 착각하기 쉽다 — **DB 직접조회가 안전**하다.
- 진짜 원인: `IG Graph Token (ksaju.daily) - new` credential의 토큰 값 자체가 8/31 이후 무효화된 상태(에러: "Invalid OAuth access token - Cannot parse access token"). 자동 토큰갱신 스크립트(`C:\Users\user\.moa\ig_token_refresh.ps1`)는 옛날 credential(`igGraphTokenKS1`)만 갱신 대상으로 잡고 있어서, 이 새 credential은 애초에 자동갱신 사각지대였다.

## 수리 내용
1. Meta for Developers(`developers.facebook.com/tools/explorer/`)에서 앱 `k-saju-auto`로 새 사용자 액세스 토큰 발급.
2. **단기 토큰(1시간)임을 확인**하고 액세스 토큰 디버거의 "액세스 토큰 확장" 버튼으로 **장기 토큰(만료 2026-11-01)**으로 교환.
3. n8n credential(`IG Graph Token (ksaju.daily) - new`)의 값을 장기 토큰으로 교체·저장.
4. 실제 워크플로 전체 실행(`Execute workflow from Every Day 08:00`)으로 라이브 발행 검증 성공(media id `18392136187202537`).
5. `Get IG User ID` 노드 단독 재실행으로 장기 토큰 인증도 재확인.

## 남은 구조적 문제 (미해결)
- `ig_token_refresh.ps1`의 자동갱신 대상이 여전히 옛날 credential(`igGraphTokenKS1`)로 고정돼 있다 — 다음에 이 새 장기 토큰도 만료(2026-11-01)에 가까워지면 또 수동 개입이 필요할 것. 자동갱신 스크립트가 새 credential ID를 갱신 대상으로 잡도록 고치는 게 근본 해법이나, 이번엔 미착수.
- 워크플로 안의 나머지 두 트리거(`Every Day 08:`, `Every Day 08:0`)는 여전히 부분적으로 구 credential/도메인을 쓴다 — 활성 트리거가 아니라서 지금은 무해하지만, 정리 대상으로 남아있다.
- 8/31에 만든 격리 테스트 워크플로들(`igPublishFinal-clo-single-publish` 등)도 정리 안 됨.

관련: [[feedback_check_token_lifetime_before_declaring_fixed_2026-09-02]], [[reference_n8n_canvas_execution_status_can_be_stale_2026-09-01]]
