---
name: reference_n8n_localhost_vs_127001_session_scope_2026-09-02
description: n8n(:5678) 로그인 세션은 호스트명에 스코프됨 — 127.0.0.1은 로그아웃 상태여도 localhost는 로그인돼 있을 수 있음
metadata: 
  node_type: memory
  type: reference
  originSessionId: 601bd9e6-2fd7-4480-bb19-5eb59ee597d0
  modified: 2026-09-02T00:55:33.295Z
---

2026-09-02 실측: `http://127.0.0.1:5678/`로 접속하면 signin 페이지로 리다이렉트됐지만, 같은 브라우저 프로필에서 `http://localhost:5678/`로 접속하니 곧바로 로그인된 세션이 열렸다(쿠키가 호스트명 단위로 스코프돼 둘이 다른 세션 취급됨).

**How to apply**: n8n(또는 유사하게 쿠키 기반 로그인을 쓰는 로컬 서비스)에 접속해서 로그인 화면이 뜨면, 곧바로 "로그인 필요"라고 단정하지 말고 `localhost`/`127.0.0.1`/실제 설정된 도메인 등 다른 호스트명으로도 한 번 더 시도해볼 것. Health check(`/healthz` 등)는 호스트명 무관하게 응답하므로 서비스 자체가 떠있는지 여부와 로그인 세션 여부를 혼동하지 말 것.

관련: [[feedback_try_browser_before_declaring_blocked_2026-09-02]]
