---
name: reference_ksaju_lichun_regression_scope_2026-08-21
description: k-saju 입춘 보정으로 값이 바뀌는 범위 — 1~2월생 연주+월간만, 3~12월은 전수 0건
metadata:
  type: reference
---

2026-08-21 `engine.computePillars`가 달력 연도 → 입춘 보정 연도로 바뀜(PR #13, 띠별 운세 작업에 동반).

**바뀌는 범위 (QA가 1900~2100 전체 73,414일 전수 대조로 확정)**
- 차이 나는 날 6,838일 = **전부 1월(6,231) + 2월(607)**. 3~12월 **0건**. 한 해 안에서 가장 늦게 갈리는 날짜는 2/4.
- 바뀌는 칸: **연주 + 월간(月干)**. 月干이 年干에서 파생되므로 같이 움직인다 — ★서진의 최초 보고엔 월간이 빠져 있었고 QA가 잡았다. 프리미엄 리포트 **월주 칸 표기도 바뀐다**.
- 안 바뀌는 것: 일주(일진)·시주는 어떤 날짜에서도 불변.

**정확도**: `src/lib/saju/lichun.ts`가 표가 아니라 태양 황경 315° 직접 계산(Meeus ch.25 + Espenak/Meeus ΔT). QA가 astronomy-engine(VSOP87)으로 201년 교차검증 → 최대 편차 12.34분(1999), **띠가 갈리는 해 0건**.

**남은 근사**: 월주는 여전히 절기가 아니라 달력 월. 24절기 미도입. 형 결정 대기 항목.

관련 [[reference_saju_engine_daypillar_offset_2026-08-20]] [[project_ksaju_menu_expansion_2026-08-20]]
