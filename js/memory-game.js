import { logosUrl } from "./logos.js";
import { skills } from "./skills.js";

const game = document.querySelector(".memory-game");
const memoryGrid = game.querySelector(".memory-grid");
const movesOutput = game.querySelector(".memory-moves");
const bestOutput = game.querySelector(".memory-best");
const statusOutput = game.querySelector(".memory-status");

const pairCount = 6;
const mismatchDelay = 800;
const bestKey = "memory-best";

let firstCard = null;
let locked = false;
let moves = 0;
let matches = 0;
let timer;

function shuffle(list) {
	const copy = [...list];

	for (let index = copy.length - 1; index > 0; index--) {
		const other = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[other]] = [copy[other], copy[index]];
	}

	return copy;
}

function readBest() {
	try {
		const best = Number(localStorage.getItem(bestKey));
		return best > 0 ? best : null;
	}
	catch {
		return null;
	}
}

function saveBest(best) {
	try {
		localStorage.setItem(bestKey, best);
	}
	catch {
		return;
	}
}

function showBest() {
	bestOutput.textContent = readBest() ?? "–";
}

function setFace(card, faceUp) {
	card.classList.toggle("flipped", faceUp);
	card.setAttribute("aria-label", faceUp ? `${card.dataset.skill}, face up` : `Card ${card.dataset.position}, face down`);
}

function createCard({ name, logo }, index) {
	const card = document.createElement("button");
	card.className = "memory-card";
	card.type = "button";
	card.dataset.skill = name;
	card.dataset.position = index + 1;
	card.innerHTML = '<span class="card-inner"><span class="card-back" aria-hidden="true">?</span><span class="card-front" aria-hidden="true"><span class="logo"></span></span></span>';
	card.querySelector(".logo").style.maskImage = `url("${logosUrl}/${logo}.svg")`;
	setFace(card, false);
	return card;
}

function newGame() {
	clearTimeout(timer);

	const picked = shuffle(skills).slice(0, pairCount);

	memoryGrid.replaceChildren(...shuffle([...picked, ...picked]).map(createCard));
	firstCard = null;
	locked = false;
	moves = 0;
	matches = 0;
	movesOutput.textContent = moves;
	statusOutput.textContent = "";
	showBest();
}

function finishGame() {
	const best = readBest();
	const record = best === null || moves < best;

	if (record) {
		saveBest(moves);
		showBest();
	}

	statusOutput.textContent = record ? `Cleared in ${moves} moves, a new best!` : `Cleared in ${moves} moves.`;
}

function markMatched(first, second) {
	[first, second].forEach(card => {
		card.classList.add("matched");
		card.setAttribute("aria-disabled", "true");
		card.setAttribute("aria-label", `${card.dataset.skill}, matched`);
	});

	matches++;

	if (matches === pairCount) {
		finishGame();
	}
}

function flipCard(card) {
	if (locked || card.classList.contains("flipped")) {
		return;
	}

	setFace(card, true);

	if (!firstCard) {
		firstCard = card;
		return;
	}

	const first = firstCard;

	firstCard = null;
	moves++;
	movesOutput.textContent = moves;

	if (first.dataset.skill === card.dataset.skill) {
		markMatched(first, card);
		return;
	}

	locked = true;
	timer = setTimeout(() => {
		setFace(first, false);
		setFace(card, false);
		locked = false;
	}, mismatchDelay);
}

memoryGrid.addEventListener("click", event => {
	const card = event.target.closest(".memory-card");

	if (card) {
		flipCard(card);
	}
});

game.querySelector(".memory-new").addEventListener("click", newGame);

if (skills.length < pairCount) {
	game.classList.add("hidden");
}
else {
	newGame();
}
