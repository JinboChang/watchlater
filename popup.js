document.getElementById("saveBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const videoTitle = tabs[0].title;
        const videoUrl = tabs[0].url;

        chrome.storage.sync.get("videos", (data) => {
            const videos = data.videos || [];
            videos.push({ title: videoTitle, url: videoUrl });

            chrome.storage.sync.set({ videos }, () => {
                alert("Video saved!");
            });
        });
    });
});
