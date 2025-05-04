var neededKeywords = ["Computer Science", "software", "cs"];

function filterVideos() {
    const videos = document.getElementById("ytd-rich-item-renderer");

    videos.forEach(video => {

        //turn title into text format
        video = video.innerText.toLowerCase();
        //if the video doesn't contain any keywords then dont display it
        if(!neededKeywords.some(keyword => video.includes(keyword))) {
            
            video.title.display = none;
        }
    });
}