---
name: reference_nblog_agent_single_naver_session_per_profile_2026-08-16
description: nblog-agent(PC클라이언트)는 크롬 프로필 하나=네이버 계정 하나만 지원. B서비스(블로그3개) 실사용 위해선 AGENT_INSTANCE 자동화가 별도로 필요
metadata: 
  node_type: memory
  type: reference
  originSessionId: 32301e64-d743-427e-947a-2f01b790db21
  modified: 2026-08-16T09:40:36.060Z
---

nblog-agent(`D:\Develop\nblog-saas\agent`)는 크롬 전용 프로필 하나에 CDP 포트 하나로 동작(`agent/src/main/naver.ts` profileDir()). 네이버는 브라우저 프로필 하나에 계정 하나만 로그인 가능(cto 실측 확인, `config.ts:23` 주석). 코드상 `blogIds: string[]`는 배열 타입이지만 모든 경로에서 실제로는 항상 0개 아니면 1개만 채워짐 — 다중 블로그 동시운영 로직은 없음.

`AGENT_INSTANCE`(`agent/src/main/config.ts:31`, env `NBLOG_AGENT_INSTANCE`)라는 장치가 이미 있어서, 인스턴스명을 다르게 주면 크롬 프로필명·CDP포트·자격증명 저장소가 통째로 분리되어 한 PC에서 여러 네이버 계정을 병렬로 돌릴 수 있는 **설계는** 돼 있다. 하지만:
- CDP 포트 자동배정이 `AGENT_INSTANCE ? 9336 : 9335`로 **딱 2개(기본/보조)까지만** 자동. 3번째 인스턴스부터는 `NBLOG_CDP_PORT`를 사람이 직접 수동 지정해야 충돌을 피함.
- 원래 용도는 "운영 vs 테스트 계정 분리"(개발자 전용)였고, 고객 대상 설치화면·문서 어디에도 이 메커니즘이 노출돼 있지 않음.

**결론**: B서비스(블로그 3개까지)를 실제로 팔려면 SaaS 대시보드 쪽 quota(스키마 필드+게이트) 말고, PC 에이전트 쪽에 "블로그별 인스턴스 자동생성 + 포트 자동배정" UI/자동화를 별도로 만들어야 고객이 실사용 가능. 지금은 개발자가 수동으로 env var를 맞춰야만 2개 이상 동시운영이 됨.

**Why:** 형이 "B서비스로 블로그 3개 파는데 한 PC에서 실제로 3개 운영되는지" 질문해서 검증. cto의 SaaS 서버단 quota게이트 작업과는 별개 축의 문제.

**How to apply:** B서비스 완료/검수 보고할 때 이 갭을 반드시 같이 보고할 것 — SaaS 쪽만 완료됐다고 "B서비스 완료"로 착각하지 말 것. qa-lead-jian 검수 스코프에 포함시킬 것.

관련: [[project_100eok_club_naming_2026-08-16]]
