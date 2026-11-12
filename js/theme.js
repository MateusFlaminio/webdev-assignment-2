const themeButton = document.querySelector(".theme-button");
const themeMenu = document.querySelector(".theme-menu");
const themeOptions = document.querySelectorAll(".theme-menu button");

function setTheme(theme) {
	if (theme === "system") {
		document.documentElement.removeAttribute("data-theme");
		localStorage.removeItem("theme");
	}
	else {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("theme", theme);
	}

	themeOptions.forEach(option => {
		option.setAttribute("aria-pressed", option.dataset.theme === theme);
	});

	setMenu(false);
}

function setMenu(open) {
	themeMenu.classList.toggle("hidden", !open);
	themeButton.setAttribute("aria-expanded", open);
}

themeButton.addEventListener("click", () => {
	setMenu(themeMenu.classList.contains("hidden"));
});

themeOptions.forEach(option => {
	option.addEventListener("click", () => {
		setTheme(option.dataset.theme);
	});
});


document.addEventListener("click", event => {
	if (!event.target.closest(".theme-container")) {
		setMenu(false);
	}
});

document.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		setMenu(false);
	}
});

setTheme(localStorage.getItem("theme") || "system");
