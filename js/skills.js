const logosUrl = "https://cdn.jsdelivr.net/npm/simple-icons@13.15.0/icons";
const skillsList = document.querySelector(".skills-list");
const skillsCount = document.querySelector(".skills-count");

async function loadSkills() {
	const response = await fetch("data/skills.json");
	const skills = response.ok && await response.json();

	if (skills) {
		skillsCount.textContent = skills.length;

		skills.forEach(({ name, logo }) => {
			const skillLogo = document.createElement("span");
			skillLogo.className = "logo";
			skillLogo.style.maskImage = `url("${logosUrl}/${logo}.svg")`;
			skillLogo.setAttribute("aria-hidden", "true");

			const skill = document.createElement("li");
			skill.append(skillLogo, name);

			skillsList.append(skill);
		});
	}
}

loadSkills();
