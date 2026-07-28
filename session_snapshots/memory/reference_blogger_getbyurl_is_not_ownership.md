---
name: reference_blogger_getbyurl_is_not_ownership
description: blogs.getByUrl 이 되는 것은 소유 증명이 아니다 — 공개 블로그면 남의 것도 조회된다. 소유 판정은 view ADMIN
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f4a39c7-2b9b-4c6b-a7b0-ca4baa51399e
  modified: 2026-07-28T07:45:08.461Z
---

**`blogger.blogs.getByUrl()` 로 blogId가 나왔다고 "우리 계정이다"라고 말하면 안 된다.** 공개 블로그는 아무 토큰으로나 조회된다. 주소 → ID 변환일 뿐 권한과 무관하다.

## 소유 판정법 [확인 — 2026-07-28]
`view: 'ADMIN'` 은 그 블로그의 관리자만 허용된다. 이걸로 갈린다.
```
                        공개조회      ADMIN조회
아투 7410844827165474756   OK          OK          ← 우리 토큰이 주인
해의이름 1669491539282664803 OK          403         ← 주인 아님
```
`posts.list({view:'ADMIN', status:['DRAFT']})` 도 같은 판정에 쓸 수 있다.

## 사고 경위
2026-07-27 haeireum.blogspot.com 의 blogId가 조회되길래 "아투랑 같은 구글 계정이라 추가 인증 없이 자동발행 가능"이라고 형에게 보고했다. **형이 "아투랑 다른 계정일 텐데"라고 지적해서 드러났다.** 애드센스 계정까지 같다고 덧붙였는데 그것도 같은 틀린 전제 위에 얹은 것이었다.

교훈: **"조회가 됐다"를 "권한이 있다"로 번역하지 마라.** 쓰기 권한이 필요한 일이면 쓰기 권한을 직접 확인해야 한다. [[feedback_verified_facts_only]]

## 계정 정리
- 아투 Blogger/YouTube 토큰 = `info.nanumn@gmail.com` ([[reference_google_accounts_by_purpose]])
- **해의 이름 블로그/채널 = `nanumn.com@gmail.com` (표시명 "나눔엔"/"스탁나눔엔")** — 세 번째 계정이다 [확인 — 2026-07-28 블로거 화면 상단 계정 표시]. `info.nanumn@`(아투)과 헷갈리기 쉬우니 주의
- 해법: 아투 계정을 해의 이름 블로그에 **관리자로 초대**(토큰이 하나라 반대 방향은 아투 발행이 끊긴다)
- YouTube 는 채널별 토큰 분리 지원 추가 — `YT_TOKEN_PATH` 환경변수 (`tools/youtube-publish/config.mjs`, 미지정 시 기존 아투 token.json)

관련: [[reference_atz_pipeline_live_url_truth]]
