document.getElementById("search_button").onclick = async function(){
	let search = document.getElementById("main_search").value
	console.log(search)
	console.log(await window.electronAPI.handleSubmit(search))
}
window.addEventListener("keypress", function(event){
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("search_button").click();
		}
})
