---
name: project_open_threads_2026-08-17_afternoon_snapshot
description: "2026-08-17 14시 오후 세션저장 스냅샷 — 최우선=n8n docker restart 형답변대기(k-saju게이트 재실행 막힘), Meta 앱 심사 계속 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5b69d1f6-1f0a-499b-a3c2-cae15069bb8f
  modified: 2026-08-17T05:25:30.428Z
---

**최우선 대기 (형 액션 필요)**:
1. **n8n `docker restart n8n`** — k-saju 블로그 게이트 보강(A13/D10, 오행상극 오배치+비교주제 미다룸 방지) 코드가 이미 주입됐는데 컨테이너 재시작이 없으면 반영 안 됨. 재시작 전엔 옛 게이트인 채로 사실오류 있는 글이 발행될 위험 있어 seojin-atz-requeue가 재실행 대기 중.
2. **Meta 앱 심사** — 인스타 댓글→DM 캠페인(k-saju) 전체가 이거 하나에 걸려있음. 비즈니스 인증 확인·앱ID/시크릿·Redirect URI 등록 필요, 형이 콘솔에서 직접 진행 중.
3. **소소한 결재 이력**: A($50 예산 용도변경)=홀딩 확정. B(댓글수집=생년월일→띠)=승인 확정(개인정보 이유). 둘 다 처리 완료.
4. **주간전략리포트(W34) 결재 4건** 미답변: Reddit 게시(52일 대기, 형 5분), nblog 네이버약관 리스크 대응방식(4택 중 ⓑ추천), 편집책임자 표기 이름(ⓐ실명/ⓑ모아스튜디오 추천/ⓒ필명), healthchecks.io 무료계정 승인.
5. **쿠팡파트너스** — american-todayz 쇼츠 설명란 템플릿은 준비완료(env주입 방식), 실제 제휴링크는 형이 발급 필요. 덱스한테 어떤 상품/카테고리가 맞을지 리서치 배정함(그들만의업무 채널).

**오늘 완료된 것 (참고용)**:
- nBlog 배포 완료(릴리스 `20260817103602`, 4개 커밋: 모바일사이드바·관리자애드온토글·블로그3개애드온·파트너클럽초대장)
- 인스타 댓글→DM 캠페인 인프라 100% 완성(웹훅·OAuth·캐러셀 5장+12띠캐릭터카드 C안·DM문구), 게시는 Meta심사 대기 중이라 미게시
- 인스타 자동게시 57일 장애 복구(원인 재규명: facebook호스트설 오진→실제는 PNG포맷 문제, JPEG라우트 배포 완료)
- 아투 AM슬롯 블로그+쇼츠 정상 발행(이미지버그 수정), PM슬롯은 근거부실로 폐기
- 주간전략리포트 W34 QA 최종PASS, 웹훅 발송 완료
- 세션 한도 이슈 1회 발생·10am리셋으로 자동 해소됨(계정 공용 사용량 한도임을 형께 확인)

**살아있는 서브에이전트**: seojin-atz-requeue(대기, n8n재시작 기다림), seojin-dm-campaign(대기, Meta값 기다림), yoonseul-dm-campaign(대기), siwoo-zodiac-characters(작업없음, 대기), jiyoung/jian(주간리포트 완료로 임무종료), haru-morning-journal(오전일지 작성중)
