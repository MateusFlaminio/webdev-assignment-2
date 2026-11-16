# Assignment 2 - Static Website
### Web Development Course (2026)
**Mateus Flamínio - 2022214881**

**Website:** https://mateusflaminio.github.io/webdev-assignment-2/

## Description
This project consists of a static website serving as a personal portfolio. The design is inspired by the Nintendo Wii menu, featuring glossy pill buttons, soft pinstripe backgrounds, and TV-shaped "channel" tiles. The website introduces me, showcases my background and experience, lists my skills, and showcases my public GitHub projects.

The website contains three main pages:
- **Home:** a hero section with a small introduction and a card, an about section with a small memory game, the tools and languages I'm familiar with, and links to my LinkedIn and GitHub.
- **Background:** my work experience, academic path and other courses as timelines.
- **Projects:** my public GitHub repositories as a grid of channels (mimicking the Wii menu).

## Features
- The projects page fetches my public repositories from the GitHub API and displays them as channel tiles, with a details dialog for each project showing its description, stars, last update, and a language breakdown bar. A loading indicator is displayed while the data is being fetched.
- Projects can be searched by name, description, or language, filtered by language, sorted in various ways, and paginated.
- Each project dialog has its own URL (`#repo/name`), allowing for direct linking, and the browser's back button closes the dialog.
- Skills are loaded from a static JSON file (`data/skills.json`), making it easy to add new skills by simply adding a new entry to the JSON file.
- Dynamic interactions include a memory game, a light/dark/system theme selector (with the choice stored in local storage), dropdown menus, tooltips, and a responsive navigation menu.
- CSS animations include hover and expand effects, animated dropdowns, and Wii-style "empty channel" tiles. All animations are disabled for users with `prefers-reduced-motion`.
- The website is fully responsive, adapting layouts for small phones to wide desktop screens.
- The website is accessible, with semantic HTML, labelled sections, visible focus outlines, keyboard navigation, and a native `<dialog>` for project details.

## Technical notes
The site is made only with HTML, CSS and JavaScript, with no third-party libraries, and works on Chrome and Firefox.

- **HTML:** semantic elements, the native `<dialog>` element and a `repo-card` custom element.
- **CSS:** one small stylesheet per component, nested rules, custom properties for all colors, spacing and typography, `light-dark()` for the themes, `:has()` and `prefers-reduced-motion`, using flexbox and grid for layout.
- **JavaScript:** ES modules, `fetch` with `async`/`await`, and one module per feature. The navigation bar and footer are shared between pages by `js/site-layout.js`.

## Running locally (for development)
Make sure you have Node.js installed, then run the following command in the root of the repository:

```
node web-server/server.js
```
Then open http://localhost:3000.

## Credits
- Icons from [Lucide](https://lucide.dev) (ISC license) and [Simple Icons](https://simpleicons.org) (CC0).
- Fonts: Rubik and JetBrains Mono, from Google Fonts.
- Development server by Professor João Cardoso, Web Development 2026, DEI-UC.
