---
name: project_shorts_20260915_pm_qwen_fallback_produced_no_script
description: "09-15 pm 쇼츠 bun 종료코드 1의 원인 — GPT 진입실패로 qwen 폴백, 그 qwen이 장면 1개 + JSON 파싱 3연속 실패로 대본을 아예 못 만들어 슬롯이 통째로 날아갔다"
metadata:
  type: project
---

**2026-09-17 규명** (`shorts_pipeline.log` 9155~9184행 직접 조회). 오전 세션이 "안 봄"으로 남긴 건.

## 연쇄
1. `[gpt] 프로젝트 홈 진입(메인 경유·name/시도1)` → `⚠️ GPT 실패 → qwen 으로 대체: 컴포저 focus 실패: no composer`
2. `[shorts] 장면 1개(6개 목표) — 다시 뽑습니다`
3. `파싱 실패(2/4): JSON Parse error: Expected ']'` · `(3/4): Expected '}'` · `(4/4): Expected ']'`
4. 4회 소진 → `error: 장면이 1개뿐이라 영상이 성립하지 않습니다` → `종료코드 1` → `[20:00] shorts run end slot=pm exit=1`

## 이미 알던 것 / 새로 안 것
- **방아쇠(1번)는 기존 건**이다 → [[project_atz_gpt_project_home_broken_2026-09-09]]. 작성기가 `/project` 하나만 진입점으로 써서 그 페이지가 죽으면 전부 qwen으로 떨어진다.
- **새로 안 것**: qwen 폴백이 **산출물 0**으로 끝나 슬롯을 통째로 날린 사례. 기존 기록은 qwen 폴백의 위험을 **품질(지명 환각)** 로만 적어 뒀다 → [[reference_atz_gpt_fallback_quality_risk_2026-08-07]] · [[project_atz_qwen_fallback_hold_blocked_blog_2026-09-09]]. 품질 저하가 아니라 **완전 실패**도 난다.

## 조용한 유실이 아니었다
실패 알림 카드가 정상 발송됐다(`실패 알림 발송: ok id=1549374639904522282`). 문제는 알림이 아니라 **아무도 재시도를 안 한 것**이다 — 원장에 재시도 줄 0건 (이틀째 그대로였음).

## 간헐이다
**바로 다음 회차 09-16 06:30 am 은 GPT 정상 작동**(`이번 대본 작성자: gpt (gpt 1회 / qwen 0회)`)으로 발행 성공(`sFmjgGfGaZ4`). 즉 GPT 진입실패는 상시 고장이 아니다. 같은 창에서 09-16 20:00 pm 은 다시 qwen 폴백으로 떨어졌으나 그때는 대본이 나와 발행됐다.

## 제안(형 판단 대기)
qwen 폴백이 4회 전부 실패했을 때 **슬롯을 포기하지 않는 경로**가 없다. 여기가 따로 볼 자리로 보인다. 코드는 제나 몫 [[feedback_clo_tests_jena_codes_2026-09-06]].
