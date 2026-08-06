# 옵시디언 운영 규약 (Obsidian Ops Playbook)

## 한 줄 목적
현재 칸반 보드가 비어 있고 일지는 고립된 섬인 상태를 개선하고, 모아 프로젝트에 대한 체계적인 관리를 도입한다.

## 역할 분담 (RACI)
| 담당 | 쓰는 파일 | 언제 | 내용 |
|---|---|---|---|
| archive-head-haru | 70 Record/YYYY-MM-DD.md | 매일 13:48 / 03:44 | 일지 작성 + 관련 링크 삽입 |
| archive-head-haru | 02 Projects/K-saju.md | 일별 | K-saju 프로젝트 허브 노트 작성/수정 |
| archive-head-haru | 02 Projects/American-todayz.md | 일별 | 아투 프로젝트 허브 노트 작성/수정 |
| archive-head-haru | 02 Projects/Dex-jeuna.md | 일별 | 덱스제나 프로젝트 허브 노트 작성/수정 |
| archive-head-haru | 02 Projects/Shorts-automate.md | 일별 | 쇼츠 자동발행 프로젝트 허브 노트 작성/수정 |
| archive-head-haru | 02 Projects/AdSense-blog.md | 일별 | 애드센스 블로그 프로젝트 허브 노트 작성/수정 |
| qa-lead-jian | 70 Record/YYYY-MM-DD.md | 매일 오후 13:48 이후 | 일지 검수 |

## 일일 타임라인
| 시각 | 주체 | 행동 |
|---|---|---|
| 8:00 | archive-head-haru | '01 Dashboard/TODO.Kanban.md' 확인 |
| 9:00 | archive-head-haru | '02 Projects' 폴더 프로젝트 허브 노트 작성/수정 시작 |
| 13:48 | archive-head-haru | 일지 작성 (70 Record/YYYY-MM-DD.md) |
| 15:00 | archive-head-haru | dataview 쿼리 기반 자동 대시보드 '01 Dashboard/Dashboard-View.md' 업데이트 |
| 23:44 | archive-head-haru | 일지 작성 (70 Record/YYYY-MM-DD.md) |
| 23:59 | qa-lead-jian | 일지 검수 및 확인 |

## 주간 타임라인 (월요일)
| 시각 | 주체 | 행동 |
|---|---|---|
| 8:00 | archive-head-haru | '01 Dashboard/TODO.Kanban.md' 확인 |
| 9:00 | archive-head-haru | '02 Projects' 폴더 프로젝트 허브 노트 작성/수정 시작 |
| 13:48 | archive-head-haru | 일지 작성 (70 Record/YYYY-MM-DD.md) |
| 15:00 | archive-head-haru | dataview 쿼리 기반 자동 대시보드 '01 Dashboard/Dashboard-View.md' 업데이트 |
| 23:44 | archive-head-haru | 일지 작성 (70 Record/YYYY-MM-DD.md) |

## 카드 생명주기
대기 중 → 진행 중 → 완료

- 대기 중 → 진행 중: 프로젝트 허브 노트에 작업이 추가되면 이동.
- 진행 중 → 완료: '02 Projects' 폴더의 프로젝트 허브 노트가 업데이트되고, 마지막으로 수정일자가 기록되면 이동.

## 하지 않는 것 (범위 밖)
- 형에게 카드 이동을 수작업으로 시키는 안은 불가능하다.
- 옵시디언 앱 UI 조작을 통한 자동화는 가능하지만, 마크다운 파일 직접 편집으로만 수행한다.

## 기존 방식과의 경계
- moa-vault (내부 학습)와 owenlab (형용 문서)는 별도로 관리하며, 서로 다른 역할을 담당한다. 모아 프로젝트 허브 노트는 '02 Projects' 폴더에 생성되며, 일지는 각 프로젝트 허브 노트를 백링크하여 체계적으로 관리된다.

## 도입 순서 (Day 1 / Week 1 / Week 2)
1. **Day 1**
   - '01 Dashboard/TODO.Kanban.md'을 건드리지 않고 그대로 두는 것.
   - '02 Projects' 폴더에 프로젝트 허브 노트 생성 (K-saju, 아투, 덱스제나, 쇼츠, 애드센스).
   - '70 Record/YYYY-MM-DD.md' 일지 작성 및 관련 링크 추가.
   
2. **Week 1**
   - dataview 기반 자동 대시보드 '01 Dashboard/Dashboard-View.md' 생성 및 유지 관리.
   - '02 Projects' 폴더의 프로젝트 허브 노트를 일별로 작성/수정.
   
3. **Week 2**
   - 칸반 보드와 대시보드의 상태가 프론트매터 `status` 필드에 따라 동기화.
   - 드리프트 감지 및 경보 체계 구축 (7일 이상 변화 없으면 경보).