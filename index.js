const apiKey = "AIzaSyBQN1uvFvfqs53r9K11loGESyjmNz9_AYg"
const url = "https://www.googleapis.com/youtube/v3";

const searchInput = document.getElementById("input-value");
const searchbutton = document.getElementById("search-button");
const homeDiv = document.getElementById("container");
function getViewcount(count){
    if(count < 1000){
        return count;
    }
    if( count < 1000000){
        count = Math.ceil(count / 1000);
        return count+"k";
    }
    if(count < 1000000000000){
        count = Math.ceil(count/1000000);
        return count+"M";
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
function vedioDetails(vedioId){
  console.log(vedioId);
  document.cookie = `id=${vedioId}; path=/vedio-dtails.html`;
  window.location.href = "vedio-dtails.html";

}
async function renderVedios(result){
    console.log(result);
    homeDiv.innerHTML = "";
    result.forEach(element => {
        const videoDiv = document.createElement("div");
        videoDiv.className = "video";
        videoDiv.innerHTML = 
        `<img
        src="${element.snippet.thumbnails.medium.url}"
        class="thumbnail"
        alt="thumbnail"
      />
      <div class="bottom-container">
        <div class="logo-container">
          <img class="logo" src="${element.channelLogo}" alt="" />
        </div>
        <div class="title-container">
          <p class="title">
            ${element.snippet.title}
          </p>
          <p class="gray-text">${element.snippet.channelTitle}</p>
          <p class="gray-text">${
            getViewcount(element.statistics.viewCount)
          } Views . ${calculateTheTimeGap(element.snippet.publishTime)}</p>
        </div>
      </div>`
      homeDiv.append(videoDiv);
      let vid = element.id.videoId;
      videoDiv.addEventListener("click", ()=>{
        vedioDetails(vid);
      })

    });
    
}

async function getChanelLogo(channelId){
    const endpoint = `${url}/channels?key=${apiKey}&part=snippet&id=${channelId}`;
    try{
        const response = await fetch(endpoint);
        const result = await response.json();
        console.log(result);
        return result.items[0].snippet.thumbnails.high.url;
    }
    catch(error){
        console.log(error);
    }
}

async function getStatistics(vedioId){
    const endpoint = `${url}/videos?key=${apiKey}&part=statistics&id=${vedioId}`;
    try{
        const respose = await fetch(endpoint);
        const result = await respose.json();
        return result.items[0].statistics;

    }
    catch(error){
        console.log(error);
    }
    
}

async function getVedios(searchValue){
    const endpoint = `${url}/search?key=${apiKey}&q=${searchValue}&part=snippet&maxResults=20`;
    try{
        const response = await fetch(endpoint);
        const result = await response.json();
        console.log(result);
        for(let i =0;i<result.items.length;i++){
            const vedioId = result.items[i].id.videoId;
            const channelId = result.items[i].snippet.channelId;

            let statistics = await getStatistics(vedioId);
            let channelLogo = await getChanelLogo(channelId);

            result.items[i].statistics = statistics;
            result.items[i].channelLogo = channelLogo;

        }
        renderVedios(result.items);
    }
   catch(error){
    console.log(error);
   }

}
searchbutton.addEventListener("click", () =>{
    seachValue  = searchInput.value;
    getVedios(seachValue);
})
window.onload(getVedios(""));