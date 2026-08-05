---
name: project_atz_shorts_autopublish_fix_2026-08-04
description: "아투 쇼츠 자동발행이 8/1~8/4 4일 연속 승인대기로 떨어진 근본원인 3개 수정 — 8/5 06:30 실전 검증 성공(★확인)"
metadata: 
  node_type: memory
  type: project
  originSessionId: d928a4f0-ac42-4253-b048-26497dcdde2e
  modified: 2026-08-04T22:21:53.748Z
---

2026-08-04, 형이 ShortsID UBEy7QQeNiE 발행 요청 + "검수에 문제 있으면 보완 지시하고 발행" 지시로 조사 착수.

**발견**: 08-02 정책("쇼츠는 검수 통과하면 자동 발행")이 실제로는 한 번도 발동하지 않았다. shouldAutoPublish()는 qa.pass 전체 통과(경고 0건)를 요구하는데, 4일 연속 SEO 제목 경고(또는 08-01 썸네일 결손) 하나 때문에 매번 승인대기로 떨어졌다.

**근본원인 3개** (cto-seojin 조사, `D:/Develop/moa-studio/tools/atz-pipeline/shorts-script.mjs`):
1. 기사 제목에 큰따옴표가 섞이면 LM이 JSON 문자열 값 안에 그대로 베껴 파싱 실패 (08-04 재현)
2. 파싱 실패 시 규칙 폴백이 제목을 `·`(가운뎃점) 기준으로 무조건 앞토막만 잘라 저품질 제목 생성(중복·따옴표 짝 안 맞음). 실측 4건 모두 원제목이 20~42자였는데 자를 이유가 없었다.
3. 사전검사(auditMeta, 기사 제목 첫 고유명사 기준)와 실제 QA 게이트(qa-gate.mjs, article.coreKeyword=keywords[0] 기준)가 서로 다른 키워드를 봐서 사전검사가 게이트를 예측 못 하는 구조였음.

**수정**: safeQuotes(모델 입력 정규화) + parseLmJson/repairJsonQuotes(관대한 파싱, 엄격 우선) + fallbackMeta 재작성(원제목 우선·중복 방지·어절 경계 절단) + withCoreKeywordFirst(사전검사·게이트 값 통일). qa.pass 기준 자체는 안 건드림(형이 08-02에 의도적으로 보수적으로 정한 정책). 신규 테스트(shorts-meta.test.mjs)로 8/2~8/4 실제 데이터 재생 40개 전부 pass, 기존 스위트 회귀 없음.

**상태**: 로컬 커밋(ae3cd5e, feat/youtube-publish-wiring) 완료, **push는 형 결재 대기**(기존 미푸시 10건 뒤에 쌓임).

**Why**: 자동발행이 이름만 자동이고 실제로는 매일 사람이 승인해야 했던 게 진짜 문제였음 — 정책 자체가 아니라 구현이 정책에 도달하지 못하고 있었다.

**How to apply**: [[project_atz_hallucination_fix_2026-07-27]]·[[reference_atz_gate_blindspot_plain_claims]]와 같은 계열(게이트/파이프라인 버그). tools/atz-pipeline의 쇼츠 모듈 다수가 여전히 git 미추적 상태로 남아있음(별도 백로그, 이번에 손 안 댐).

**★2026-08-05 06:30 실전 검증 [확인] 성공**: 06:38 KST 신규 쇼츠 정상 자동발행 확인(https://www.youtube.com/shorts/Ugkg__14jfA, 제목 "엔화 떠받친 미국, 원화 변동성과 대미 투자 영향은 #Shorts" — 잘림·중복 없이 깨끗). shorts_script postId=6503443531339619794, audit.pass:true·blocking:[]. 8/1~8/4 매일 생성되던 shorts_alert(승인대기) 파일이 8/5은 아예 생성 안 됨 — 승인대기 없이 바로 발행. 형에게는 Discord MCP de-allowlist 장애([[reference_discord_mid_session_deallowlist_2026-08-01]])로 웹훅 폴백(SystemLogs 채널)으로 보고함, 메인 채널 재확인 필요. push는 여전히 결재 대기.
