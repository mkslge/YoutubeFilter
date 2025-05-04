var neededKeywords = ["computer science", "software", "cs"];
const RELOAD_TIME = 2000;
function filterVideos() {
    const videos = document.querySelectorAll("ytd-rich-item-renderer");

    videos.forEach(video => {

        let badgeArea = video.querySelector("ytd-badge-support", "ytd-desktop-meta-block");

        let allText = video.innerText + (badgeArea?.innerText || "").toLowerCase();
        //turn video into title text format
        let match = neededKeywords.some(keyword => allText.includes(keyword));

        //if the video doesn't contain any keywords then dont display it
        if(!match) {
            video.style.display = "none";
        }
    });
}



setInterval(filterVideos, RELOAD_TIME);