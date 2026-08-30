---
name: project_open_threads_2026-08-30_afternoon_snapshot
description: "2026-08-30 오후 세션 저장 스냅샷 — 인스타 캐러셀 9004 미해결 조사중, 블로그 Vercel 도메인 장애, access.json 반영 안 됨"
metadata:
  type: project
  modified: 2026-08-30T05:27:00.000Z
---

**컨텍스트**: 2026-08-30 재부팅 복구 세션. 이슈 스레드(https://discord.com/channels/1283928656363782184/1541841218521006181, "[실전 이슈 001] 케이사주 Instagram 카드 5장 자동 발송 개선·배포")에서 클로·덱스·cto-seojin 협업 진행 중, 세션 리셋 시점에도 미해결.

## ① 인스타그램 캐러셀(@ksaju.daily) 자동발행 실패 — 미해결
- `ksajuCarouselV5` n8n 워크플로 08-27부터 실패(code 9004/subcode 2207052 "미디어 다운로드 실패"). progressive JPEG·파일용량·payload차이·media_type오지정·코드회귀·특정카드결함 전부 반증됨.
- 유력 가설(미확정): Meta 레이트리밋 누적(3→2→1→0 패턴, 06-22 유사전례 `reference_n8n_ig_meta_block.md` — 시각랜덤화 미적용 상태). 단 223→229/230 완전회복 반례 있어 확정 아님.
- A/B 대조시험(형승인·클로실행): 성공/실패 당시 배포 URL 둘 다 지금은 컨테이너생성 성공 — 완전차단 아님, 간헐적 가능성.
- 다음 단계 대기: 덱스 설계 순차(Loop Over Items+FINISHED확인) 시험 워크플로, cto가 1차 작성했으나 덱스 독립검수에서 FINISHED 폴링루프 없음으로 반려, 보정 지시함(cto 작업중, 결과 미수신).
- 별건 보안: n8n "Send to Discord" 노드에 웹훅URL 평문 하드코딩 발견, 미처리(형결재 대상).

## ② blog.k-saju.me 배포 장애 — 미해결
- n8n 자동생성(매일 08:10)은 정상 커밋 중, GitHub/Vercel "success" 찍히는데 프로덕션 도메인엔 8/20 이후 미반영. Vercel 도메인 설정 문제로 추정. 클로 세션엔 vercel CLI/토큰 없어 형이 대시보드 직접 확인 필요.

## ③ 아투(american-todayz) — 해결됨
- 오전 06:00 자동발행 실패(재부팅 겹침 추정) → 클로 수동재시도 성공: 블로그(american-todayz.com/2026/08/650.html 10:51 KST)·쇼츠(youtube.com/shorts/qnDSPHZBmkw 11:53 KST) 완결.

## ④ 하네스 훅 결함 — 수정완료
- `guard-silence-and-delegation.mjs` 위임관문이 tool_result에 승인문구 밀려나 워커 오차단하던 결함, 덱스가 수정+회귀시험5/5 통과, cto 실물통과 확인(saju-studio card-jpeg baseline패치 커밋 6c9ffaa 성공 — 단 이 패치 자체는 나중에 progressive 무죄로 판명되어 실제원인 아니었음, 유지는 무해).

## ⑤ Discord 채널 허용목록 — 반영 안 됨
- 형이 `/discord:access group add 1543476607715643393` 터미널 직접실행, access.json 정상반영 확인됐으나 fetch_messages는 여전히 "not allowlisted". discord-server 프로세스가 시작시에만 읽고 라이브 재반영 안 하는 것으로 추정, 재시작 필요 여부 형 결정 대기 중.

## ⑥ MOC 갱신 — archive-head-haru 위임중, 결과 미확인
- 낡은 MOC 4개(아메리칸투데이·쇼츠자동화·k-saju·네이버블로그SaaS) 갱신+오늘일지+커밋/푸시 위임(agent: morning-session-report). 다음 세션에서 결과 확인·형보고 필요.

## 세션 cron 재등록 필수
리셋되면 세션cron 7개 전부 소실. 다음 세션 시작시 재등록.
