document.getElementById("search_button").onclick = async function(){
	let playlistID = document.getElementById("main_search").value
	let songList = (await window.electronAPI.handleSubmit(playlistID))
  player.cuePlaylist(songList)
  document.getElementById("player").style.display = "block"
}
window.addEventListener("keypress", function(event){
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("search_button").click();
		}
})

let tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {

}

function onPlayerStateChange(event) {
  if (event.data == 5){
    event.target.playVideo()
  }
}

