---
name: project_open_threads_2026-08-14_dawn_snapshot
description: "2026-08-14 04시 새벽저장 스냅샷 — 최우선은 k-saju Lightsail 이전 형AWS액션5개 여전히 대기중"
metadata:
  type: project
  originSessionId: b8dfa7f0-1191-4e2e-b45b-98b7bc1b7173
  modified: 2026-08-13T19:25:32.922Z
---

**★최우선 — k-saju.me Vercel→Lightsail 이전, 형 AWS콘솔 액션 5개 여전히 미완료**([[project_ksaju_vercel_migration_plan_2026-08-12]] 참고): 계획(v3, 2GB tier로 확정) QA통과·Day0 코드작업 끝났고, 형이 아래 5개 하면 cto가 바로 프로비저닝 착수:
③Lightsail 인스턴스 생성(ap-northeast-2a·Ubuntu24.04·**$12(2GB)**·이름 k-saju-prod·SSH키페어 k-saju-lightsail) ④고정IP 생성+연결 ⑤방화벽 22/80/443만+IPv6비활성 ⑥자동스냅샷 켜기 ⑦origin.k-saju.me A레코드→고정IP(TTL60). 순서: ③→④⑤⑥, ④직후⑦. 형액션①②(Neon확인,DNS TTL)는 이미 완료.

**완료된 것들(후속조치 불필요)**:
- nBlog 굵게·글자색 기능 — 0.1.14 라이브 배포 완료([[project_nblog_bold_color_feature_2026-08-13]])
- 아투 게이트 인용오탐 3번째 재발 수리+재발행 성공([[reference_atz_gate_quote_falsepositive_3rd_recur_2026-08-13]])
- 8/13 오전·오후야간 업무일지 옵시디언 기록+push 완료

**형 결정 대기(급하지 않음)**:
- nBlog AI 본문+이미지 자동생성 기능 — 설계+견적 완료(`D:\Develop\nblog-saas\docs\ai-draft-design.md`), 결정필요 7건(D1~D7, 전부 cto추천안 있음) 형이 아직 확정 안 함. [[project_nblog_ai_content_generation_2026-08-13]]
- saju-studio lemonsqueezy 폐기코드 잔재 삭제/gitignore/정식편입 여부 — 이전과 별개건, 배포게이트가 막고 있어 급하지 않음

**세션 중 있었던 일 중 특이사항**:
- 클로(나)가 cto의 미검증 보고("Pexels 이미지 UA버그로 전량실패")를 그대로 형에게 확정적으로 전달했다가 오보로 정정한 사건 있었음 — 서브에이전트의 "지금 고칠게요"급 확정적 보고도 재현 여부 물어볼 여지 있었음
- nblog-saas 레포에서 정체불명 다른 세션과 동시작업(대시보드 gated 리네임) 충돌위험 — 백업 떠두고 조율채널(1534714627383099493)에 안내함, 아직 그쪽이 커밋했는지 미확인

세션 크론 6개(사전저장×2, 일지×2, 주간전략, 아투보류큐) 이번 세션 시작 시 재등록 완료. 외부 워치독 3종(Discord/atz보고/업무채널) 정상 확인.

관련: [[project_ksaju_vercel_migration_plan_2026-08-12]] [[project_nblog_bold_color_feature_2026-08-13]] [[project_nblog_ai_content_generation_2026-08-13]] [[reference_atz_gate_quote_falsepositive_3rd_recur_2026-08-13]]
