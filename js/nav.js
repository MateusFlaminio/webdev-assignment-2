const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

function setNavMenu(open) {
	navLinks.classList.toggle("open", open);
	menuButton.setAttribute("aria-expanded", open);
}

menuButton.addEventListener("click", () => {
	setNavMenu(!navLinks.classList.contains("open"));
});

navLinks.addEventListener("click", event => {
	if (event.target.closest("a")) {
		setNavMenu(false);
	}
});

document.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		setNavMenu(false);
	}
});
