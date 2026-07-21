# popup.html

```html
<textarea id="prompts" rows="10" cols="50"></textarea><br>
<button onclick="startJob()">시작</button><br>
<div id="status">진행 중...</div>
```

# popup.js

```js
const prompts = document.getElementById('prompts').value;
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, {type: 'START_JOB', items: JSON.parse(prompts)});
});
document.getElementById('status').innerText = '작업 시작 중...';
```