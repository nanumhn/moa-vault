---
name: reference_slide_master_pptx_install
description: slide-master(네이티브 편집 PPTX 생성 스킬) 설치 위치·검증법·변환 함정
metadata:
  type: reference
---
형 지시로 2026-08-20 설치. `D:\Develop\slide-master` (byungjunjang/slide-master, hugohe3/ppt-master MIT 기반).
Claude Code 스킬 워크스페이스라 **그 폴더를 워크스페이스로 열어야** `.claude/skills/`(ppt-master, ppt-template-fill, native-enhance-pptx, diagram-design, codex-image)가 잡힌다. 우리 메인 세션(`D:\Develop\Claude_Channels`)에서는 스크립트를 직접 호출하는 식으로 썼다.

**설치 상태**
- 파이썬 의존성 설치 완료(python 3.13). 검증: `python -c "import pptx; import fitz; print('OK')"` — 16개 모듈 전부 import 확인.
- **Pretendard 폰트 6종을 이 PC에 설치했다**(원래 없었음). 관리자 권한 불필요 — `%LOCALAPPDATA%\Microsoft\Windows\Fonts` 복사 + `HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts` 등록. 안 깔면 생성한 PPTX의 한글이 대체폰트로 깨진다.
- OfficeCLI(선택, 수출 검증용)는 **아직 미설치**. 필요하면 `npm install -g @officecli/officecli@1.0.135`.
- 이 PC엔 **PowerPoint가 설치돼 있다**(`C:\Program Files\Microsoft Office\Root\Office16\POWERPNT.EXE`) → 검증 렌더가 실제 PowerPoint 렌더링으로 찍힌다.

**★변환 함정 — 그냥 돌리면 에러난다**
`svg_to_pptx.py <project> -s final` 만 주면 실패:
`Error: release SVG export requires an explicit spec_lock.md pptx_structure.mode`
→ `--pptx-structure flat` 을 명시하면 통과(자유 디자인·브랜드전용은 flat, 덱/레이아웃 템플릿은 structured).

**완료 판정법 (성공 메시지 믿지 말 것)**
python-pptx로 열어 ①`PICTURE` 개체 수 = 0 ②텍스트가 `TEXT_BOX`의 실제 text_frame ③run의 font.name이 Pretendard 인지 확인. 그 다음 PowerPoint COM(`$app.Presentations.Open` → `$slide.Export(png)`)으로 육안 확인.
★콘솔에 한글이 깨져 보이는 건 파일 문제가 아니라 stdout 인코딩(cp949)이다 — `PYTHONIOENCODING=utf-8` 붙여 재확인할 것. 안 그러면 멀쩡한 파일을 깨졌다고 오진한다. [[feedback_verify_measurement_before_declaring_failure]]

스모크 테스트 산출물: `projects/20260820_smoke_test/exports/smoke_test_ver1.pptx` (3장, 16:9, 이미지개체 0). 관련: [[feedback_visual_output_needs_eyeball_check]] [[reference_flux_image_pipeline_2026-07]]
