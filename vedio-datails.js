const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const apiKey = "AIzaSyCTfxCeldOBTKimyUJhHXYAe-W0F2U2z3I";
const commentContainer = document.getElementById("comment-container");
window.addEventListener("load", () => {
    let videoId = document.cookie.split("=")[1];
    console.log(videoId);
  
    if(YT) {
      new YT.Player("vedio-container", {
        height: "500",
        width: "500",
        videoId,
      });
  
      loadComments(videoId);
    }
  });
  
  async function loadComments(videoId) {
    let endpoint = `${url}?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;
  
    const response = await fetch(endpoint);
    const result = await response.json();
  
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