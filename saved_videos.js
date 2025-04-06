document.addEventListener("DOMContentLoaded", () => {
    console.log("[SavedVideos] Starting to load...");

    const saveButton = document.getElementById('saveButton');
    const viewButton = document.getElementById('viewButton');
    
    // Save 버튼 클릭 이벤트
    saveButton.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            
            if (currentTab.url.includes('youtube.com/watch')) {
                chrome.storage.sync.get(['videos'], function(result) {
                    const videos = result.videos || [];
                    
                    if (!videos.some(v => v.url === currentTab.url)) {
                        const video = {
                            title: currentTab.title.replace(' - YouTube', ''),
                            url: currentTab.url
                        };
                        
                        videos.push(video);
                        chrome.storage.sync.set({ videos }, () => {
                            saveButton.textContent = 'Saved!';
                            setTimeout(() => {
                                saveButton.textContent = 'Save Current Video';
                            }, 2000);
                        });
                    } else {
                        saveButton.textContent = 'Already Saved!';
                        setTimeout(() => {
                            saveButton.textContent = 'Save Current Video';
                        }, 2000);
                    }
                });
            } else {
                saveButton.textContent = 'Not a YouTube Video!';
                setTimeout(() => {
                    saveButton.textContent = 'Save Current Video';
                }, 2000);
            }
        });
    });

    // View 버튼 클릭 이벤트
    viewButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'video_list.html' });
    });

    // 저장된 비디오가 없을 때 표시할 메시지
    const showNoVideosMessage = () => {
        const videoList = document.getElementById("videoList");
        videoList.innerHTML = "<li>No saved videos yet</li>";
    };

    // 데이터 로드
    chrome.storage.sync.get(["videos"], (result) => {
        console.log("[SavedVideos] Loaded data:", result);
        const videoList = document.getElementById("videoList");
        
        if (!result.videos || result.videos.length === 0) {
            console.log("[SavedVideos] No videos found");
            showNoVideosMessage();
            return;
        }

        videoList.innerHTML = ""; // 기존 내용 클리어
        
        result.videos.forEach(video => {
            console.log("[SavedVideos] Processing video:", video);
            const li = document.createElement("li");
            const a = document.createElement("a");
            
            a.textContent = video.title || "Untitled Video";
            a.href = video.url;
            a.style.cursor = "pointer";
            a.style.color = "#0066cc";
            a.style.textDecoration = "underline";
            
            a.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("[SavedVideos] Opening video:", video.url);
                chrome.tabs.create({ url: video.url });
            });
            
            li.appendChild(a);
            videoList.appendChild(li);
        });
    });

    // 저장된 비디오 목록 로드
    function loadSavedVideos() {
        const videoList = document.getElementById("videoList");
        chrome.storage.sync.get(['videos'], (result) => {
            videoList.innerHTML = '';
            
            if (!result.videos || result.videos.length === 0) {
                videoList.innerHTML = '<li>No saved videos yet</li>';
                return;
            }
            
            result.videos.forEach(video => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = video.url;
                a.textContent = video.title;
                a.target = '_blank';
                
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    chrome.tabs.create({ url: video.url });
                });
                
                li.appendChild(a);
                videoList.appendChild(li);
            });
        });
    }

    // 초기 로드
    loadSavedVideos();
});
