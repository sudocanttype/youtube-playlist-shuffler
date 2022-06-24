document.getElementById("search_button").onclick = async function(){
	console.log(await window.electronAPI.handleSubmit())
}
window.addEventListener("keypress", function(event){
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("search_button").click();
		}
})
