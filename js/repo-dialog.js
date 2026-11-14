const dialog = document.querySelector(".repo-dialog");
const hashPrefix = "#repo/";

const languageColors = {
	"HTML": "#e34c26",
	"CSS": "#663399",
	"SCSS": "#c6538c",
	"JavaScript": "#f1e05a",
	"TypeScript": "#3178c6",
	"Python": "#3572a5",
	"C": "#555555",
	"C++": "#f34b7d",
	"Java": "#b07219",
	"Kotlin": "#a97bff",
	"Go": "#00add8",
	"Rust": "#dea584",
	"PHP": "#4f5d95",
	"Shell": "#89e051",
	"Dockerfile": "#384d54",
	"Vue": "#41b883",
	"Jupyter Notebook": "#da5b0b",
	"Makefile": "#427819",
	"QML": "#44a51c",
};

let repositories = [];
let opener = null;
let languageRequest = 0;

function setupRepositoryDialog(allRepositories, grid) {
	repositories = allRepositories;

	grid.addEventListener("click", event => {
		const card = event.target.closest("repo-card");
		const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

		if (!card || event.button !== 0 || modified) {
			return;
		}

		event.preventDefault();
		opener = card;
		location.hash = hashPrefix + encodeURIComponent(card.getAttribute("name"));
	});

	window.addEventListener("hashchange", showDialogForHash);
	showDialogForHash();
}

function getHashName() {
	if (!location.hash.startsWith(hashPrefix)) {
		return null;
	}

	try {
		return decodeURIComponent(location.hash.slice(hashPrefix.length));
	}
	catch {
		return null;
	}
}

function showDialogForHash() {
	const name = getHashName();
	const repository = repositories.find(repository => repository.name === name);

	if (repository) {
		openRepositoryDialog(repository);
	}
	else if (dialog.open) {
		dialog.close();
	}
}

function openRepositoryDialog({ name, description, language, stars, url, updated }) {
	dialog.querySelector("#repo-dialog-title").textContent = name;
	dialog.querySelector(".repo-description").textContent = description || "No description yet.";
	dialog.querySelector(".repo-language").textContent = language || "None";
	dialog.querySelector(".repo-stars").textContent = stars;
	dialog.querySelector(".repo-updated").textContent = new Date(updated).toLocaleDateString("en-GB", { dateStyle: "medium" });
	dialog.querySelector(".repo-actions a").href = url;

	showLanguages(name);

	if (!dialog.open) {
		dialog.showModal();
	}
}

async function showLanguages(name) {
	const request = ++languageRequest;
	const bar = dialog.querySelector(".language-bar");
	const legend = dialog.querySelector(".language-legend");
	const status = dialog.querySelector(".language-status");

	bar.replaceChildren();
	legend.replaceChildren();
	status.textContent = "Loading languages…";

	const languages = await getLanguages(name);

	if (request !== languageRequest) {
		return;
	}

	const entries = Object.entries(languages ?? {}).sort((first, second) => second[1] - first[1]);
	const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

	if (total === 0) {
		status.textContent = languages ? "No language data yet." : "Languages unavailable.";
		return;
	}

	status.textContent = "";

	entries.forEach(([language, bytes]) => {
		const percent = bytes / total * 100;
		const segment = document.createElement("span");
		const item = document.createElement("li");
		const color = languageColors[language];

		segment.style.flexGrow = bytes;

		if (color) {
			segment.style.setProperty("--language-color", color);
			item.style.setProperty("--language-color", color);
		}

		item.textContent = `${language} · ${percent < 1 ? "<1" : Math.round(percent)}%`;
		bar.append(segment);
		legend.append(item);
	});
}

dialog.addEventListener("click", event => {
	if (event.target === dialog || event.target.closest(".repo-actions button")) {
		dialog.close();
	}
});

dialog.addEventListener("close", () => {
	if (location.hash.startsWith(hashPrefix)) {
		history.replaceState(null, "", location.pathname + location.search);
	}

	opener?.shadowRoot.querySelector("a")?.focus();
	opener = null;
});
