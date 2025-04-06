chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ videos: [] });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: saveVideo
    });
});

function saveVideo() {
    const videoTitle = document.title;
    const videoUrl = window.location.href;

    chrome.storage.sync.get("videos", (data) => {
        const videos = data.videos || [];
        videos.push({ title: videoTitle, url: videoUrl });
        chrome.storage.sync.set({ videos });
    });
}
