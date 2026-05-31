# 00_Raw — 원본 자료

회사가 만들어내는 **원본 산출물**을 가공 없이 그대로 보관하는 영역. 가공·정리는 `10_Wiki/`에서 한다.

## 보관 규칙

- **날짜별 폴더**: `YYYY-MM-DD/` 형식 (예: `2026-05-30/`)
- 하위에 회의 run 또는 단위 작업별로 폴더 또는 파일
- 원본은 **수정하지 않는다** — 수정이 필요하면 `10_Wiki/`에 새로 만든다

## 자동 수집

- `clo_studio/output/run_*/` 회의 산출물 → 회의 종료 시 자동 복사
- moa-studio의 영상/이미지 산출물 메타 → 작업 종료 시 자동 기록 (예정)

## 예시

```
00_Raw/
├─ 2026-05-30/
│   └─ run_20260530_032730_드라마기획/
│       ├─ series_bible.md
│       ├─ synopsis_12.md
│       ├─ production_pipeline.md
│       ├─ character_sheet.md
│       ├─ concept_direction.md
│       └─ meeting.json
└─ 2026-06-01/...
```
