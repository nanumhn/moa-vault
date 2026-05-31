# 🚀 Skills — 직원별 학습 노트 ⭐

**자기개선의 핵심 메커니즘.** P-Reinforce에 없는 우리만의 추가.

각 직원이 회의·작업을 거치며 얻은 인사이트를 **자기 폴더에 누적**한다. 다음 회의 시작 시 회의엔진이 해당 직원의 system_prompt에 본인 학습 노트를 컨텍스트로 주입 → **이전 학습을 가진 채로 발언**한다.

## 폴더 구조

```
Skills/
├─ seoa/                ← 이서아 (A&R / 콘텐츠본부장)
│   ├─ INDEX.md         ← 학습 색인
│   ├─ 시티팝_큐레이션.md
│   ├─ 트렌드_분석_2026Q2.md
│   └─ ...
├─ jinwoo/              ← 박진형 (작사가)
├─ siwoo/               ← 강시우 (감독)
├─ seorim/              ← 윤서림 (시나리오 작가)
├─ haneul/              ← 민하늘 (캐릭터 디자이너)
└─ ...
```

## 누가 갱신하나

| 트리거 | 누가 | 무엇 |
|---|---|---|
| 회의 종료 직후 | 회의엔진 자동 | "내가 발언한 핵심 포인트 + 다른 직원에게 배운 것" 추출 → `Skills/<id>/notes_YYYY-MM-DD.md` |
| 작업 후 | 직원 자가 (LLM) | "이번 작업에서 새로 알게 된 것" 짧은 메모 |
| 큐레이션 | 형 또는 비서 | 흩어진 노트를 주제로 묶어 `Topics/`로 승격 시 원본 링크 유지 |

## system_prompt 주입 방식 (구현 예정)

```python
# meeting.py 확장
skills_dir = Path(f"moa-vault/10_Wiki/Skills/{agent_id}")
if skills_dir.exists():
    learned = read_recent_notes(skills_dir, max_chars=2000)
    system_prompt += f"\n\n[지금까지 너가 학습한 핵심]\n{learned}"
```

직원의 페르소나(`characters/*.yaml`)는 정체성, Skills 폴더는 **시간이 지나며 자라는 두 번째 두뇌**.
