---
name: project_revenue_model_redesign_final_2026-08-12
description: "수익모델 재설계 회의 최종 3안 확정(C=k-saju단건$29 최우선, B=nblog-saas승격, A=쇼츠B2B 4주실험으로 축소). 형 승인 3건 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T04:56:57.279Z
---

[[project_revenue_review_lapsed_2026-08-12]] 액션3(coo-dohyun) 완료. 1차 clo_studio회의→품질게이트→덱스제나 2차검증(meeting-runner Step7) 전체 사이클 첫 실전 사용.

**결재문서**: `moa-vault/10_Wiki/Decisions/2026-08-12_revenue_model_redesign_final_3options.md`

**핵심 정정**: KPI가 순수익인데 지금까지 계산은 전부 매출 기준이었음 — 순수익 2,000만원=매출 약 2,860만원 필요(모든 필요고객수 ×1.43).

**최종 3안**:
- **C(k-saju $7.99구독→$29단건리포트) ★★★★★ 이번주 착수 추천**. 861건/월 필요. 단건결제 코드 골격 이미 존재(3~5인일). **치명적버그**: 지금은 단건구매도 Subscription.status=active로 기록되어 구독전체가 영구활성화됨 — 유료고객 0명인 지금이 고칠 수 있는 유일한 시점. 형인시 최소, 90일내 매출확률 90%+(덱스·제나 공통 1위).
- **B(nblog-saas 정식승격+월99,000원 단일플랜) ★★★★☆ 2주내**. 유일하게 반복매출+형인시0+높은단가 셋 다 가진 라인. 결제 0%구현(6~8인일). 첫매출은 신규유입 아니라 기존 초대장베타유저 전환에서. **최대리스크=네이버 자동발행 약관/어뷰징정책, 제나조사 미완 — 유료오픈 전 선행확인 필수**.
- **A(쇼츠B2B) ★★☆☆☆ 4주 제한실험으로 격하**. 편당15~25만원은 소매가였고 실제 화이트라벨 하청실거래가는 3~8만원 — 그걸로는 월571편 필요(불가능). Kill criteria: 4주내 유료파일럿1건 또는 서면견적수락2건 없으면 중단, 형시간상한 월2시간.

**정직한 현실 진단**: 3안 다 해도 90일내 월2,000만원 불가능. 현실적 90일목표=월300~700만원, 2,000만원은 6~12개월 과제.

**형 승인 대기 3건**(전부 추천=승인): (A)k-saju단건전환(권한분리버그 동시수리) (B)nblog-saas승격+9.9만원(네이버정책확인 선행) (C)쇼츠4주실험+시간상한.

**★형 지시(2026-08-12 13:56 KST): 이 결정 보류, nblog-saas 마무리부터 하고 재논의.** 다음 세션은 이 3건 승인여부를 형이 먼저 안 꺼내면 nblog-saas 마무리 후 다시 상기시킬 것.

**★부수발견(인프라버그)**: `regen_artifact.py`가 `--context-file` 없으면 안건과 무관하게 사주페이즈2 자료를 하드코딩 주입 → 회의결론과 정반대 내용을 그럴듯하게 써내는데 기존 품질게이트5종(thinking패턴·분량 등)으로는 못 잡힘. 학습노트 `moa-vault/10_Wiki/Skills/auto-quality/2026-08-12_regen_artifact_hardcoded_context_contamination.md`에 근본수리안 기록됨 — **아직 미수리, 다음 세션이 meeting-runner 개선시 처리할 것**.

**Why**: 오늘 신설된 [[project_meeting_two_stage_review_2026-08-12]] 2단계검증 절차의 첫 실전 적용 — 잘 작동함(1차 산수오류 다수 걸러냄).

관련: [[project_revenue_review_lapsed_2026-08-12]] [[project_meeting_two_stage_review_2026-08-12]] [[project_ksaju_growth_channel_switch_2026-08-12]] [[project_ksaju_vercel_migration_plan_2026-08-12]]
