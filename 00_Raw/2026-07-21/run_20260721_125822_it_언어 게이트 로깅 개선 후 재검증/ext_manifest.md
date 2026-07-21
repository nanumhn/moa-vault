```json
(name="Suno Auto Extension", version="1.0.0", manifest_version=3, description="Automate tasks on Suno.com", permissions=["storage", "scripting"], host_permissions=["https://suno.com/*"], background={service_worker="background.js"}, action.default_popup="popup.html", content_scripts=[matches=["https://suno.com/*"], js=["content.js"], run_at="document_idle"], icons={"16": "icon16.png", "48": "icon48.png", "128": "icon128.png"})
```

- storage: 저장소 사용을 통해 상태를 유지
- scripting: 동적 콘텐츠 조작 및 자바스크립트 실행