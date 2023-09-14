const url = "https://www.googleapis.com/youtube/v3/";
const apiKey = "AIzaSyDUYgsLctSP1U97FyMMOtmeOFrDaELHZ7Q";
const commentContainer = document.getElementById("comment-container");
const vedioHeading = document.getElementById("vedio-comment");
const info = document.querySelector(".info");
const c = document.querySelector(".c");
const myVideos = document.querySelector(".my-vedios");
const vContainer = document.getElementById("vedio-container");


window.addEventListener("load", () => {
    let videoId = document.cookie.split("=")[1];
    // let result = localStorage.getItem("result")

    console.log(videoId);
    vContainer.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `
    loadComments(videoId);
    getVedioDetails(videoId);
 
  });

  async function playListVedios(playlistId){
    const endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&part=snippet,contentDetails&maxResults=5&playlistId=${playlistId}`;
    try{
      const response=  await fetch(endpoint);
      const result = await response.json();
      console.log(result);
    }
    catch(e){
      console.log(e);
    }
  }
 


  async function uploadedVedios(channelId){
    const endpoint = `https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&part=snippet,contentDetails&maxResults=5&channelId=${channelId}`
    try{
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log(result);
      playListVedios(result.items[0].id)
    
    }
    catch(e){
      console.log(e);
    }
  }
  
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



  function channelFun(){
    window.location.href = "channelPage.html";
  }

  async function getChannelsub(channelId,des){
    const endpoint = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`;
    try{
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log(result);
      uploadedVedios(result.items[0].id)
      c.innerHTML = `
      <div class="sub">
      <div class="name">
          <img class="auther-prof" onclick=channelFun() src="${result.items[0].snippet.thumbnails.high.url}" alt="">
          <div>
              <p class="author" onclick=channelFun()>${result.items[0].snippet.localized.title}</p>
              <p class="sub-count">${getCeilsub((result.items[0].statistics.subscriberCount))} subscribers</p>
          </div>
      </div>
      <button class="sub-button" onclick=changTosubscribed()>SUBSCRIBE</button>
    </div>
    <p class="des">${des}</p>
    <p class="show-more">SHOW MORE</p>
    <br>
    `
      const from = document.querySelector(".from");
      from.innerText = "From "+result.items[0].snippet.localized.title;
      prfp.src = result.items[0].snippet.thumbnails.high.url;

      
    }
    catch(error){
      console.log(error);
    }
  }




  
  async function loadComments(videoId) {
    
    let endpoint = `${url}commentThreads?key=${apiKey}&videoId=${videoId}&maxResults=50&part=snippet,replies`;
  
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
  

// 
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


  function calculateTheTimeGap(publishTime) {
    let publishDate = new Date(publishTime);
    let currentDate = new Date();
  
    let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;
  
    const secondsPerDay = 24 * 60 * 60;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;
  
    if (secondsGap < secondsPerDay) {
      return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
    }
    if (secondsGap < secondsPerWeek) {
      return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
    }
    if (secondsGap < secondsPerMonth) {
      return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
    }
  
    return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
  }




function playListBar(items){
  items.forEach(element =>{
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet&part=statistics&id=${element.id}`;
    const vedioCard = document.createElement("div");
    vedioCard.classList.add("vedio-card");
    const vedioThumb = document.createElement("div");
    vedioThumb.classList.add("vedio-thumb");
    const img = document.createElement("img");
    img.src = element.snippet.thumbnails.high.url;
    // img.style.width = "100%";

    vedioThumb.append(img);
    const textContent = document.createElement("div");
    textContent.classList.add("text-content");
    const title = document.createElement("p");
    title.classList.add("t");
    title.innerText = element.snippet.title;
    const cTitle = document.createElement("p");
    cTitle.innerText = element.snippet.channelTitle;
    cTitle.style.cursor = "pointer"
    cTitle.addEventListener("click",()=>{
      window.location.href = "channelPage.html";
    })


    const views = document.createElement("p");

    views.innerText = `1M views . ${calculateTheTimeGap(element.snippet.publishTime)}`
    textContent.append(title,cTitle,views);

    vedioCard.append(vedioThumb,textContent);
    myVideos.append(vedioCard);
    
  })
}


async function playList(){
  let search = localStorage.getItem("search");
  console.log(search);
  const endpoint = `${url}search?key=${apiKey}&q=${search}&part=snippet&maxResults=10`;
  try{
    const respose = await fetch(endpoint);
    const result = await respose.json();
    console.log(result);
    playListBar(result.items);

  }
  catch(e){
    console.log(e);
  }
}
playList();

function changTosubscribed(){
  let current = document.querySelector(".sub-button");
  if(current.innerText == "SUBSCRIBE"){
    current.innerText = "SUBSCRIBED";
    current.style.backgroundColor = "grey";
  }
  else{

    current.innerText = "SUBSCRIBE";
    current.style.backgroundColor = "red";
  }
  
  
}
