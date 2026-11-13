const copyButton = document.querySelector(".copy-button");
const copyIcon = copyButton.querySelector(".icon");
const copyLabel = copyButton.querySelector(".copy-label");
const emailAddress = copyLabel.textContent;

let resetTimer;

function showCopyState(label, copied) {
	copyLabel.textContent = label;
	copyIcon.classList.toggle("icon-check", copied);
	copyIcon.classList.toggle("icon-copy", !copied);
}

copyButton.addEventListener("click", async () => {
	clearTimeout(resetTimer);

	try {
		await navigator.clipboard.writeText(emailAddress);
		showCopyState("Copied!", true);
	} 
	catch {
		showCopyState("Copy failed", false);
	}

	resetTimer = setTimeout(() => showCopyState(emailAddress, false), 2000);
});
