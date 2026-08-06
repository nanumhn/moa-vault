# 볼트 구조 개편 스펙

## 신규 생성 파일 목록 (총 10개)
| # | 경로 | 종류 | 목적 |
|---|---|---|---|
| 1 | 02 Projects/k-saju-project.md | 프로젝트 허브 노트 | k-saju 프로젝트 정보 저장 |
| 2 | 02 Projects/atu-project.md | 프로젝트 허브 노트 | ATU 프로젝트 정보 저장 |
| 3 | 71 TODO Finish/2026-08-XX.md | 회고 노트 | 주간 회고 및 성과 분석 |
| 4 | 01 Dashboard/Todo.Kanban.md | 칸반 보드 | 개발자 작업 추적 |
| 5 | 01 Dashboard/Archive.md | 카드 아카이브 | 완료된 작업 저장 |
| 6 | 70 Record/YYYY-MM-DD.md | 업무일지 | 하루별 업무 기록 |
| 7 | 90 Templates/project.md | 프로젝트 템플릿 | 프로젝트 노트 초기화 |
| 8 | 90 Templates/task.md | 작업 템플릿 | 작업 카드 초기화 |
| 9 | 90 Templates/review.md | 주간 회고 템플릿 | 주간 회고 작성 가이드 |
| 10 | 90 Templates/drift_alert.md | 드리프트 경보 템플릿 | 드리프트 확인 및 경보 |

## 프로젝트 노트 프론트매터 스키마
```yaml
---
type: project
status: 
owner: 
started: 
tags: 
---
```
- `status`: 작업 상태 (예: 진행 중, 완료 등)
- `owner`: 프로젝트 담당자
- `started`: 시작 일자
- `tags`: 관련 태그

## 작업(태스크) 노트 프론트매터 스키ma
```yaml
---
type: task
project: 
status: 
priority: 
due: 
progress: 
---
```
- `project`: 해당 작업이 속한 프로젝트명 (예: k-saju)
- `status`: 작업 상태
- `priority`: 우선순위
- `due`: 마감 일자
- `progress`: 진행 상황

## 프로젝트 허브 노트 골격 (예시 1개 완성)
```markdown
---
type: project
project_name: "k-saju"
status: "진행 중"
priority: "중요"
due_date: "2026-08-15"
tags:
- urgent
- DT3
---

# k-saju 프로젝트
## 작업 내용
- [ ] 기능 개발 완료 (80%)
- [ ] 테스트 및 버그 수정 (10%)

## 관련 링크
> 관련: [[02 Projects/k-saju-project.md]] · [[모아 시스템 가이드]] · [[모아 자산 목록]]
```

## 태그 체계
| 태그 | 용도 | 칸반 색상 등록 필요? |
|---|---|---|
| urgent | 급한 작업 표시 | ✔️ |
| DT3 | DT3 프로젝트 표시 | ✔️ |
| PlayList | 플레이리스트 관리 관련 | ✔️ |

## Dashboard dataview 쿼리 (실제 문법)
### 진행 중 작업
```dataview
TABLE project_name AS "프로젝트명", status AS "상태", progress AS "진행률"
FROM "02 Projects/*"
WHERE status = "진행 중" OR status = "대기 중"
```
### 이번 주 완료
```dataview
TABLE project_name AS "프로젝트명", status AS "상태", due_date AS "마감일"
FROM "02 Projects/*"
WHERE status = "완료" AND due_date = DATENOW()
```
### 막힌 작업
```dataview
TABLE project_name AS "프로젝트명", status AS "상태", priority AS "우선순위"
FROM "02 Projects/*"
WHERE status = "차단됨" OR status = "보류"
```

## 기존 TODO.Kanban.md와의 공존
- `TODO.Kanban.md`를 수정하지 않으면, 새로운 작업 카드는 `01 Dashboard/Todo.Kanban.md`에서 추가됩니다.

## 업무일지 '관련:' 줄 자동 채우기 규칙
- 판별 기준: 해당 날짜에 건드리거나 작업한 프로젝트 노트를 확인하여, 그 프로젝트 노트와 관련된 태그 및 백링크를 분석합니다.
- 출력 형태: `> 관련: [[프로젝트A]] · [[프로젝트B]] · 지난 기록: [[전날]]`