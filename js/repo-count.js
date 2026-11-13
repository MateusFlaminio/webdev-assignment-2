async function showRepoCount() {
	const repositories = await getRepositories();

	if (repositories) {
		document.querySelector(".repos-count").textContent = repositories.length;
	}
}

showRepoCount();
