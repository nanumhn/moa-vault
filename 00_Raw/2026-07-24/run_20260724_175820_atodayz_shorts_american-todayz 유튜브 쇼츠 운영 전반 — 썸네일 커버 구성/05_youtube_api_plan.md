# YouTube Data API 자동 업로드 배선 — american-todayz
## 인증 (Blogger 배선 재사용)
(OAuth2 데스크톱앱·스코프 youtube.upload·refresh token·token.json)
## 업로드 호출
(videos.insert 파라미터: snippet/status, mp4 미디어, 쇼츠 인식 조건)
## 썸네일
(thumbnails.set 호출)
## Quota 주의
(videos.insert 비용·기본 일 한도·하루 2건 여유·초과 대응)
## 파이프라인 연결
(하루 두 번 생성→디스코드 ✅ 승인→자동 업로드, 실패 시 재시도)
## 형이 할 것 vs 우리가 할 것
(GCP·OAuth 동의는 형 / 코드·배선은 우리)
## 단계별 착수 순서
(1~6단계)