---
name: feedback_check_token_lifetime_before_declaring_fixed_2026-09-02
description: "OAuth/액세스 토큰을 발급·교체할 때는 만료 시간부터 확인하고 장기 토큰인지 검증한 뒤에 '고쳤다'고 보고한다 (형 직접 지시)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 601bd9e6-2fd7-4480-bb19-5eb59ee597d0
  modified: 2026-09-02T00:55:48.480Z
---

형 지시(2026-09-02, IG 캐러셀 토큰 재발급 작업 중): *"미래를 예측하면서 작업을 진행해야 한번에 끝내지."*

**경위**: 케이사주 인스타 캐러셀 발행이 "Invalid OAuth access token" 에러로 실패해서, Meta Graph API Explorer에서 "Generate Access Token"으로 새 토큰을 받아 n8n credential에 넣고 실제 발행까지 성공시켰다. 그리고 "다 됐다"고 보고했는데, 형이 "내일 발행은 문제없겠지?"라고 묻자 그제서야 확인해보니 **그 토큰이 딱 1시간짜리 단기 토큰**이었다(만료 시각이 발급 후 약 1시간 뒤). 장기 토큰으로 교환하지 않았으면 내일 새벽 자동실행에서 똑같은 에러로 또 실패했을 것이다.

**Why**: Graph API Explorer의 기본 "Generate Access Token" 버튼은 기본적으로 단기 사용자 토큰을 준다. 눈앞의 증상(발행 성공)만 확인하고 "고쳤다"고 선언하면, 몇 시간 뒤 재발하는 문제를 놓친다. 형은 이런 "당장은 되지만 곧 다시 깨질" 상태를 "한 번에 끝내지 못한 것"으로 본다.

**How to apply**: 앞으로 OAuth/액세스 토큰을 새로 발급하거나 credential을 교체할 때는:
1. 발급 즉시 만료 시각을 확인한다(Facebook은 액세스 토큰 디버거 `developers.facebook.com/tools/debug/accesstoken/`에서 확인 가능, 대부분의 OAuth 서비스도 유사한 introspection 엔드포인트가 있다).
2. 단기 토큰이면 장기 토큰으로 교환하는 절차(예: Facebook의 "액세스 토큰 확장" 버튼, 또는 `fb_exchange_token` grant)를 그 자리에서 마저 밟는다.
3. "발행 성공했다"와 "재발 안 한다"는 다른 주장이므로, 후자를 확인하기 전엔 "완전히 고쳤다"고 말하지 않는다.

관련: [[project_ksaju_ig_carousel_token_root_cause_2026-09-02]]
