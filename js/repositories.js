const username = "MateusFlaminio";
const cacheKey = "repositories";
const cacheLifetime = 10 * 60 * 1000;

async function getRepositories() {
	try {
		const cached = JSON.parse(sessionStorage.getItem(cacheKey));
		if (cached && Date.now() - cached.savedAt < cacheLifetime) {
			return cached.repositories;
		}

		const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
		if (!response.ok) {
			return null;
		}

		const repositories = (await response.json())
			.filter(({ fork }) => !fork)
			.map(({ name, description, language, stargazers_count: stars, html_url: url }) => ({ name, description, language, stars, url }));

		sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repositories }));
		return repositories;
	}
	catch {
		return null;
	}
}
