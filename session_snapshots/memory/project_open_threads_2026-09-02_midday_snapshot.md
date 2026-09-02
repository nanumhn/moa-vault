---
name: project_open_threads_2026-09-02_midday_snapshot
description: "2026-09-02 14:00 세션종료 스냅샷 — nblog 간격변경 운영적용 완료·인스타/아투 발행 수리 완료, MOC 커밋 직전"
metadata: 
  node_type: memory
  type: project
  originSessionId: 601bd9e6-2fd7-4480-bb19-5eb59ee597d0
  modified: 2026-09-02T05:25:39.615Z
---

**세션 상태(2026-09-02 13:55 KST 기준)**: 대부분 완료, MOC 갱신분 커밋·push 미완(haru 일지 대기 중).

## 완료된 것
1. **아투(american-todayz) 오전 발행 실패** — `MoaAtzPublish` 20분 실행시간제한 초과로 강제종료가 원인이었음(Task Scheduler 이벤트로그 확인). 수동 발행 완료(블로그 https://www.american-todayz.com/2026/09/usps.html · 쇼츠 https://www.youtube.com/shorts/wp-mgcM6ba8), 재발방지로 ExecutionTimeLimit 20분→1시간 연장 완료.
2. **케이사주 인스타 캐러셀 재발** — 8/31에 "해결"로 기록됐던 것이 9/1·9/2 재발. 진짜 원인은 도메인/credential 배선이 아니라 **토큰 자체 무효화**(n8n DB 직접조회로 확정). 장기토큰(만료 2026-11-01) 재발급·저장·라이브 재검증 완료(media id `18392136187202537`).
3. **워커 사용량 모니터링 대시보드([워커 001] 이슈, 이제 ✅ 표시)** — 제나 100% 오표시 버그(그룹 구분 없이 마지막 값으로 덮어씀) 원인규명·수정, 덱스 720M 토큰 이상치(전체누적값, 무관) 확인·제거, 이모지 바 표시·사용량 기준 통일 완료.
4. **nblog-saas 발행간격 8h→6h(형 지시, [엔블 005-02] 이슈)** — DB 데이터(기존 블로그 2개)·JS상수·UI문구·Prisma마이그레이션(`20260902043500_min_interval_8h_to_6h`)·에이전트 폴백값(`agent/src/main/limits.ts`, 3번째로 발견한 하드코딩 지점)까지 전부 수정. 테스트 969개 중 963개 통과(나머지 6개 무관 영역, 미조사). **덱스가 운영 DB에 최종 적용 완료**(REQ-20260902-ENBL00502-02).
5. **MOC 갱신 완료(커밋 전)**: `아메리칸 투데이 MOC.md`(YAML 깨진 blocked 필드 quote로 수정) · `덱스·제나 워커 MOC.md`(오늘 타임라인 추가).

## 안 끝난 것 (다음 세션이 이어받을 것)
- **랩실 git commit+push 미완** — MOC 2건 수정이 아직 워킹트리에만 있음(`Obsidian/owenlab` repo). haru 일지 완료되는 대로 같이 커밋할 것.
- **haru 오전 일지 작성 중**(백그라운드 에이전트, agentId 미공개) — 완료 확인 안 됨.
- **nblog 격리 워크트리 정리 안 됨** — `D:/Develop/nblog-saas-clo-interval6h`(브랜치 `clo/interval-6h`), symlink로 연결한 node_modules/generated 포함. 운영 적용은 끝났으니 정리(worktree remove) 필요.
- **엔블 006(연장신청 상태값·메모 기능)** — 조사·설계안까지 클로가 완료해서 덱스에게 넘김(위임관문이 클로의 nblog-saas 직접 Edit을 막아서). 덱스가 구현 이어받기로 함, 진행상황 미확인.
- **덱스 이모지 유실 버그(간헐적)** — 결재요청 카드의 🟪 이모지가 브리지 입력 중 일부만 유실되는 현상 발견(형이 직접 확인), 덱스가 "기록하겠다"고 했으나 근본원인 조사는 안 됨.

## 오늘 클로가 지적받은 것 (재발방지용, 메모리에도 저장됨)
- "브라우저 실행도 안 해보고 안된다고 하지 마라" — localhost vs 127.0.0.1 세션 스코프 차이를 첫 시도 실패로 단정.
- "미래를 예측하면서 작업해야 한번에 끝난다" — 토큰 재발급 시 만료시간 확인 안 하고 완료선언.
- 덱스 디스코드 멘션 ID 오타 3회 반복(정확한 ID는 `reference_dex_jena_discord_ids_2026-09-02` 참고).
