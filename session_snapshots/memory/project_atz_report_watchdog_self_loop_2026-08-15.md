---
name: project_atz_report_watchdog_self_loop_2026-08-15
description: 아투 보고채널 감시(moa_atz_report_watchdog_external.ps1)가 자기 알림을 자기가 재검출하는 자기참조 루프였음 — 원인 확정+수리 완료. AM글 팩트체크는 문제없었음
metadata:
  type: project
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-14T23:44:15.597Z
---

2026-08-14 21:08(KST 08-15 06:08) 아투 AM 슬롯 자동발행봇이 "⚠️ 다시 읽어보니 어긋난 게 있습니다"(발행 후 재조회 verify 값 불일치)를 1회 보고했다. 그런데 형 메인채널에 06:10~07:40(KST) 사이 9번, 10분 간격으로 같은 경고가 계속 재발송됐고 "N건 발견" 숫자도 늘어나며 형이 그 사이 응답을 못 받아 클로에게 재시작을 요청하는 사건까지 겹쳤다.

**원인(확정)**: `C:\Users\user\.moa\moa_atz_report_watchdog_external.ps1`이 자기가 보낸 알림을 **감시 대상 채널(보고채널)에도 같이 올리도록**(2026-08-08 형 지시, 라이브 세션이 그 채널에서도 바로 인지하게) 만들어져 있었는데, 그 알림 본문이 원본 카드의 "⚠️" 문자를 인용문 그대로 포함하고 있어서 **다음 폴링(10분 후)에 자기 알림 자체를 "새 경고"로 재검출**했다. 재검출된 알림을 또 양쪽 채널에 올리니 그 안에도 ⚠️가 남아있어 계속 반복. 9회(~90분) 중첩되며 인용 프리뷰가 300자 truncate 밖으로 ⚠️를 밀어낼 때까지 우연히 멈췄을 뿐 구조적으로는 무한루프였다.

**수리(완료)**: `$selfMarker = '[아투 보고채널 감시]'`로 시작하는 메시지는 애초에 실패 검출 대상에서 제외하도록 필터 추가. 패치 후 1회 실행해서 정상(OK) 확인함.

**참고 — 원본 AM글 자체는 문제없었음**: 실제 발행 URL(https://www.american-todayz.com/2026/08/9-15.html)을 직접 열어 원문 소스(VOA, `2026-08-14T21-00-11_am_sources.txt`)와 대조했는데 수치(25kg·100%·25%·180일·9월3일·2029년1월20일·15%/10%) 전부 일치, 팩트 오류 없음. `originality.pass: false`(헤지 표현 밀도 초과, 10.2/1000자 vs 기준 3)는 있었지만 이건 발행 게이트에 안 걸리는 기존 정책([[project_atz_originality_policy_2026-07-28]] — 아직 모니터링 단계, 3회연속100%전엔 강제안함)이라 정상 동작. verify 불일치의 정확한 원인(제목/라벨/이미지수 diff 중 어느 항목이었는지)은 저장된 result.json엔 모두 일치로 남아있어 특정 못함 — Blogger API 발행 직후 read-after-write eventual consistency로 추정.

관련: [[project_discord_external_watchdog_2026-08-05]] [[project_atz_originality_policy_2026-07-28]] [[reference_atz_pipeline_live_url_truth]]
