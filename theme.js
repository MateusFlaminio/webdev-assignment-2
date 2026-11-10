const themeButton = document.querySelector(".theme-button");
const themeMenu = document.querySelector(".theme-menu");
const themeOptions = document.querySelectorAll("[data-theme]");

function setTheme(theme) {
    if (theme === "system") {
        document.documentElement.removeAttribute("data-theme");
		localStorage.removeItem("theme");
    } 
	else {
        document.documentElement.dataset.theme = theme;
		localStorage.setItem("theme", theme);
    }

    themeMenu.classList.add("hidden");
}

themeButton.addEventListener("click", () => {
	themeMenu.classList.toggle("hidden");
});

themeOptions.forEach(option => {
    option.addEventListener("click", () => {
		setTheme(option.dataset.theme);
    });
});

setTheme(localStorage.getItem("theme") || "system");