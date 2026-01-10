Portfolio

Hi — this is a personal web portfolio showcasing projects, photography and a tiny WebGL scene. It's built with plain HTML, CSS and JavaScript and uses Three.js for the interactive 3D header.

What you’ll find
- A small interactive 3D scene (WebGL / Three.js) that serves as the site header.
- A photography album with lazy-loaded images.
- A projects modal with links to live demos and GitHub repositories.

Tech & libraries
- Three.js (scene, lighting, controls, GLTF loader)
- Vanilla JavaScript (DOM, IntersectionObserver, accessibility helpers)


Project layout (important files)
- `index.html` — entry page
- `src/main.js` — app bootstrap
- `src/scene.js` — Three.js scene, camera, lights, interactions
- `public/` — extra static pages and assets (doom.html, assets/)
- `portfolio_pictures/` — photography used by the album


Getting started

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```


