# popup.html

```html
<textarea id="prompts-lyrics" placeholder="여기에 prompts.txt와 lyrics를 붙여넣으세요"></textarea>
<button id="start-btn">시작</button>
<div id="status-area"></div>
```

# popup.js

```js
const promptsLyrics = document.getElementById('prompts-lyrics').value;
const startBtn = document.getElementById('start-btn');
const statusArea = document.getElementById('status-area');

startBtn.addEventListener('click', () => {
  const items = JSON.parse(promptsLyrics);
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'START_JOB', items});
  });
});

statusArea.textContent = '준비 중...';
```