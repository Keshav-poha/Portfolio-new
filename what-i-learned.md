What I Learned

This project was a compact, hands-on way to combine interactive WebGL visuals with a small web portfolio. Below are the most noteworthy technical and non-technical lessons.

Technical takeaways
- Three.js fundamentals: scene graph, meshes, materials, and cameras.
- Lighting and shadows: balancing HemisphereLight, AmbientLight, and DirectionalLight for readable scenes.
- Performance considerations: clamping `devicePixelRatio`, limiting shadow map size, and lazy-loading images.
- Controls & UX: `OrbitControls` tuning (damping, min/max distance, target) to make navigation pleasant.
- Asset loading: GLTFLoader patterns and handling asynchronous model loads in the scene lifecycle.
- Lazy image loading: using `IntersectionObserver` for the masonry album for better loading behaviour and reduced memory usage.
- Camera animation: implementing ease functions and smooth interpolation between camera positions and targets.
- Accessibility & UX: modal management, keyboard/aria attributes, and graceful fallbacks for missing DOM elements.

Soft skills & workflow
- Project organization: grouping code under `src/` and assets under `public/`/`portfolio_pictures/` makes iteration easier.
- Debugging WebGL: visualizing light and camera positions helped track unexpected results.
- Progressive enhancement: delivering simple HTML first, then adding JS features incrementally.

What I would do next
- Optimize textures and compress images for faster load, especially on mobile.
- Add unit or integration tests for key UI behaviors (modal open/close, lazy-load triggers).
- Improve accessibility: keyboard traps, focus management inside modals, and more descriptive alt text for images.
- Add a small deploy script or CI pipeline to automate publishing.

Misc notes
- Keep an eye on memory when creating/removing many meshes or textures — always dispose of Three.js resources when removing them.
