import { getRepositories } from "./repositories.js";

const repositories = await getRepositories();

if (repositories) {
	document.querySelector(".repos-count").textContent = repositories.length;
}
