---
name: project_nblog_agent_naver_botdetect_overhaul_2026-08-14
description: "nBlog 에이전트 네이버 로그인판정/keep-alive 전면개편(0.1.15→0.1.20), 5라운드 QA에서 실사고급 버그 3개 잡음. 0.1.20 공식승격 완료"
metadata:
  type: project
  originSessionId: 237b10af-2489-4619-b769-c78eb3db65da
  modified: 2026-08-14T00:08:04.473Z
---

발단: 테스트 네이버계정(aiislife)이 네이버 "계정보호조치"(로그인잠금)에 걸림. 조사결과 원인은 자동화 패턴이 아니라 계정 자체 특성(휴면해제 직후+2대PC 동시로그인)일 가능성이 높다고 나왔지만(다른 테스트계정 2개는 안 걸림), 형이 이참에 keep-alive/로그인판정을 "봇처럼 안 보이게" 전면 개편 지시.

**최종 결과**: 0.1.20 공식 승격 완료(2026-08-14). 순찰지 다양화(뉴스·TV·메인 섞기)+DOM가시성 기반 로그인판정+로그인경로를 포털경유 자연스러운 흐름으로 변경. [[reference_atz_gate_substring_falsepositive_2026-08-14]]와 같은 세션에 병행 진행됨.

**5라운드 QA에서 지안(qa-lead-jian)이 실제로 잡아낸 것 3개** (자기검증만 믿으면 안 되는 이유가 실증된 사례):
1. 0.1.17: 순찰지에서 긁은 **남의 블로그ID**가 소유확인(`verifyBlogOwnership`) 유일 증거로 흘러가는 구멍 — 상시노출블로그 이름만 등록해두면 소유확인 자동통과되는 심각한 결함
2. 0.1.18: `showMyBlog`가 CDP 재연결 후 Page객체 `isClosed()`가 실제탭 살아있어도 true로 바뀌는 걸 놓쳐 항상 무동작
3. 0.1.19: 변수(`lastProbeUrl`) 하나가 "목적지"·"착지주소" 두 역할 겸용하다 매회차 덮어써져, blog.naver.com 순찰 25%에서 탭 누적(하루 30~40장) — cto가 순수함수 단위검사+실물스크립트 둘 다 통과시켰다고 보고했지만 **둘 다 keepAliveProbe 본체를 실제로 안 거친** 사각지대였음

**Why**: cto가 스스로 반성문 남김 — "실물검증"이라고 보고할 때 고친 코드 경로를 실제로 통과하는지 + 그 검사를 되돌리면 실패하는지 둘 다 확인해야 함. 0.1.20 최종본은 이 원칙으로 짠 통합회귀테스트(`tests/agent-keepalive-probe.test.ts`)가 실제로 버그 재현시 실패함을 나도 직접 워크트리 파서 재검증함(revert→7/11개 탭 누수 재현 확인→복구→0개 확인).

**How to apply**: nBlog 에이전트(D:\Develop\nblog-saas\agent) 관련 다음 작업 시, "순수함수 단위테스트 통과"만으로 안심하지 말 것 — 특히 브라우저/CDP 재연결·탭 상태 관련 코드는 반드시 본체 함수를 실제로 거치는 통합테스트 필요. 앞으로 네이버 건드리는 코드는 "딥링크 대신 사람이 밟는 평범한 흐름" 원칙(형 지시, agent/README.md에 문서화됨)을 기본값으로.

**정리**: 0.1.17/18/19는 결함있는 임시빌드라 서버에서 삭제됨(로컬 사본은 보존). 0.1.15는 결함없어 보존 여부 형 결정 대기.

**남은 사소한 개선(급하지않음)**: [Update]배지가 로그인필요 페이지(`/onboarding/agent`)로 연결돼 로그인 안 된 사용자는 한 단계 더 거침 — `/api/agent/v1/release/download`로 바꾸면 해결.

관련: [[reference_atz_gate_substring_falsepositive_2026-08-14]] [[project_nblog_bold_color_feature_2026-08-13]]
