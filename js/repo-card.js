import { logosUrl } from "./logos.js";

const stylesheet = new CSSStyleSheet();

const languageLogos = {
	"HTML": "html5",
	"CSS": "css3",
	"SCSS": "sass",
	"JavaScript": "javascript",
	"TypeScript": "typescript",
	"Python": "python",
	"C": "c",
	"C++": "cplusplus",
	"Java": "openjdk",
	"Kotlin": "kotlin",
	"Go": "go",
	"Rust": "rust",
	"PHP": "php",
	"Shell": "gnubash",
	"Dockerfile": "docker",
	"Vue": "vuedotjs",
	"Jupyter Notebook": "jupyter",
};

function createElement(tag, className) {
	const element = document.createElement(tag);
	element.className = className;
	return element;
}

function truncate(text, limit) {
	return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

class RepoCard extends HTMLElement {
	static observedAttributes = ["name", "description", "language", "stars", "url"];

	constructor() {
		super();

		this.link = createElement("a", "card");
		this.link.target = "_blank";
		this.link.rel = "noopener";

		this.logo = createElement("span", "logo");
		this.repoName = createElement("h2", "name");
		this.repoDescription = createElement("p", "description");
		this.repoLanguage = createElement("span", "language");
		this.repoStars = createElement("span", "stars-count");

		const art = createElement("div", "art");
		art.append(this.logo, this.repoName);

		const stars = createElement("span", "stars");
		stars.append(createElement("span", "star-icon"), this.repoStars);

		const footer = createElement("div", "footer");
		footer.append(this.repoLanguage, stars, createElement("span", "arrow-icon"));

		const body = createElement("div", "body");
		body.append(this.repoDescription, footer);

		this.link.append(art, body);

		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [stylesheet];
		this.shadowRoot.append(this.link);
	}

	attributeChangedCallback(attribute, _, value) {
		if (attribute === "name") {
			this.repoName.textContent = truncate(value, 40);
			this.link.title = value;
		}
		if (attribute === "description") {
			this.repoDescription.textContent = truncate(value || "No description yet.", 70);
		}
		if (attribute === "language") {
			this.showLanguage(value);
		}
		if (attribute === "stars") {
			this.repoStars.textContent = value;
		}
		if (attribute === "url") {
			this.link.href = value;
		}
	}

	showLanguage(language) {
		const logo = languageLogos[language];

		this.repoLanguage.textContent = language || "No language";
		this.logo.style.maskImage = logo ? `url("${logosUrl}/${logo}.svg")` : "";
		this.logo.classList.toggle("fallback", !logo);
	}
}

try {
	const response = await fetch("css/repo-card.css");
	stylesheet.replaceSync(await response.text());
}
finally {
	customElements.define("repo-card", RepoCard);
}
