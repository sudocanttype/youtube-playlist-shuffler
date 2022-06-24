document.getElementById("search_button").onclick = async function(){
	let playlistID = document.getElementById("main_search").value
	console.log(await window.electronAPI.handleSubmit(playlistID))
}
window.addEventListener("keypress", function(event){
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("search_button").click();
		}
})
