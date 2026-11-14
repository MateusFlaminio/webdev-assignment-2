const pages = [
	{ name: "home", href: "./", label: "Home" },
	{ name: "background", href: "background", label: "Background" },
	{ name: "projects", href: "projects", label: "Projects" }
];

class SiteHeader extends HTMLElement {
	connectedCallback() {
		const links = pages.map(page => {
			const current = page.name === this.getAttribute("current") ? ' aria-current="page"' : "";

			return `<a href="${page.href}"${current}>${page.label}</a>`;
		}).join("\n\t\t\t\t\t\t");

		this.innerHTML = `
			<header class="navbar">
				<div class="container navbar-inner">
					<a class="brand" href="./">
						<span class="brand-orb">
							<img src="assets/images/pfp.webp" alt="Profile picture">
						</span>
						<span class="brand-text">
							<b>MATEUS FLAMÍNIO</b>
							<small>COMPUTER ENGINEERING STUDENT</small>
						</span>
					</a>

					<nav class="nav-links" id="site-nav" aria-label="Main">
						${links}
					</nav>

					<div class="nav-actions">
						<span class="nav-clock" data-clock="time">--:--</span>

						<div class="theme-container">
							<button class="round-button theme-button" type="button" aria-label="Theme" data-tooltip="Theme" data-tooltip-position="bottom" aria-expanded="false" aria-controls="theme-menu">
								<span class="icon icon-theme" aria-hidden="true"></span>
							</button>

							<div class="theme-menu dropdown-menu hidden" id="theme-menu">
								<button type="button" data-theme="system" aria-pressed="false">System</button>
								<button type="button" data-theme="light" aria-pressed="false">Light</button>
								<button type="button" data-theme="dark" aria-pressed="false">Dark</button>
							</div>
						</div>

						<button class="round-button menu-button" type="button" aria-label="Menu" data-tooltip="Menu" data-tooltip-position="bottom" aria-expanded="false" aria-controls="site-nav">
							<span class="icon icon-menu" aria-hidden="true"></span>
						</button>
					</div>
				</div>
			</header>`;
	}
}

class SiteFooter extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<footer class="site-footer">
				<div class="container footer-inner">
					<div class="footer-top">
						<strong>MATEUS FLAMÍNIO</strong>

						<nav class="footer-links" aria-label="Social">
							<a href="https://github.com/MateusFlaminio" target="_blank" rel="noopener"><span class="logo logo-github" aria-hidden="true"></span> GitHub</a>
							<a href="https://www.linkedin.com/in/mateus-flam%C3%ADnio-bba912349/" target="_blank" rel="noopener"><span class="logo logo-linkedin" aria-hidden="true"></span> LinkedIn</a>
						</nav>

						<small>© 2026 · University of Coimbra</small>
					</div>
					<p class="credits">Icons from Lucide (ISC license) and Simple Icons (CC0). Fonts: Nunito and Space Mono from Google Fonts.</p>
				</div>
			</footer>`;
	}
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
