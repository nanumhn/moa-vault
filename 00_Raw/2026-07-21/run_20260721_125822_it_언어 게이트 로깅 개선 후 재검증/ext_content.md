# content.js

```js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'autoCreate') {
        const createBtn = document.querySelector('#create-btn');
        const textarea = document.querySelector('#lyric-input');
        const select = document.querySelector('#genre-select');
        
        createBtn.click();
        textarea.value = '자동 입력된 가사';
        select.value = '摇滚';

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].nodeName === 'AUDIO') {
                    const audioUrl = mutation.addedNodes[0].src;
                    chrome.runtime.sendMessage({audioUrl}, () => {});
                }
            });
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }
});

## 핵심 DOM 셀렉터 (가정)
- #create-btn: 곡 생성 버튼
- #lyric-input: 가사 입력文本区域
- #genre-select: 音乐类型选择

## 에rror 처리
- (케이스 1): 如果createBtn未找到，则跳过自动输入步骤。
- (ケイセー2): 如果textarea或select设置值失败，则尝试重新设置。