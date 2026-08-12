---
date: 2026-08-12
agent: coo-dohyun
skill_type: quality_gate
trigger: meeting-runner Step 3에서 facilitator 산출물 누락을 regen_artifact.py로 보강할 때
confidence: high
auto_apply: true
---

# regen_artifact.py 기본 컨텍스트가 '사주 페이즈2'로 하드코딩 — 다른 안건 보강 시 산출물 오염

## 무엇 (한 줄 요약)
`regen_artifact.py`를 `--context-file` 없이 돌리면 **어떤 안건이든 사주 프로젝트3 페이즈2 자료를 컨텍스트로 집어넣는다.** 그래서 보강 산출물이 회의와 무관한 내용으로 오염된다. 보강 시 `--context-file`을 반드시 붙인다.

## Why (배경/사고)
2026-08-12 수익모델 재설계 회의(run_20260812_130037)에서 facilitator(정도현) 산출물 `decisions.md`가 누락돼(meeting.py는 `panelists`만 순회하고 facilitator는 건너뛴다 — 알려진 구조) regen으로 보강했다. 1차 보강 결과물이 이렇게 나왔다:

- 제목이 `# 사주 프로젝트3 페이즈2 회의록`
- 액션 아이템에 "PayPal API 통합 완료", "QA 테스트 플랜 작성", "다국어 지원 구조 확정"
- 의제 2(쇼츠 B2B 착수)를 회의 결론과 반대로 "보류 중"이라고 기재
- 데드라인이 2026-09/10월 (회의는 8월 안건)

원인은 모델 품질이 아니라 **코드**였다. `regen_artifact.py` main():

```python
context_md = ""
if args.context_file:
    context_md = Path(args.context_file).read_text(encoding="utf-8")
else:
    # 기본 컨텍스트: 사전 입력 토픽 (요약) + 이전 산출물 제목만
    topic_f = Path("D:/Develop/moa-vault/10_Wiki/Topics/사주_프로젝트3_페이즈2_사전입력.md")
```

`--context-file`을 안 주면 **무조건** 저 사주 페이즈2 파일을 읽는다. 2026-06 사주 회의 보강용으로 짜인 값이 그대로 남은 것이다. 프롬프트에는 `[사전 입력 — 이전 회의 결론 및 페이즈1 자료]`라는 라벨까지 붙어서 들어가므로, 7B 모델 입장에서는 "이게 이번 회의 자료"라고 믿는 게 정상이다. 모델을 탓할 일이 아니다.

★ 위험한 이유: 오염된 산출물이 **회의 결론과 정반대의 결정문**을 그럴듯한 형식으로 만들어낸다. 분량 게이트(1,500자)와 thinking 패턴 게이트는 둘 다 통과한다. **기존 품질게이트 5종으로는 이 오염을 못 잡는다.**

## How to apply
1. **보강 시 `--context-file` 필수.** 회의 transcript(`output/{run_id}/meeting.json`)에서 중간정리 + R2 + 클로징 구간만 뽑아 3~4KB 파일로 만들어 넘긴다. 이번에 쓴 방법:
   ```python
   d = json.load(open('output/{run_id}/meeting.json', encoding='utf-8'))
   blocks = [f"[{e['speaker']}] {e['text']}" for e in d['transcript'][6:12]]
   ```
2. **instruction에 네거티브 가드를 박는다** — "이 회의는 X 회의다. 다른 프로젝트(사주 앱 개발·PayPal·QA·다국어) 내용은 한 줄도 쓰지 마라", "제목은 반드시 ~로 시작", "데드라인은 이번 달 안".
3. **품질게이트에 6번째 검사를 추가한다 — 주제 정합성.** 보강 산출물의 제목·본문에 이번 회의 팀 정의(`name`)의 핵심 키워드가 없거나, 다른 프로젝트 고유명사(사주 페이즈·PayPal·다국어 등)가 나오면 폐기 후 재생성. 분량·thinking만 보는 현행 게이트로는 못 잡는다.
4. 근본 수리 후보(백로그): `regen_artifact.py`의 하드코딩 경로 제거 → `--context-file` 없으면 해당 run의 `meeting.json`을 자동으로 읽게 변경. 하드코딩 폴백은 조용히 틀린 답을 만들므로 **에러로 죽는 편이 낫다.**

## 함께 확인된 것 (같은 run)
- **facilitator 산출물 누락은 버그가 아니라 설계다.** `meeting.py` 8) 산출물 생성 루프가 `for p in panelists:`라 facilitator는 `artifacts`에 정의해도 생성되지 않는다. 팀 json에 진행자 산출물을 넣었다면 **회의 후 regen 보강이 항상 필요**하다고 전제하고 팀을 짤 것.
- **토픽 캐시 버그 회피법:** `meeting.py`는 위치 인자로 topic을 안 주면 기본값이 `"주말 새벽 카페 무드 플리, 6곳 컨셉"`이고 그게 vault 폴더명에 박힌다. 실행 시 topic 문자열을 **반드시 명시**하면 rename 후처리가 아예 필요 없다. 이번 run은 명시해서 폴더명이 정상으로 나왔다.
