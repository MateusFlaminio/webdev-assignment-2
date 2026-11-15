import { getRepositories } from "./repositories.js";
import { setupRepositoryDialog } from "./repo-dialog.js";

const slotsPerPage = 12;
const searchDelay = 250;

const sorters = {
	updated: (first, second) => second.updated.localeCompare(first.updated),
	stars: (first, second) => second.stars - first.stars,
	name: (first, second) => first.name.localeCompare(second.name),
};

async function main() {
	const [repositories] = await Promise.all([
		getRepositories(),
		customElements.whenDefined("repo-card"),
	]);

	const error = document.querySelector(".project-error");

	document.querySelector(".project-loading").classList.add("hidden");

	if (!repositories) {
		error.classList.remove("hidden");
		error.querySelector("button").addEventListener("click", () => location.reload());
		return;
	}

	showBoard(repositories);
}

function showBoard(repositories) {
	const board = document.querySelector(".project-board");
	const grid = board.querySelector(".project-grid");
	const stage = board.querySelector(".project-stage");
	const controls = board.querySelector(".project-controls");
	const searchInput = board.querySelector(".project-search input");
	const sortButton = board.querySelector(".sort-button");
	const sortMenu = board.querySelector(".sort-menu");
	const languageGroup = board.querySelector(".project-languages");
	const empty = board.querySelector(".project-empty");
	const [previousButton, nextButton] = board.querySelectorAll(".page-arrow");
	const pageStatus = board.querySelector(".page-status");
	const state = { search: "", language: "", sort: "updated", page: 0 };

	let searchTimer;

	function getVisibleRepositories() {
		const search = state.search.trim().toLowerCase();

		return repositories
			.filter(({ language }) => !state.language || language === state.language)
			.filter(({ name, description, language }) => !search || `${name} ${description ?? ""} ${language ?? ""}`.toLowerCase().includes(search))
			.sort(sorters[state.sort]);
	}

	function showLanguageChips() {
		const counts = new Map();

		repositories.forEach(({ language }) => {
			if (language) {
				counts.set(language, (counts.get(language) ?? 0) + 1);
			}
		});

		const languages = [...counts].sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]));

		languageGroup.replaceChildren(
			createChip("", "All", repositories.length),
			...languages.map(([language, count]) => createChip(language, language, count)),
		);
		languageGroup.classList.toggle("hidden", languages.length === 0);
	}

	function createChip(language, label, count) {
		const chip = document.createElement("button");
		chip.className = "button chip";
		chip.type = "button";
		chip.dataset.language = language;
		chip.textContent = `${label} · ${count}`;
		chip.setAttribute("aria-pressed", language === state.language);
		return chip;
	}

	function showPage() {
		const visible = getVisibleRepositories();
		const pageCount = Math.max(1, Math.ceil(visible.length / slotsPerPage));
		const noMatches = repositories.length > 0 && visible.length === 0;
		const filtered = visible.length !== repositories.length;

		state.page = Math.min(state.page, pageCount - 1);
		grid.replaceChildren();

		for (let slot = 0; slot < slotsPerPage; slot++) {
			const repository = visible[state.page * slotsPerPage + slot];
			grid.append(repository ? createCard(repository, slot) : createEmptySlot(slot));
		}

		board.querySelector(".channel-title").textContent = filtered ? `Channels · ${visible.length} of ${repositories.length}` : `Channels · ${repositories.length}`;
		stage.classList.toggle("hidden", noMatches);
		empty.classList.toggle("hidden", !noMatches);
		pageStatus.textContent = `Page ${state.page + 1} of ${pageCount}`;
		pageStatus.classList.toggle("hidden", pageCount === 1 || noMatches);
		[previousButton, nextButton].forEach(button => button.classList.toggle("hidden", pageCount === 1));
		previousButton.disabled = state.page === 0;
		nextButton.disabled = state.page === pageCount - 1;
	}

	function showControls() {
		const label = sortMenu.querySelector(`[data-sort="${state.sort}"]`).textContent;

		languageGroup.querySelectorAll(".chip").forEach(chip => {
			chip.setAttribute("aria-pressed", chip.dataset.language === state.language);
		});

		sortMenu.querySelectorAll("button").forEach(option => {
			option.setAttribute("aria-pressed", option.dataset.sort === state.sort);
		});

		sortButton.querySelector(".sort-label").textContent = label;
		sortButton.setAttribute("aria-label", `Sort by: ${label}`);

		const group = languageGroup.getBoundingClientRect();
		const chip = languageGroup.querySelector('.chip[aria-pressed="true"]').getBoundingClientRect();

		languageGroup.scrollBy({ left: chip.left - group.left - (group.width - chip.width) / 2 });
	}

	function setSortMenu(open) {
		sortMenu.classList.toggle("hidden", !open);
		sortButton.setAttribute("aria-expanded", open);
	}

	function changeFilters(changes) {
		Object.assign(state, changes, { page: 0 });
		showControls();
		showPage();
	}

	searchInput.addEventListener("input", () => {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => changeFilters({ search: searchInput.value }), searchDelay);
	});

	sortButton.addEventListener("click", () => setSortMenu(sortMenu.classList.contains("hidden")));

	sortMenu.addEventListener("click", event => {
		const option = event.target.closest("button");

		if (option) {
			changeFilters({ sort: option.dataset.sort });
			setSortMenu(false);
		}
	});

	document.addEventListener("click", event => {
		if (!event.target.closest(".sort-container")) {
			setSortMenu(false);
		}
	});

	document.addEventListener("keydown", event => {
		if (event.key === "Escape" && !sortMenu.classList.contains("hidden")) {
			setSortMenu(false);
			sortButton.focus();
		}
	});

	languageGroup.addEventListener("click", event => {
		const chip = event.target.closest(".chip");

		if (chip) {
			changeFilters({ language: chip.dataset.language });
		}
	});

	empty.querySelector("button").addEventListener("click", () => {
		searchInput.value = "";
		changeFilters({ search: "", language: "", sort: "updated" });
	});

	previousButton.addEventListener("click", () => {
		state.page--;
		showPage();
	});

	nextButton.addEventListener("click", () => {
		state.page++;
		showPage();
	});

	controls.classList.toggle("hidden", repositories.length === 0);
	showLanguageChips();
	showControls();
	showPage();
	board.classList.remove("hidden");
	setupRepositoryDialog(repositories, grid);
}

function createCard({ name, description, language, stars, url }, index) {
	const card = document.createElement("repo-card");
	card.setAttribute("name", name);
	card.setAttribute("description", description ?? "");
	card.setAttribute("language", language ?? "");
	card.setAttribute("stars", stars);
	card.setAttribute("url", url);
	card.style.setProperty("--index", index);
	return card;
}

function createEmptySlot(index) {
	const slot = document.createElement("div");
	slot.className = "empty-slot";
	slot.style.setProperty("--index", index);
	slot.textContent = "WIP";
	slot.setAttribute("aria-hidden", "true");
	return slot;
}

main();
