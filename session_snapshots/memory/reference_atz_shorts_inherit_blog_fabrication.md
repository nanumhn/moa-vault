---
name: reference_atz_shorts_inherit_blog_fabrication
description: 쇼츠 자막을 블로그 본문과 대조하면 창작이 통과한다 — 쇼츠는 블로그 요약이라 기준은 블로그의 원문 근거 파일이어야 한다
metadata:
  type: reference
---

아투 쇼츠는 **블로그 글을 요약해서** 만든다. 그래서 자막을 **블로그 본문과 대조하면 검증이 되지 않는다** — 블로그가 이미 지어낸 문장은 블로그 안에 있으므로 "원문에 있음"으로 통과한다. 그건 *충실한 요약*을 검증한 것이지 *사실*을 검증한 게 아니다.

2026-07-28 실측: 공개된 쇼츠 `DCzDQgChpak` 설명에 `"한국 정부는 …대응 방안을 논의 중입니다"` 가 나갔다(경북매일 원문에 없음). 블로그 `blog-post_668` 본문에 그 문장이 그대로 있어서, 블로그 기준 대조로는 **0건**으로 통과했다.

→ 대조 기준은 그 글의 **원문 근거 파일** `out/<stamp>_sources.txt` 다. `findSourcesFor(title)` 가 제목으로 payload→sources 를 찾아준다. 근거 파일이 없으면(2026-07-27 02시 이전 글) **판정 불가로 남기고 막지 않는다.**

**검사 구조 (2026-07-28 신설)**
- `auditScript` = 숫자·따옴표 인용·자극표현·문체만 본다 → 평서문 창작은 원리적으로 못 잡는다. **실패 시 throw 라서 여기에 새 검사를 얹으면 06:30이 죽는다.**
- `auditClaims` = 분리 신설. **기관 행위 주장**만 차단 후보(전망은 제외). 판정만 돌려주고 `shorts-run` 이 TTS·렌더 **직전**에 멈춘다(비용 절약 + 업로드 전이라 공개물 무오염).

**★쇼츠 프롬프트만 고쳐서는 못 막는다.** few-shot 예시에 그 창작 문장이 박혀 있어 교체했고 3번 장면 규칙도 보강했는데, **재생성해도 같은 문장이 다시 나왔다** — 블로그 원고에 있으니까. 근본 해결은 블로그 `qa-gate` 에 같은 기관행위 검사를 넣는 것.

관련: [[reference_atz_gate_blindspot_plain_claims]] [[reference_atz_evidence_never_reached_model]] [[project_atz_originality_policy_2026-07-28]]
