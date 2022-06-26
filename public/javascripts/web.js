document.getElementById("search_button").onclick = async function(){
	let playlistID = document.getElementById("main_search").value
  //trigger the loading screen
  $("#loading").fadeIn(400).css('display', 'flex')

  try {
    await handleSubmit(playlistID)
  } catch (e) {
    console.log(e)
  }

  $("#loading").fadeOut(200).css('display', 'flex')

  selectSong(0)
  document.getElementById("player").style.display = "block"
  buildQueue()
}
document.getElementById("resume").onclick = function(){
  $.post("/getLastPLID", (data, status) => {
      if(data){
        document.getElementById("main_search").value = data
        $.post("/getLastVideoIndex", (index) => {
          $.post("/getLastPL", (playlistJson) => {
            document.getElementById("player").style.display = "block"
            static_vars.data = playlistJson
            selectSong(index)
            buildQueue()
            document.getElementById("resume").style.display = "none"
          })
        })
    }
      
})

}
window.addEventListener("keypress", function(event){
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("search_button").click();
		}
})

async function handleSubmit(inp){
  const payload = {
    id:inp
  }
  console.log(payload)
  await $.post("/submitPL", payload, (data, status) => {
    static_vars.data = data
  })
}

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

function prevSong(){
  const data = static_vars.data
  const current_indexed_song = static_vars.current_indexed_song

  if (current_indexed_song - 1 >= 0){
    player.loadVideoById(data[static_vars.current_indexed_song-1]["id"])
    static_vars.current_indexed_song -= 1
  }
}

function selectSong(num){
  const data = static_vars.data

  if (num < data.length){
    player.loadVideoById(data[num]["id"])
    //move q position
    static_vars.current_indexed_song = num
    $.post("/setLastVideoIndex", {index: num}) 
  }
}

function buildQueue(){
  let data = static_vars.data
  const parentNode = document.getElementById("queue")
  parentNode.innerHTML = ""

  data.forEach((v, i, a) => {
    let newNode = document.createElement("span")
    newNode.innerHTML = v["title"] 
    newNode.onclick = () => {
      selectSong(i)
    }
    parentNode.appendChild(newNode)
  })
  $("#queue").slideDown(200).css('display', 'flex')
}

$("#prev_song").click( () =>{prevSong()})
//idk what else to name it so its going to be "pause song"
$("#pause_song").click( () => {
  let state = player.getPlayerState()
  switch(state){
    case 1:
      player.pauseVideo()
      document.getElementById("pause_song").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" d="M0 0h24v24H0z"/><path d="M16.394 12L10 7.737v8.526L16.394 12zm2.982.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"/></svg>'
      break
    case 2:
      player.playVideo()
      document.getElementById("pause_song").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" d="M0 0h24v24H0z"/><path d="M6 5h2v14H6V5zm10 0h2v14h-2V5z"/></svg>'
      break
  }
}
)
$("#next_song").click(() =>{nextSong()} )

//make global editable variables
class static_vars{
  data = []
  current_indexed_song = 0
}


