---
name: reference_pptx_deck_toolkit
description: 세미나 강의자료 PPTX 제작 툴킷 위치 + 2026-07-23 형이 PowerPoint 설치 → COM export로 실물 렌더 육안검증 가능
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-23T03:40:10.095Z
---

세미나/강의 슬라이드는 `D:\Develop\moa-studio\seminar\vibecoding-basic\` 의 python-pptx 툴킷으로 만든다.

- `deck_helpers.py` — 공용 헬퍼(디자인 토큰 + s_title/s_section/s_content/s_statement/s_twocol/s_steps/s_lab/s_term). 각 빌더가 import.
- `build_*.py` — 덱별 생성기(자동화 입문맛보기·바이브코딩 용어집 등). 실행하면 같은 폴더에 .pptx 저장.
- ★ 인라인 굵게는 `**...**`를 run 분리로 처리해야 화면에 리터럴 `*`가 안 남는다(s_content/put_runs). 줄 전체 강조만 처리하면 문장 중간 `**앞**—뒤`에서 별표가 새어나감 — 과거 반려 사유.
- 한글은 set_font에서 동아시아 typeface(a:ea/a:cs)까지 '맑은 고딕'으로 지정해야 안 깨짐.

★ 2026-07-23 형이 **PowerPoint(Office16) 설치** → 이제 pptx를 이미지로 렌더 가능. 검증 순서:
1) **PowerPoint COM 자동화(PowerShell)로 슬라이드 PNG export** 후 Read로 육안 확인 — 여백/정렬/오버플로/이미지 글자깨짐을 직접 눈으로 잡는다. 예: `$ppt=New-Object -ComObject PowerPoint.Application; $pres=$ppt.Presentations.Open(path,$true,$false,$false); $pres.Slides.Item(N).Export(png,"PNG",1600,900); $pres.Close(); $ppt.Quit()`. render_check/ 폴더에 저장.
   - 주의: COM은 세션/프로세스 환경에 따라 간헐 실패(다른 프로세스 점유 등). 실패 시 python-pptx 계산 검증으로 폴백.
2) python-pptx 계산 검증(폴백/보조): 전 run 스캔(`*` 0건 / bold 개수 / 노트) + 텍스트박스 폭 대비 문자폭(한글 1.0em / 라틴·기호 ~0.35~0.58em) 오버플로 추정.
3) 색감·귀여움 등 **주관적 시각 취향은 여전히 형 몫**(검수 판정 대상 아님).

이미지 생성·PPT 임베드·디스코드 전송한도는 [[reference_flux_image_pipeline_2026-07]] 참조(PNG 임베드 크면 JPG 재압축).

산출물 검수는 [[feedback_qa_gate_before_report]] 대로 qa-lead-jian(검수관) 통과 후 보고.
