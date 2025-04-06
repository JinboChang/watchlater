document.addEventListener("DOMContentLoaded", () => {
    const enableCheckbox = document.getElementById("enableExtension");

    chrome.storage.sync.get("enabled", (data) => {
        enableCheckbox.checked = data.enabled !== false;
    });

    enableCheckbox.addEventListener("change", () => {
        chrome.storage.sync.set({ enabled: enableCheckbox.checked });
    });
});
