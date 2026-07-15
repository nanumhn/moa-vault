---
name: reference-agent-town
description: agent-town GitHub repo — 픽셀 RPG 가상 오피스 레퍼런스. Moa Studio 조직 비주얼화의 목표 방향.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

형이 Moa Studio 조직 비주얼화 방향으로 지목한 참고 레포: https://github.com/geezerrrr/agent-town

**무엇:** 픽셀아트 RPG 가상 오피스. 보스가 사무실을 걸어다니며 AI 에이전트한테 면대면으로 작업 할당, 실시간 작업 상태(대기→복귀→전송→실행중→완료/실패) 시각화. idle 에이전트는 사무실 배회하다 책상 복귀.

**스택:** Next.js 16 + React 19 + TS + **Phaser 3 + Tiled 맵** (moa-studio와 거의 동일). 에이전트 런타임은 OpenClaw. `public/`에 풀 에셋(characters/sprites/tilesets/maps/audio/ui). `npx @geezerrrr/agent-town`로 실행.

**Why:** 형은 [[pipeline-progress-2026-05-15]]의 조직도(`/org`, CSS 트리)를 이 픽셀 오피스 스타일로 업그레이드하고 싶어함. 2026-05-29 대화에서 이 레포 + Gather.town 스크린샷을 레퍼런스로 제시.

**How to apply:** 조직 비주얼 작업 시 UX·아키텍처 레퍼런스로 활용. 단 **라이선스 파일 없음(LICENSE 404) = All Rights Reserved** — 코드/에셋 직접 복사는 법적 위험. 아이디어·구조 참고만 OK. 에셋은 라이선스 명확한 무료팩(itch.io LimeZu *Modern Interiors/Office*)으로 대체. 데이터 연동부는 OpenClaw 대신 우리 회의 엔진(localhost:8080 `fetchCharacters`) + Suno 파이프라인 상태로 교체. 후보 스타일: A) CSS 2D 탑다운(샘플 제작함, `office-mockup.html`) / B) 아이소메트릭 / C) 픽셀 RPG(이 레포 방향).
