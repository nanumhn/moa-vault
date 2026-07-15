# seojin 학습 노트

이 폴더는 **seojin** 직원의 누적 학습 기록입니다. 회의·작업을 거치며 얻은 인사이트가 시간순으로 쌓입니다.

다음 회의 시작 시 회의엔진이 이 폴더의 최근 노트들을 **본인의 system_prompt에 컨텍스트로 주입**합니다 → 이전 학습을 가지고 발언.

## 누적 노트

- [2026-07-09] `2026-07-09_n8n_sqlite_readonly_crashloop.md` — n8n DB 소유권 root 오염 → SQLITE_READONLY 크래시루프(RestartCount 폭주). chown node:node 원복으로 해결. 재발방지=컨테이너 파일작업 `-u node`, root 사용 후 즉시 원복. 부수: 5679 broker 우회·node:sqlite 조회·MSYS_NO_PATHCONV·startedAt UTC.

---

**노트 추가 규칙:**
- 파일명: `notes_YYYY-MM-DD.md` 또는 주제별 `주제_슬러그.md`
- frontmatter에 `source`(어디서 배웠는지)와 `tags` 권장
