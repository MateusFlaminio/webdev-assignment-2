const slotsPerPage = 12;

async function main() {
	const [repositories] = await Promise.all([
		getRepositories(),
		new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve)),
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
	const [previousButton, nextButton] = board.querySelectorAll(".page-arrow");
	const pageStatus = board.querySelector(".page-status");
	const pageCount = Math.max(1, Math.ceil(repositories.length / slotsPerPage));

	let currentPage = 0;

	function showPage(page) {
		grid.replaceChildren();

		for (let slot = 0; slot < slotsPerPage; slot++) {
			const repository = repositories[page * slotsPerPage + slot];
			grid.append(repository ? createCard(repository, slot) : createEmptySlot(slot));
		}

		pageStatus.textContent = `Page ${page + 1} of ${pageCount}`;
		previousButton.disabled = page === 0;
		nextButton.disabled = page === pageCount - 1;
		currentPage = page;
	}

	board.querySelector(".channel-title").textContent = `Channels · ${repositories.length}`;
	[pageStatus, previousButton, nextButton].forEach(element => element.classList.toggle("hidden", pageCount === 1));
	previousButton.addEventListener("click", () => showPage(currentPage - 1));
	nextButton.addEventListener("click", () => showPage(currentPage + 1));

	board.classList.remove("hidden");
	showPage(0);
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
