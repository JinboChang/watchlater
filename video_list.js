document.addEventListener('DOMContentLoaded', () => {
    const videoList = document.getElementById('videoList');
    
    chrome.storage.sync.get(['videos'], (result) => {
        if (!result.videos || result.videos.length === 0) {
            videoList.innerHTML = '<li class="video-item">No saved videos yet</li>';
            return;
        }

        result.videos.forEach(video => {
            const li = document.createElement('li');
            li.className = 'video-item';
            
            const a = document.createElement('a');
            a.href = video.url;
            a.textContent = video.title;
            a.className = 'video-link';
            a.target = '_blank';
            
            li.appendChild(a);
            videoList.appendChild(li);
        });
    });
}); 