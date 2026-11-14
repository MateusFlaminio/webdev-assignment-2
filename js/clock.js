const clocks = document.querySelectorAll("[data-clock]");

const formats = {
	time: { hour: "2-digit", minute: "2-digit" },
	date: { weekday: "short", day: "numeric", month: "short" }
};

function updateClock() {
	const now = new Date();

	clocks.forEach(clock => {
		clock.textContent = now.toLocaleString("en-GB", formats[clock.dataset.clock]);
	});
}

updateClock();
setInterval(updateClock, 15000);
