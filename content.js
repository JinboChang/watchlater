// YouTube 페이지에서 실행될 스크립트
function addSaveButton() {
    // 이미 버튼이 있다면 중복 추가 방지
    if (document.getElementById('watch-later-btn')) return;

    // YouTube의 메뉴 영역 찾기
    const menuContainer = document.querySelector('#top-level-buttons-computed');
    if (!menuContainer) return;

    // 버튼 생성
    const saveButton = document.createElement('button');
    saveButton.id = 'watch-later-btn';
    saveButton.innerHTML = '💾 Save Video';
    saveButton.style.cssText = `
        background: #065fd4;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 18px;
        cursor: pointer;
        margin-left: 8px;
        font-size: 14px;
    `;

    // 클릭 이벤트 추가
    saveButton.addEventListener('click', () => {
        const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent;
        const videoUrl = window.location.href;

        // background script로 메시지 전송
        chrome.runtime.sendMessage({
            action: 'saveVideo',
            video: {
                title: videoTitle,
                url: videoUrl
            }
        });

        // 사용자에게 피드백
        saveButton.innerHTML = '✓ Saved!';
        setTimeout(() => {
            saveButton.innerHTML = '💾 Save Video';
        }, 2000);
    });

    // 버튼 추가
    menuContainer.appendChild(saveButton);
}

// 페이지 로드 시 버튼 추가
addSaveButton();

// YouTube의 SPA 특성을 고려한 URL 변경 감지
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(addSaveButton, 1500);
    }
}).observe(document, {subtree: true, childList: true}); 