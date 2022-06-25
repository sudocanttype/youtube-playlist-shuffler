document.getElementById("search_button").onclick = async function(){
	let playlistID = document.getElementById("main_search").value
  //trigger the loading screen
  $("#loading").fadeIn(400).css('display', 'flex')

	static_vars.data = (await window.electronAPI.handleSubmit(playlistID))

  $("#loading").fadeOut(200).css('display', 'flex')

  selectSong(0)
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
    videoId: '',
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
  if (event.data == 0){
    nextSong()
  }
}

function nextSong(){
  const data = static_vars.data
  const current_indexed_song = static_vars.current_indexed_song

  if (current_indexed_song + 1 < data.length){
    player.loadVideoById(data[static_vars.current_indexed_song+1]["id"])
    static_vars.current_indexed_song += 1
  }
}

function selectSong(num){
  const data = static_vars.data

  if (num < data.length){
    player.loadVideoById(data[num]["id"])
    //move q position
    static_vars.current_indexed_song = num
  }
}

//make global editable variables
class static_vars{
  data = []
  current_indexed_song = 0
}


