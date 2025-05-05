const RELOAD_TIME = 1500;
let keywords = [];
let DEBUG_MODE = false;
//function to load the stored keywords and update the keywords array
function updateKeywords() {
    chrome.storage.sync.get("keywords", function(result) {
        if (result.keywords) {
            keywords = result.keywords;
        } else {
            
            console.log("keywords began empty");
            keywords = [];
        }
        if(DEBUG_MODE) {
            console.log("Updated keywords:", keywords); 
        }
        
    });
}

//do an inital load on the keywords 
updateKeywords();

//function that shows the popup to add keywords
function showFloatingPopup() {
    if (document.getElementById("yt-float-popup")) {
        return;
    }
    //create div for popup
    const popup = document.createElement("div");
    popup.id = "yt-float-popup";
    popup.style = `
      position: fixed;
      top: 80px;
      right: 30px;
      width: 280px;
      background: darkgray;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px;
      z-index: 999999;
      font-family: Roboto, sans-serif;
    `;

    //add text and button
    popup.innerHTML = `
      <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px;">Filter YouTube Videos</div>
      <input id="yt-keyword-input" type="text" placeholder="e.g. cs, python"
        style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;" />
      <button id="yt-keyword-btn"
        style="margin-top: 10px; width: 100%; padding: 8px; background-color: #ff0000; color: white; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">
        Add Keyword
      </button>
    `;

    //add popup to the DOM
    document.body.appendChild(popup);

    //update list when user clicks button
    document.getElementById("yt-keyword-btn").addEventListener("click", () => {
        const raw = document.getElementById("yt-keyword-input").value;

        if(DEBUG_MODE) {
            console.log("Raw input:", raw);
        }


        //split the raw input into keywords, trimming and filtering out empty strings
        const addedKeywords = raw.toLowerCase()
            .split(",")
            .map(k => k.trim()) //remove any extra spaces
            .filter(k => k !== ""); // we dont want any extra strings whatsoever

        
        if(DEBUG_MODE) {
            console.log("Added keywords:", addedKeywords);
        }


        //jf there are added keywords, update the keywords array and save it to storage
        if (addedKeywords.length > 0) {
            keywords = [...new Set([...keywords, ...addedKeywords])];
            if(DEBUG_MODE) {
                console.log("Updated keywords array:", keywords); 
            }
            

            //save the updated keywords array to chrome.storage.sync
            chrome.storage.sync.set({ keywords }, () => {
                if(DEBUG_MODE) {
                    console.log("Keywords saved:", keywords); 
                }

                updateKeywords(); //re-load everything
            });
        } else {
            console.log("No valid keywords entered.");
        }

        //reset search bar
        document.getElementById("yt-keyword-input").value = ""; 
    });
}

//this function filters videos based on the search bar
function filterVideos() {
    if(DEBUG_MODE) {
        console.log("Filtering videos with keywords:", keywords);
    }

    //make sure we have stuff to do
    if(keywords.length === 0) {
        console.log("No keywords to filter.");
        return;
    }

    //go through all videos
    const videos = document.querySelectorAll("ytd-rich-item-renderer");
    videos.forEach(video => {
        //get all text from the video (including badges and metadata)
        let badgeArea = video.querySelector("ytd-badge-support, ytd-desktop-meta-block");
        let allText = video.innerText + (badgeArea?.innerText || "").toLowerCase();

        //check if any of the keywords are present in the video's text
        let match = keywords.some(keyword => allText.includes(keyword));

        //if theres no match hide the video
        if (!match) {
            video.style.display = "none";
        } else {
            //otherwise dont hide the video :)
            video.style.display = ""; 
        }
    });
}

//function to run if user scrolls
function onScroll() {
    //wait for a bit before filtering (to avoid multiple calls)
    setTimeout(filterVideos, RELOAD_TIME);
}

//attach the scroll event listener
window.addEventListener("scroll", onScroll);


if (window.location.hostname === "www.youtube.com") {
    setTimeout(showFloatingPopup, 500); //show the pop up
    setTimeout(filterVideos, 500);  //apply inital filtering
}
