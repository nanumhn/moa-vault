---
name: project_open_threads_2026-08-14_afternoon_snapshot
description: "2026-08-14 14시 오후 세션저장 스냅샷 — nBlog 만료제한기능 완성(push결재대기)이 최우선, WhisperWriter 결과 미확인"
metadata:
  type: project
  originSessionId: 237b10af-2489-4619-b769-c78eb3db65da
  modified: 2026-08-14T05:25:57.923Z
---

**최우선 — nBlog "이용기간 만료 접근제한" 기능, push 결재 대기**
- 완성+qa-lead-jian 최종 조건부PASS(신규가입 흐름 회귀 없음 확정 실측완료). 로컬 커밋: `ca1bbc9`(최신)까지 4개(`03f5c36` 본체, `6692b96` 온보딩게이트반려수정, `ca1bbc9` 테스트정규식수정) + 이전부터 있던 `d796e5f`(다운로드버튼, 이미 push됨 다른해시로)·`c0ca9ef`(본문작성법모달, 미push)·`9031666`(예약저장반응, 이미 push됨 다른해시로)·`771cb32`(0.1.15관련, origin 0.1.20/21로 대체돼 무의미).
- nblog-saas 로컬 main: origin 대비 **7 ahead / 22 behind**.
- **push 시 `help/page.tsx` 충돌 확실**: origin이 인라인 표에 굵게·색상 설명 추가해뒀고, 로컬 `c0ca9ef`는 그 표를 통째로 모달로 대체함 → **모달쪽(c0ca9ef)이 이겨야 함**(정보손실 없음 확인됨, body-syntax-help-button.tsx에 색상표·0.1.14안내 다 들어있음).
- **형 판단 필요(반려사유 아님, 정책결정)**: ①사용법(help)페이지를 만료자에게 열어둘지(지안 권장=열기, 스펙문구="홈+마이페이지만"=닫기) ②설정에서 만료자도 구글시트 연결가능한 채 시트동기화 계속 돌아가는 것 그대로 둘지(구글API쿼터 소모, 급하진 않음).
- **배포시 필수순서**(원장에 이미 기록됨): migrate → prisma generate → pm2재시작 순서 안 지키면 `/expired`가 500나서 만료자 전원 탈출구 없이 갇힘.

**nBlog 에이전트 0.1.21 공식 승격 완료** — 후속조치 불필요. 로그인상태단일화+keep-alive봇탐지개선+Update배지수정+문구중복정리 전부 반영, 0.1.17/18/19/15 결함빌드 전부 삭제됨.

**아투 게이트 substring오탐 근본수리 완료** — 재발행 성공(american-todayz LIVE). 유사패턴 미수리 2곳(youtube-publish checkBanned, curate.mjs KW_WEIGHT) 남아있으나 형이 "고칠까요?" 질문에 아직 답 안 함, 급하지 않음.

**형 PC1 WhisperWriter 설치 — 결과 미확인**. 녹음이 1.17초만에 조기종료돼 Whisper헛소리("MBC뉴스 이덕영입니다") 나던 문제, 원인=자동무음감지 오작동 → Recording mode를 continuous에서 press_to_toggle로 바꾸라고 안내한 직후 오후세션리셋 발동. 다음 세션에서 형이 테스트결과 알려주면 이어서 지원할 것. [[reference_whisperwriter_windows_setup_2026-08-14]]에 절차 정리돼있음.

**AI 본문 자동생성 기능 — 논의만, 착수 안 함**. 형이 "고급 부가서비스"로 방향 확정, 쿠폰체계(별도쿠폰/패키지쿠폰 구분) 요구사항 추가됨. 오늘 아침 결정된 7개 항목(D1~D7)은 여전히 유효. 다음 세션에서 형이 재확인하면 cto-seojin한테 실제 착수 지시.

**k-saju Lightsail 이전 — 형 AWS액션 5개 여전히 대기중**(장기 미해결, [[project_open_threads_2026-08-14_dawn_snapshot]] 참고).

관련: [[project_nblog_agent_naver_botdetect_overhaul_2026-08-14]] [[reference_atz_gate_substring_falsepositive_2026-08-14]] [[reference_whisperwriter_windows_setup_2026-08-14]] [[project_revenue_model_redesign_final_2026-08-12]]
