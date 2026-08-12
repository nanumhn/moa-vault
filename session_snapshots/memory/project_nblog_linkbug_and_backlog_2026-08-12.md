---
name: project_nblog_linkbug_and_backlog_2026-08-12
description: "nblog-agent 링크버그 근본수정+0.1.8검증 진행상황, 덱스 큐(오류보고·글감정렬) 현황 — 2026-08-12 09시경"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T01:54:11.779Z
---

**세션 진행 지시**: 형이 "1,2 바로 진행하자"(임시조치+근본수정) 후 "너가 직접하지말고 워커 시켜" 지시 → cto-seojin 에이전트 중단, 덱스(Codex)/제나(Gemini)에게 "그들만의업무"(1534714627383099493) 채널로 재위임. 이후 신규요청들도 전부 덱스 큐로.

**진행상황(09:00 KST 기준)**:
1. 링크버그 근본원인 확정: `.se-sidebar-panel-header`가 `applyLink()`의 링크적용버튼 클릭을 가로챔. 수정(hit-test 기반 DOM click 우회)+커밋 `720336e` — **완료**.
2. PC에이전트 0.1.8 테스트빌드: 완료. https://nblog.nanumn.com/downloads/nblog-agent-setup-0.1.8.exe (공식포인터는 0.1.4 그대로).
3. 검증슬롯 2개: ①링크뺀 버전(이미지3+영상만) 05:17 KST **VERIFIED 성공** ②링크포함 실검증판 13:30~16:30 KST 대기 중 — **개발2 PC에 0.1.8 설치 필요(형 액션, 미완료)**, 지금 개발2엔 0.1.5 깔려있어 이 상태로는 검증 무효.
4. 관제센터 "N분 전 확인" 표시가 고정돼있던 버그(형 실측) → 클라이언트 setInterval로 실시간 카운트업 수정, 커밋 `bf055da`.
5. **덱스 GitHub 인증 막힘(SEC_E_NO_CREDENTIALS/gh토큰만료/SSH키없음)** — 커밋 3개(720336e/b3578bd/bf055da)를 클로가 대신 push함(`git -c credential.helper="!gh auth git-credential" push`, wincredman persist 경고는 무시해도 됨 — push 자체는 성공). **다음 세션이 할 일**: 덱스 워크어라운드가 계속 필요하면 매번 클로가 대신 push해줘야 함, 근본적으로 gh 인증 재설정이 필요할 수 있음.
6. **개발2 PC에 0.1.8 설치+로그인 완료(형, 10:37 KST경)**. 링크검증 슬롯을 즉시실행 요청했으나 최소간격게이트(480분)가 정상작동해 자동연기 — **최종예정 12:43 KST**(우회 안 함, 게이트 정책 그대로 존중).
7. 덱스 큐(대기 중, 미착수, 우선순위 순): ①오류보고 기능(ErrorReport모델+사용자제출폼+관리자 `/dashboard/admin/error-reports`) ②글감목록(`/dashboard/content`) 정렬(등록일+id보조키) ③PC에이전트 업데이트알림([U]배지, 호버시 버전정보, 클릭시 자동다운로드) ④폴링주기 초록램프 위치(줄 끝으로) ⑤로그인카드 문구3건(박스처리·버튼명 대괄호 통일·"자동으로 닫힘"→"창이 유지됨" 오문구 수정, keep-alive 때문에 실제로 안 닫히는 게 맞는 동작으로 바뀜 확인함) ⑥사이드바 메뉴 순서(에이전트→예약설정→**글감→발행이력**→사용법, 형+클로 둘다 동의) ⑦목록화면 전체(글감·발행이력·회원관리·접속현황 등) 페이지당 표시개수 선택(10/30/100, 기본10).
**형 지시(11:47 KST): 12:43 대기중이라 위 큐 6~7건 바로 착수시킴(놀리지 말 것).**

**Why:** [[project_open_threads_2026-08-12_dawn_snapshot]]의 최우선 항목(링크삽입버그)이 형 결정("1,2 바로")으로 실행 단계로 넘어감. 형이 반복 지시한 [[feedback_delegate_to_dex_jena_proactively]]에 따라 이번엔 클로가 직접/서브에이전트로 하지 않고 전부 덱스에게 위임.

**How to apply:** 다음 세션은 ①12:43 KST 슬롯 결과 확인(원샷 cron `55d6ebf9` 걸어둠) ②덱스 큐 진행상황(오류보고→정렬→...) 체크 ③push 인증 문제 반복되면 클로가 대신 push ④**형이 12:43 결과 확인 후 "다른 계정으로도 테스트해보겠다"고 예고함(11:41 KST)** — 두번째 네이버계정/블로그로 검증 요청 들어올 수 있음, 미리 대비.

관련: [[project_open_threads_2026-08-12_dawn_snapshot]] [[reference_owenlab_git_push_gh_credential]] [[feedback_delegate_to_dex_jena_proactively]]
