const clock = document.querySelector("#clock");

function updateClock() {
	clock.textContent = new Date().toLocaleTimeString("pt-PT", {
		hour: "2-digit",
		minute: "2-digit"
	});
}

updateClock();
setInterval(updateClock, 15000);
