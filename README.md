# Moa Vault

**Moa Studio 자율 회사 OS의 지식베이스 (Obsidian + Git).**

회사가 일하면서 만들어내는 모든 지식(회의 산출물, 결정, 직원 학습)을 마크다운으로 축적해서 → Git으로 자동 백업하고 → 다음 프로젝트에서 다시 활용한다.

설계는 [P-Reinforce 아키텍처](https://github.com/nanumhn/fork-connect-ai)의 "Brain-GitHub Sync" 패턴을 차용 + 우리 자율 OS에 맞게 직원별 학습(Skills)을 추가했다.

---

## 📂 폴더 구조

```
moa-vault/
├─ 00_Raw/                   ← 원본 자료 (자동 수집, 날짜별)
│   └─ 2026-05-30/
│       └─ run_..._드라마기획/
│           ├─ series_bible.md
│           ├─ synopsis_12.md
│           └─ ...
│
└─ 10_Wiki/                  ← 가공된 지식 (큐레이션)
    ├─ Topics/               ← 💡 도메인 지식 (장르/SEO/제작 기법 등)
    ├─ Projects/             ← 🛠️ 프로젝트별 정리
    ├─ Decisions/            ← ⚖️ 형 결재 + 회의 결론 (감사로그)
    └─ Skills/               ← 🚀 직원별 학습 노트 ⭐ 자기개선의 핵심
        ├─ seoa/             ← 이서아의 누적 학습
        ├─ jinwoo/           ← 박진형의 누적 학습
        ├─ siwoo/            ← 강시우의 누적 학습
        └─ ...
```

---

## 🔄 자동화 흐름

1. **회의 종료** → `clo_studio/output/run_*/` 산출물을 `00_Raw/YYYY-MM-DD/`에 자동 복사
2. **형 결재** → `10_Wiki/Decisions/`에 결정 사항 기록
3. **직원 학습** → 회의에서 얻은 인사이트를 `10_Wiki/Skills/<id>/`에 추가
4. **모든 변경** → 자동 `git commit + push` (P-Reinforce `_safeGitAutoSync` 패턴: `pull -X ours`로 로컬 우선)

다음 회의 시작 시: 각 직원의 system_prompt에 본인 `Skills/<id>/` 내용이 컨텍스트로 주입 → **이전 학습을 가지고 발언**.

---

## 🧑‍💻 사람의 사용 (형 + 클로)

- **Obsidian**: 이 폴더를 vault로 열면 [[위키링크]] 그래프로 지식 탐색 가능
- **Git**: `git pull`로 최신, `git push`로 백업 (자동 sync로 대부분 자동)
- **편집**: Obsidian에서 자유롭게 노트 추가/수정. 다음 sync 때 함께 커밋됨

---

## 🔗 관련 레포

- [moa-studio](https://github.com/nanumhn/moa-studio) — 웹 앱 (회의 sync 수신, 형 결재 UI)
- [clo_studio](https://github.com/nanumhn/clo_studio) — Python 회의 엔진 + 직원 페르소나
- [fork-connect-ai](https://github.com/nanumhn/fork-connect-ai) — 설계 차용 원본 (P-Reinforce)
