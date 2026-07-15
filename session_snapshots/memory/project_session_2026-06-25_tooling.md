---
name: project_session_2026-06-25_tooling
description: 2026-06-24~25 플러그인 4종 전역설치 완료 + caveman/remotion/node 미완 항목 (재시작 후 재개용)
metadata: 
  node_type: memory
  type: project
  originSessionId: bfd221f4-ae3b-44c3-a154-9a26c19b4ae7
---

2026-06-24~25 세션: 외부 GitHub 플러그인/도구 설치 작업. 재시작 후 이거 기준으로 이어감.

## ✅ 완료 — Claude Code 플러그인 4종 전역(user scope) 설치
`installed_plugins.json` 등록 + 스킬 활성 확인 완료:
- superpowers@claude-plugins-official (6.0.3) — 개발 방법론(TDD·brainstorming·systematic-debugging 등)
- marketing-skills@marketingskills (2.5.1) — 마케팅 스킬 45종 (cro·copywriting·seo-audit·ads…)
- ui-ux-pro-max@ui-ux-pro-max-skill (2.6.2) — UI/UX 디자인 인텔리전스
- humanize-korean@im-not-ai (1.5.0) — 한글 AI티 윤문 (서브에이전트 12종). ★서아 콘텐츠/블로그 후처리에 연결하면 좋음

## ⏳ caveman — 형이 "설치하되 OFF" 승인, 아직 /plugin 안 침
형이 직접 쳐야 함: `/plugin marketplace add juliusbrussee/caveman` → `/plugin install caveman@caveman`.
- ★규칙: 형 보고엔 절대 caveman 쓰지 말 것(존댓말 0순위 규칙 충돌). 기본 OFF, 내부 토큰절약 작업만 /caveman로 잠깐.
- node 훅(SessionStart/UserPromptSubmit) 있음 → node 설치되면 정상 작동.

## ⏳ Remotion — moa-studio에 셋업 완료, 미커밋, 형 결재 대기
`D:/Develop/moa-studio/remotion/` 독립 모듈로 셋업(메인 Next.js 빌드 영향 0, tsconfig exclude). bun 설치(remotion 4.0.482), create-video 안 씀.
- 샘플 렌더 성공: `remotion/out/sample.mp4` 969KB 1920x1080/30fps/5초 h264 "MOA. STUDIO" 페이드인.
- 생성: remotion/{package.json,tsconfig.json,remotion.config.ts,.gitignore,src/index.ts,Root.tsx,Sample.tsx}. 수정: 루트 tsconfig.json exclude에 "remotion" 1줄.
- 라이선스: 1인 무료 OK(직원4+ 기업만 유료).
- 다음: ①Sample을 props 템플릿화(곡명/가사/썸네일) → 음원+가사 자동영상 파이프라인 + youtube-meta-generator 핸드오프. 승인 시 커밋+연결. cto-seojin 담당.

## ✅ Node.js 설치 완료 (2026-06-25)
node v24.18.0 / npm 11.16.0, `C:\Program Files\nodejs\`. 형이 직접 설치(.msi 또는 관리자 winget)로 완료. winget --silent 비대화형은 UAC 못 띄워 실패함 → 시스템 전역 설치는 형이 관리자 권한/UAC 승인 필요(클로 셸 못 뚫음). 이제 caveman node 훅·npx MCP/툴 사용 가능. 단 클로 셸 세션은 시작시점 PATH 고정이라 다음 세션부터 맨이름 `node` 인식.

## remotion 아닌 것 메모
remotion-dev/remotion = 스킬 아니라 영상 프레임워크(npm). 전역 스킬 등록 대상 아님 → moa-studio 프로젝트 내 설치로 처리함.

[[project_moa_open_threads]] [[reference_node_runtimes]] [[reference_plugin_install_method]]
