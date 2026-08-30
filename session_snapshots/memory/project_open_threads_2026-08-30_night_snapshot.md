---
name: project_open_threads_2026-08-30_night_snapshot
description: "2026-08-30 밤 세션 저장 스냅샷 — IG 캐러셀 토큰 문제 해결·노드 참조버그 3건 수리, 자식컨테이너 생성 시험만 미완"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-30T19:27:40.057Z
  originSessionId: 7234edbe-5f3b-4050-8a20-bf11e27ddba4
---

**컨텍스트**: 이슈 스레드(랩실 채널, "[실전 이슈 001] 케이사주 Instagram 카드 5장 자동 발송 개선·배포")에서 클로·덱스·형 협업 지속 중. 세션 리셋 시점에도 미해결.

## 오늘 밤 진행 요약

1. **Meta 토큰 완전 만료 확인 → 재발급 → n8n 노드 참조버그 3건 발견·수리 완료**
   - 기존 토큰이 OAuth 190(파싱 실패)로 완전 만료된 것 확인. 형이 Meta Graph API Explorer에서 페이지 액세스 토큰 재발급(첫 발급분은 2~3분 만에 만료돼 재시도 필요했음 — Explorer 토큰이 매우 단명임을 실측 확인).
   - `ksajuCarouselV5` 운영 워크플로의 "Get IG User ID" 노드가 `graph.instagram.com/me` 방식(개인 로그인)에서 `graph.facebook.com/{페이지ID}?fields=id,name,instagram_business_account` 방식(페이지 토큰)으로 이미 바뀌어 있었는데, 이 노드 출력 구조 변경(`.id`가 이제 페이지ID를 가리킴)을 다운스트림 3개 노드가 반영 못 하고 옛 `.json.id`(예전엔 Instagram ID 자체였음) 참조를 그대로 쓰고 있던 버그를 클로가 발견. `Create Child Container`·`Create Carousel Container`·`IG Publish Carousel` 전부 `.json.instagram_business_account.id`로 수정·저장 완료(운영 워크플로에 이미 반영됨).
   - 격리 테스트(임시 워크플로 `Q7vQF3r0LuHVRGVZ`, GET 단독)로 새 토큰 정상 작동 확인: 페이지ID `1233141253212007`, Instagram 계정ID `17841416122910487`, username `ksaju.daily` 전부 일치. 이 임시 워크플로는 형 승인 받아 Archive 처리(완전삭제 아님), 백업 SHA-256 `6F883CCBA0D4183129F4463DE6682CE354E54E104CE430013873E2BE8D05AA7B`(`C:\Users\user\Downloads\My workflow.json`).

2. **자식 컨테이너(media) 1건 생성 시험 — 미완, 다음 세션 최우선 과제**
   - 새 임시 워크플로 `FgJDPb3uix8pGKH4`("My workflow 2")를 만들었으나, 실제 Meta 쓰기요청(POST .../media) URL을 입력하려는 순간 **클로 자신의 Claude Code 세션 하네스(자동모드 분류기)가 차단**함("Blocked by classifier") — 우회 시도 안 함. 이 워크플로는 Method=POST만 선택된 빈 상태로 남아있음(URL·인증·바디 전부 미입력).
   - 형이 Meta 개발자 콘솔(Graph API Explorer)에서 직접 POST 시도 중이었으나 세션 종료 시점까지 완료 확인 안 됨(파라미터 입력 방법 안내는 여러 차례 드림, 마지막엔 "12:00 PDT 만료" 토큰 표시가 나와서 재발급 필요할 수도 있음 — 형이 n8n credential을 최신 걸로 재저장했는지 미확인 상태로 끝남).
   - 읽기전용 진단 결과(최신): image_url(`https://k-saju.me/api/og/card-jpeg?card=daily-card&fmt=square&d=2026-08-31`) GET 200/image/jpeg/180280바이트, 매직바이트 정상, **SOF 마커 FF C0(Baseline) 확인 — progressive 아님**. Create Child Container body에 media_type 키 없음(정상으로 보임, Meta 공식문서 재확인은 안 함[추측 아님이라고 표기했었으나 사실 미확인 상태]).
   - **다음 세션 할 일**: ① n8n credential이 유효한(비만료) 토큰으로 저장돼 있는지부터 재확인 ② 유효하면 형이 Explorer에서 자식 컨테이너 1건 POST 시도 계속하거나, 덱스 CLI로 처리(클로 세션은 이 특정 액션이 하네스에 막혀서 직접 실행 불가한 것으로 확인됨 — 다음 세션에서도 같을 가능성 높음, 형에게 위임하거나 덱스 경유 필요).

## 오늘 밤 사고 — 클로 책임 인정
- "Build 5 Slides" 노드만 단독 실행하면 안전할 거라 판단(제안: 클로, 검증 없이 승인: 덱스)했는데, n8n이 캔버스 연결선을 따라 상위 체인 전체(Send to Discord 포함)를 재실행 — k-saju daily 리포트 채널(1516986557968420864)에 "오늘의 사주 카드" 안내 메시지가 18:02:31 KST에 중복 게시됨(그날 5번째 중복). Instagram/Meta 쪽 실제 발행 피해는 없음(체인이 Get IG User ID 토큰만료 에러로 자동 중단, n8n 실행 ID #254).
- **교훈**: n8n "Execute step"은 코드가 실제 참조하는 노드뿐 아니라 **캔버스 연결선상의 모든 상위 노드**를 재실행한다 — 부작용 있는 노드(Discord 전송 등)가 체인 중간에 있으면 그 노드도 다시 실행된다. 단일 노드만 안전하게 테스트하려면 별도 격리 워크플로를 새로 만들 것(운영 워크플로에 pin 데이터를 남기는 것도 위험 — 잊으면 실제 자동화에 영향).

## 형이 지시한 권한/절차 변경
- 형(19:00경): "덱스가 책임자니까, 아래 워커(클로)가 메시지 규칙 안 지키면 시정 조치 하라" + "고위험 작업은 덱스 지시와 형 승인 없이는 진행 금지" — 클로는 앞으로 덱스 지시 받아 움직이는 구조 재확인.
- 클로 세션의 자동모드 분류기가 "실제 Meta API 쓰기요청 URL 입력" 같은 액션을 독자적으로 차단하는 사례를 오늘 2회 확인 — 이건 대화방 승인 체인과 별개로 걸리는 하네스 레벨 제약이라, 다음 세션도 같은 유형 액션에서 막힐 가능성을 미리 감안할 것.

## 오늘 새로 쓴 메모리 (참고)
- [[reference_codex_config_toml_global_scope_2026-08-30]] — config.toml 전역파일, 외부접근엔 자동승인 효과없음
- [[reference_moa_manager_api_2026-08-30]] — MOA관리자API(3888), 개별 스케줄러 직접실행 금지
- [[reference_dex_jena_cli_window_restart_gotchas_2026-08-30]] — 덱스·제나 CLI 재시작 함정
- [[feedback_flag_scope_before_loosening_approval_2026-08-30]] — 승인권한 확대 요청엔 범위부터 확인
- [[feedback_clo_uses_shared_rules_tag]] — 여섯 번째 재발 기록 추가(v202608008로 버전 정정)

## How to apply (다음 세션)
1. 이 스레드 이어서 열고, 자식 컨테이너 생성 시험 완료 여부부터 형/덱스에게 확인.
2. n8n credential 토큰 유효성 재확인(만료 반복 패턴이라 또 만료됐을 가능성 있음) — 가능하면 장기(60일) 토큰 교환 절차로 전환 검토.
3. "Blocked by classifier"로 막힌 액션(Meta 쓰기요청 직접 입력)은 이번 세션에서도 못 할 가능성 높음 — 형/덱스에게 그 역할 위임을 다시 요청할 것.
4. 세션마감 업무일지는 archive-head-haru에게 위임 완료(08-30 오후·야간분 커밋 `1b85149`/`3e76cc7`/`2fd4bcb`, 볼트 실제 경로는 `D:\Develop\Claude_Channels\Obsidian\owenlab`이지 `D:\Develop\moa-vault`가 아님 — 이 경로 착오를 다음에도 반복하지 말 것).
