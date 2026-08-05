---
name: project_ksaju_topic_exhaustion_2026-08-05
description: "k-saju 블로그 글감 44일치가 8/3 소진되며 8/4부터 매일 자동발행 중단 — 원인 진단·cto 수리·main 병합·push 전부 완료(2026-08-05)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 05eeca17-d953-4fd5-9b1a-332286749eca
  modified: 2026-08-05T00:47:03.827Z
---

2026-08-05, 형이 "ksaju 보고 채널에 주기적으로 오는 알림이 뭐냐" + "블로그 최신글이 3일인데 4·5일이 없다"고 문의해 조사.

**근본원인 [확인]**: `D:/Develop/k-saju-blog/tools/pick-topic.js`의 `topics` 배열이 `day:1(2026-06-21)`~`day:44(2026-08-03)`까지 딱 44일치만 하드코딩. 오늘 날짜가 목록에 없으면 `idx = dayN % 44`로 **옛 글감을 처음부터 재활용**하는 폴백으로 빠진다(8/4→day1, 8/5→day2, 8/6→day3...). 재활용된 글감은 원래의 낮은 day값을 갖고 있어서, 내부링크 후보 로직(`topics.filter(t => t.day < topic.day)`)이 "이전 글이 0~1개뿐"이라고 착각 → 필수 내부링크 2개를 못 채움 → `qa-gate.mjs`의 D5_INTERNAL_LINKS로 3회 재생성 전부 BLOCKED → 발행 안 됨 → 매일 08:10 "Alert: Publish Blocked" 알림 반복. 부수적으로 재활용 slug는 이미 발행된 것과 100% 동일이라 통과했어도 GitHub push 충돌 위험.

이 정확한 시나리오는 `tools/topic-discovery.mjs` 파일 최상단 주석에 07-27 시점에 이미 예견돼 있었음("table runs out on 2026-08-03") — 자동 글감 발굴 도구는 그때 이미 만들어졌지만([[project_ksaju_blog_adsense_2026-07-27]] "변수를 하나만 두려고" 의도적으로 미배선) 실제 라이브 워크플로우에 연결이 안 된 채 방치되다 예견된 날짜에 정확히 터짐.

**수리 완료(2026-08-05, cto-seojin)**: modulo 폴백 제거 → ①오늘 날짜 매치 ②없으면 아직 라이브가 아닌 가장 오래된 글감으로 backfill ③그것도 없으면 에러(조용한 재활용 경로 없앰). day45~104(2026-08-06~10-04) 60개 신규 글감 추가(topic-discovery.mjs 실제 실행해 74개 후보 확보 후 수작업 반영). 내부링크 후보를 `topic.day` 추정이 아니라 실제 라이브 slug 목록(`LIVE_SLUGS`, 신규 `sync-live-posts.mjs`가 레포에서 자동 생성) 기준으로 변경 — 예전 방식은 "날짜 지남=발행됨"을 가정했는데 최근 14회 중 6회가 검수 실패로 실제 미발행이었어서 그 가정이 깨져있었음. 신규 회귀 테스트(`topic-table.spec.mjs`, 재고 14일 미만이면 실패)로 재발 방지.

**검증**: 8/6 예행 dry-run 1차 시도 PASS(WOULD PUBLISH), 내부링크 3개 전부 실제 존재 글 확인. n8n 워크플로우에 직접 주입 완료(export→inject→import→재활성화→재export 해시 일치 확인) — 자동화는 push와 무관하게 이미 살아있었음.

**병합·푸시 완료(2026-08-05, 형 결재)**: `fix/topic-table-exhaustion` → `main` merge(--no-ff, e97d4df..bf9375b), origin push 완료. wincredman 자격증명 에러는 `git -c credential.helper= -c "credential.helper=!gh auth git-credential"`로 우회(단순히 `-c "credential.helper=!..."` 하나만 주면 기존 manager 헬퍼가 안 지워져서 여전히 실패함 — 반드시 빈 값으로 먼저 리셋). Vercel 자동배포 걸려있어 곧 사이트 반영. tools/ 폴더가 이번이 첫 커밋으로 정식 편입됨.

**남은 위험**: 최근 6일 중 4일은 글감 문제가 아닌 다른 사유(C4_TITLE_ECHO 제목 반복·D2_UNSOURCED_STAT 근거없는 숫자·D7_CTA_MISLINK)로 막혔음 — 이번 수정 범위 밖, 별도 관찰 필요. 재고 경보가 디스코드까지는 안 감(테스트에만 표시) — 주1회 `topic-table.spec.mjs` cron 권장(에이전트 제안, 미채택).

**How to apply**: 확장 예정 자산(topics 배열, seeds.json)이 있는 파이프라인은 "소진 시점"을 코드 주석/날짜로 미리 계산해두는 습관이 실제로 도움됨(이번에 그 주석 덕에 원인 특정이 빨랐음). 비슷한 구조(고정 N개 테이블 + 모듈로 폴백)를 다른 곳에서도 보면 의심할 것.

관련: [[project_ksaju_blog_adsense_2026-07-27]] [[reference_ksaju_daily_report_channel_2026-08-05]]
