---
name: project_nblog_saas_ai_draft_llm_key_deferred_2026-08-16
description: nblog-saas AI 초안생성(ai-draft) 기능의 LLM 키(OpenAI vs Gemini) 결정을 형이 서비스 전체 완성 시점으로 미룸
metadata:
  type: project
  originSessionId: bf3fbb37-1ff7-4b12-a3c5-e0715af4a86e
  modified: 2026-08-16T00:39:51.930Z
---

nblog-saas 08-16 배포로 ai-draft 관련 마이그레이션(ai_draft_addon_gating·ai_usage_per_blog·ai_draft_queue·ai_draft_batch·ai_draft_review)은 운영 DB에 이미 적용됐지만, 실제로 초안을 생성하는 크론(`ai-draft-plan`·`ai-draft-run`, `deploy/install-crontab.sh`에 정의)은 **미등록 상태로 보류**.

이유: LLM 호출에 실제 비용이 발생하는데, 운영에 `OPENAI_API_KEY`가 아직 없음. 형이 명시적으로 미룸: **"오픈AI API 키는 나중에 생각하자, 전체 다 서비스가 완성되었을 때 그때 API 키를 이용할지 Gemini 키를 이용할지 고민할 거야."**

**How to apply:** ai-draft 크론 등록이나 OpenAI/Gemini 키 발급을 먼저 제안하지 말 것 — 형이 "서비스 완성됐다"고 판단해서 먼저 꺼낼 때까지 대기. 그 전까지 `retention` 크론(비용 없는 정리 작업)만 등록해서 진행. `install-crontab.sh`는 3줄을 한 블록으로 통째로 교체하는 구조라, ai-draft 2줄을 뺀 채로 retention만 넣으려면 스크립트를 그대로 못 쓰고 수동으로 해당 줄만 crontab에 추가해야 할 수 있음(cto-seojin이 처리 중, 결과 확인 필요).

**K열 이미지첨부 사용법 가이드도 같은 이유로 게시 보류.** content-head-seoa가 작성 완료했으나(`D:\Develop\nblog-saas\docs\help-k-column-image-guide-draft.md`), ai-draft가 꺼져있는 지금 게시하면 "동작 안 하는 기능 안내"가 되므로 AI 본문자동화 점화 시점에 같이 `/dashboard/help`에 반영하기로 함(2026-08-16). 캡처 3장(구글드라이브 공유설정 화면)도 그때 media-head-siwoo에게 발주.

관련: [[project_nblog_saas_night_marathon_2026-08-13]] [[reference_nblog_saas_pm2_env_caching_2026-08-12]]
