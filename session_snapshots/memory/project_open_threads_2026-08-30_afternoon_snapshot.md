---
name: project_open_threads_2026-08-30_afternoon_snapshot
description: "2026-08-30 오후 세션 저장 스냅샷 — 인스타 캐러셀 9004 미해결 조사중, 블로그 Vercel 도메인 장애, access.json 반영 안 됨"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1fa821aa-8b88-40f6-9670-cbe9619a4046
  modified: 2026-08-30T05:26:18.276Z
---

**컨텍스트**: 2026-08-30 재부팅 복구 세션. 이슈 스레드(랩실 채널 https://discord.com/channels/1283928656363782184/1541841218521006181, 제목 "[실전 이슈 001] 케이사주 Instagram 카드 5장 자동 발송 개선·배포")에서 클로·덱스·cto-seojin 협업 진행 중, 세션 리셋 시점에도 미해결.

## ① 인스타그램 캐러셀(@ksaju.daily) 자동발행 실패 — 미해결, 조사 중
- 증상: `ksajuCarouselV5` n8n 워크플로가 08-27부터 계속 실패(code 9004, subcode 2207052 "미디어 다운로드 실패"). 최근(241 이후) 매번 hook-card(1번째)에서 즉시 실패, 그 전(233·237)엔 각각 2·3번째까지는 성공.
- **반증 완료된 가설**: progressive JPEG(실행230 성공 당시 이미지도 progressive였음 확인), 파일 용량(실패쪽이 오히려 작음), payload 파라미터 차이(230 vs 233 완전 동일), media_type 오지정(애초에 그 필드 자체가 없음), n8n 코드 회귀(08-26/08-27 동일), 특정 카드 콘텐츠 결함(매번 다른 카드에서 실패).
- **유력 가설(미확정)**: Meta 레이트리밋/다운로드 스로틀 누적(3→2→1→0 감소 패턴, 06-22 유사 전례 `reference_n8n_ig_meta_block.md` 있음 — 매일 정확히 같은 초에 발화하는 봇 패턴이 Meta 비정상활동 탐지에 걸린 전례. 이 워크플로엔 시각 랜덤화 미적용 상태였음). 단, 223(08-25) 이후 229·230(08-26/27)에 완전 회복(5장 성공)한 반례가 있어 "단조감소가 결정적 증거"는 아님 — 233 이후 구간에서만 그 패턴 관측.
- A/B 대조시험(형 승인, 클로 직접 실행): 실행230 성공당시 배포 URL과 실행233 실패당시 배포 URL 둘 다 지금 이 순간엔 컨테이너 생성 성공 — 완전 차단 상태는 아님, 간헐적 가능성.
- n8n 구조 확인: `Create Child Container`가 5개 아이템을 **병렬**(Promise.allSettled) 처리, 재시도 로직 없음(retryOnFail 미설정), `Collect Children`에 "5개 아니면 중단" 안전장치 있음(부분발행 방지).
- **다음 단계(형 승인 대기 중, 미실행)**: 덱스 설계 — 비활성 시험 워크플로로 순차(Loop Over Items batch 1, 각 컨테이너 FINISHED 확인 후 다음) 처리 시험. cto-seojin이 시험 JSON 만들었으나(`C:\Users\user\AppData\Local\Temp\claude\D--Develop-Claude-Channels\1fa821aa-8b88-40f6-9670-cbe9619a4046\scratchpad\serial_test_wf.json`, SHA-256 `1BB41EF20689FCD69709141D879A1C1FD18CF8E50274FFE0575E084D7D279E87`) `n8n import:workflow`가 cto 세션 classifier에 막혀 미투입. 덱스가 독립검수 중 "FINISHED 확인 관문이 파일 전체에서 확인 안 됨"(단발 조회 후 바로 다음으로 넘어가는 연결로 보임) 지적, import 보류 중.
- 별건 보안 발견(미처리): n8n 운영 워크플로 "Send to Discord" 노드에 디스코드 웹훅 URL 평문 하드코딩됨. Credential로 이전 필요(형 결재 대상, 급하지 않음).
- **How to apply**: 다음 세션에서 이 스레드 이어서 열고 진행상황부터 확인할 것. n8n(localhost:5678) 자동 스케줄(`Every Day 08:00`) 비활성화 여부도 형 결재 대기 중이었을 수 있음 — 확인 필요.

## ② blog.k-saju.me 배포 장애 — 미해결
- 증상: n8n 자동생성 파이프라인(매일 08:10 KST)은 정상 커밋 중(오늘도 08:30 08:21 커밋됨)이고 GitHub/Vercel 배포도 "success" 찍히는데, 프로덕션 도메인(blog.k-saju.me)엔 8/20("do-twins-have-the-same-saju") 이후 아무 글도 반영 안 됨. 도메인이 최신 배포를 안 받는 것으로 추정(Vercel 프로젝트 설정 문제로 보임).
- 클로 세션엔 vercel CLI/토큰 없어서 더 파볼 수단 없음 — 형이 Vercel 대시보드 직접 확인 필요한 상태로 대기 중.

## ③ 아투(american-todayz) — 해결됨
- 오늘 오전 06:00 자동발행 실패(재부팅 겹침으로 추정) → 클로가 수동 재시도(atz_scheduled.ps1)로 성공: 블로그 `american-todayz.com/2026/08/650.html`(10:51 KST), 쇼츠 `youtube.com/shorts/qnDSPHZBmkw`(11:53 KST). 완결.
- 08-27 보류큐(`out/held/2026-08-27T10-40-01-517Z_pm.json`, 본문 길이미달만)는 손 안 댐, 정기 보류큐 cron(15 7,21 * * *)이 처리할 것.

## ④ 하네스 훅 결함 — 수정 완료
- `.claude/hooks/guard-silence-and-delegation.mjs`의 위임관문이 `latestUserText()`가 최근 user 레코드 하나만 보는데 tool_result도 user타입이라, 워커가 수정 전 Read/Bash 한 번만 해도 승인문구가 밀려나 오차단되던 구조적 결함. 덱스가 수정 완료 + 회귀시험 5/5 통과, cto-seojin 실물 통과 확인됨(saju-studio card-jpeg baseline 패치 커밋 `6c9ffaa`는 이 수정 덕에 성공했음 — 다만 이 패치 자체는 나중에 위 ①에서 progressive 무죄로 판명돼 실제 장애 원인은 아니었음, 그래도 유지 무해).

## ⑤ Discord 채널 허용목록 — 반영 안 됨(미해결)
- 형이 `/discord:access group add 1543476607715643393`를 터미널에서 직접 실행(정상 절차), access.json에도 정상 반영됨[확인: 파일 직접 확인]. 그런데 `fetch_messages`로 그 채널 재시도해도 여전히 "not allowlisted" — 채널서버가 즉시 재반영 안 하는 것으로 보임(추정, 스킬 문서상엔 자동 재반영이라고 돼 있는데 실제로는 세션/서버 재시작이 필요할 수도 있음). 다음 세션에서 리셋 후 재시도해볼 것.
- 그 채널(1543476607715643393)은 형이 "결재승인 표준 양식" 예시를 올린 곳 — 못 봐서 아직 형이 요구한 정확한 양식(🟪🟪🟪 결재 요청 🟪🟪🟪 등, 덱스·제나가 자기들도 실제로는 못 봤다고 정정한 바 있음)을 확정 못 함. 지금까지 쓰던 `> 결재 요청` / 무엇을·왜·얼마나·위험·되돌리기 / `선택: 승인/보류/반려(취소)` 양식 그대로 계속 사용 중.

## ⑥ MOC 갱신 — archive-head-haru에게 위임, 진행 중(결과 미확인)
- 4개 낡은 MOC(아메리칸투데이·쇼츠자동화·k-saju·네이버블로그SaaS) 갱신 + 오늘 일지(`70 Record\2026-08-30.md` ## 🌅 오전 세션) 작성 + git commit/push를 archive-head-haru에게 위임함(agent name: morning-session-report). 완료 결과 아직 못 받음 — 다음 세션에서 결과 확인 후 형께 보고 필요.

## 세션 cron 재등록 필요
이 세션이 리셋되면 세션 cron 7개(라이브저장×2·세션마감보고서×2·주간전략리포트·아투보류큐·주간수익리뷰) 전부 사라짐. 다음 세션 시작 시 CLAUDE.md/session_bootstrap.md 지시대로 재등록 필수.
