
var neededKeywords = ["computer science", "software", "cs"];
const RELOAD_TIME = 10;
function filterVideos() {
    const videos = document.querySelectorAll("ytd-rich-item-renderer");

    videos.forEach(video => {

        //turn video into title text format
        let title = video.innerText.toLowerCase();
        //if the video doesn't contain any keywords then dont display it
        if(!neededKeywords.some(keyword => title.includes(keyword))) {
            video.style.display = "none";

        }
    });
}



setInterval(filterVideos, RELOAD_TIME);