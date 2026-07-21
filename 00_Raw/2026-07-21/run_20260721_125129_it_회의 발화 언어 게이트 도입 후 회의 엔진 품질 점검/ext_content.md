# content.js

```js
(chrome.runtime.onMessage 리스너 → suno.com /create 페이지의 textarea/select/버튼 DOM 셀렉터로 자동 입력 → MutationObserver로 곡 생성 완료 감지 → 오디오 URL 추출 → 결과 chrome.runtime.sendMessage로 popup 또는 background로 전송)
```

## 핵심 DOM 셀렉터 (가정)
- `textarea#song-title`: 곡 제목 입력
- `select#genre`: 장르 선택
- `button#create-song`: 곡 생성 버튼

## 에러 처리
- (케이스 1): `try-catch`로 자동 입력 중 오류 처리
- (케이스 2): Mutation Observer에서 발생한 오류 `console.error()` 로그 기록 및 사용자 알림 표시