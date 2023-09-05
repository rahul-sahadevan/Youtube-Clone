const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const apiKey = "AIzaSyBQN1uvFvfqs53r9K11loGESyjmNz9_AYg";
const commentContainer = document.getElementById("comment-container");
const vedioHeading = document.getElementById("vedio-comment");
const info = document.querySelector(".info");
const c = document.querySelector(".c");
window.addEventListener("load", () => {
    let videoId = document.cookie.split("=")[1];
    console.log(videoId);
  
    if(YT) {
      new YT.Player("vedio-container", {
        height: "500",
        width: "100%",
        videoId,
      });
    
    loadComments(videoId);
    getVedioDetails(videoId);

  }
 
  });
 
  
  function getCeilsub(count){
    if(count < 1000){
      return count;
    }
    if(count <1000000){
      count = count / 1000;
      count = Math.ceil(count.toFixed(2))
      return count+"K";
    }
    if(count >=1000000){
      count = count /1000000;
      count = Math.ceil(count.toFixed(2))
      return count+"M";
    }
  }
  async function getChannelsub(channelId,des){
    const endpoint = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`;
    try{
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log(result);
      c.innerHTML = `
      <div class="sub">
      <div class="name">
          <img class="auther-prof" src="${result.items[0].snippet.thumbnails.high.url}" alt="">
          <div>
              <p class="author">${result.items[0].snippet.localized.title}</p>
              <p class="sub-count">${getCeilsub((result.items[0].statistics.subscriberCount))} subscribers</p>
          </div>
      </div>
      <button class="sub-button">SUBSCRIBE</button>
    </div>
    <p class="des">${des}</p>
    <p class="show-more">SHOW MORE</p>
    <br>
    `
      const from = document.querySelector(".from");
      from.innerText = "From "+result.items[0].snippet.localized.title;
    }
    catch(error){
      console.log(error);
    }
  }
  
  async function loadComments(videoId) {
    
    let endpoint = `${url}?key=${apiKey}&videoId=${videoId}&maxResults=50&part=snippet,replies`;
  
    const response = await fetch(endpoint);
    const result = await response.json();
    console.log(result);
  
    result.items.forEach((item) => {
      const repliesCount = item.snippet.totalReplyCount;
      const {
        authorDisplayName,
        textDisplay,
        likeCount,
        authorProfileImageUrl: profileUrl,
        publishedAt,
      } = item.snippet.topLevelComment.snippet;
  
      const div = document.createElement("div");
      div.className = "comment";
      div.innerHTML = `
      <div class="prof">
        <img src="${profileUrl}" class="author-profile" alt="author profile" />
        <b>${authorDisplayName}</b>
      </div>
      <p class="opinion">${textDisplay}</p>`;
  
      commentContainer.appendChild(div);
     
    });
  }

  async function getVedioDetails(videoId){
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet&part=statistics&id=${videoId}`;
    // const endpoint2 = 
    try{
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log(result);
      info.innerHTML = `
      <p class="head">${result.items[0].snippet.localized.title}</p>
      <div class="counts">
          <div class="view-count">
              <span id="views">${result.items[0].statistics.viewCount} views .</span>
              <span id="data">${result.items[0].snippet.publishedAt.slice(0,10)}</span>
          </div>
          <div class="like-count">
              <p class="like"><img src="./assets/liked.svg" alt="like"><span>${result.items[0].statistics.likeCount}</span></p>
              <p class="like"><img src="./assets/DisLiked.svg" alt="like"><span></span></p>
              <p class="like"><img src="./assets/Share.svg" alt="like"><span>Share</span></p>
              <p class="like"><img src="./assets/Save.svg" alt="like"><span>Save</span></p>
              <p class="like"><img src="./assets/More.svg" alt="like"><span>More</span></p>
          </div>
      </div>
      `

      getChannelsub(result.items[0].snippet.channelId,result.items[0].snippet.description)
      const totalComment = document.querySelector(".all-comments");
      
      totalComment.innerText = result.items[0].statistics.commentCount+" comments"
      // from.innerText = 

    }
    catch(error){
      console.log(error);
    }

  }
