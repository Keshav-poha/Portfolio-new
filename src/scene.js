import * as THREE from 'three';

export function initScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ad7f0);
  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, -5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  scene.add(hemisphereLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.75);
  sunLight.position.set(-45, 800, -100);
  sunLight.castShadow = true;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.camera.left = -120;
  sunLight.shadow.camera.right = 120;
  sunLight.shadow.camera.top = 120;
  sunLight.shadow.camera.bottom = -120;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 1200;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.target.position.set(0, 0, 0);
  scene.add(sunLight.target);
  scene.add(sunLight);

  const celestialPos = new THREE.Vector3(-100, 0,0 );

  const sunOrbit = {
    center: new THREE.Vector3(0, 0, 0),
    radius: 20, // distance from origin for the circular path
    baseAngle: Math.PI,
  };

  const sunGeo = new THREE.SphereGeometry(1.2, 16, 8);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe08a });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.copy(celestialPos);
  {
    const a = sunOrbit.baseAngle;
    sunMesh.position.set(sunOrbit.center.x + sunOrbit.radius * Math.cos(a), sunOrbit.center.y + sunOrbit.radius * Math.sin(a), sunOrbit.center.z);
  }
  sunMesh.castShadow = false;
  sunMesh.receiveShadow = false;
  scene.add(sunMesh);

  const glowGeo = new THREE.SphereGeometry(3, 16, 8);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.12 });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.position.copy(celestialPos);
  {
    const a = sunOrbit.baseAngle;
    glowMesh.position.set(sunOrbit.center.x + sunOrbit.radius * Math.cos(a), sunOrbit.center.y + sunOrbit.radius * Math.sin(a), sunOrbit.center.z);
  }
  glowMesh.renderOrder = 0;
  scene.add(glowMesh);

  

  const moonGeo = new THREE.SphereGeometry(0.75, 12, 8);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xd7e7ff });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.copy(celestialPos);
  {
    const a = sunOrbit.baseAngle;
    moonMesh.position.set(sunOrbit.center.x + sunOrbit.radius * Math.cos(a), sunOrbit.center.y + sunOrbit.radius * Math.sin(a), sunOrbit.center.z);
  }
  moonMesh.visible = false;
  scene.add(moonMesh);

  const moonGlowGeo = new THREE.SphereGeometry(1.8, 12, 8);
  const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0xd7e7ff, transparent: true, opacity: 0.06 });
  const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
  moonGlow.position.copy(celestialPos);
  {
    const a = sunOrbit.baseAngle;
    moonGlow.position.set(sunOrbit.center.x + sunOrbit.radius * Math.cos(a), sunOrbit.center.y + sunOrbit.radius * Math.sin(a), sunOrbit.center.z);
  }
  moonGlow.visible = false;
  scene.add(moonGlow);

  const dayParams = {
    sky: new THREE.Color(0x7ad7f0),
    sunColor: new THREE.Color(0xffffff),
    sunIntensity: 0.75,
    hemiIntensity: 0.9,
    ambientIntensity: 0.5,
  };
  const nightParams = {
    sky: new THREE.Color(0x0b1230),
    sunColor: new THREE.Color(0xa8c0ff),
    sunIntensity: 0.18,
    hemiIntensity: 0.25,
    ambientIntensity: 0.08,
  };

  let isDay = true;
  let transition = { active: false, t: 0, duration: 1.0, from: null, to: null };

  function startTransition(toDay) {
    transition.active = true;
    transition.t = 0;
    transition.from = isDay ? dayParams : nightParams;
    transition.to = toDay ? dayParams : nightParams;
    isDay = toDay;
    transition.pathDir = toDay ? -1 : 1;
    if (toDay) container.classList.remove('night'); else container.classList.add('night');
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects([sunMesh, glowMesh], true);
    if (hits.length > 0) startTransition(!isDay);
  }

  renderer.domElement.addEventListener('click', onClick);

  const islandWidth = 5;
  const islandDepth = 5;
  const islandHeight = 1; // thin but visible thickness
  const islandGeo = new THREE.BoxGeometry(islandWidth, islandHeight, islandDepth);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0xbfeeb7, roughness: 0, metalness: 0 });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = 0.6;
  island.receiveShadow = true;
  island.castShadow = true;
  scene.add(island);

  

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  onResize();

  let last = 0;
  function animate(time) {
    const delta = (time - last) * 0.001;
    last = time;

    // handle day/night transition
    if (transition.active) {
      transition.t += delta / transition.duration;
      const t = Math.min(1, transition.t);

      // sky
      const c = new THREE.Color();
      c.lerpColors(transition.from.sky, transition.to.sky, t);
      scene.background = c;

      // sun color
      const sc = new THREE.Color();
      sc.lerpColors(transition.from.sunColor, transition.to.sunColor, t);
      sunLight.color.copy(sc);

      // intensities
      sunLight.intensity = THREE.MathUtils.lerp(transition.from.sunIntensity, transition.to.sunIntensity, t);
      hemisphereLight.intensity = THREE.MathUtils.lerp(transition.from.hemiIntensity, transition.to.hemiIntensity, t);
      ambientLight.intensity = THREE.MathUtils.lerp(transition.from.ambientIntensity, transition.to.ambientIntensity, t);

      // circular entry/exit: fixed radius orbit around origin, start at left and complete full circle
      const r = sunOrbit.radius; // constant radius so we do a full circular path
      const angle = sunOrbit.baseAngle + (transition.pathDir || 1) * Math.PI * 2 * t;
      // move in X and Y (vertical) while keeping Z fixed
      const ox = r * Math.cos(angle);
      const oy = r * Math.sin(angle);
      const posX = sunOrbit.center.x + ox;
      const posY = sunOrbit.center.y + oy;
      const posZ = sunOrbit.center.z;
      sunMesh.position.set(posX, posY, posZ);
      glowMesh.position.copy(sunMesh.position);
      moonMesh.position.copy(sunMesh.position);
      moonGlow.position.copy(sunMesh.position);

      // show/hide meshes at ends with gentle fade (instant visibility during transition)
      if (t >= 1) {
        transition.active = false;
        // advance baseAngle so subsequent animations vary
        sunOrbit.baseAngle = (sunOrbit.baseAngle + (transition.pathDir || 1) * Math.PI * 2) % (Math.PI * 2);
      }
    }

    // visibility: show sun when current target is day and transition inactive OR during transition lerp
    const showingSun = (!transition.active && isDay) || (transition.active && transition.to === dayParams);
    sunMesh.visible = showingSun;
    glowMesh.visible = showingSun;
    moonMesh.visible = !showingSun;
    moonGlow.visible = !showingSun;

    // when not transitioning, keep meshes at the left-most orbit position (start/end point)
    if (!transition.active) {
      const a = sunOrbit.baseAngle;
      const px = sunOrbit.center.x + sunOrbit.radius * Math.cos(a);
      const py = sunOrbit.center.y + sunOrbit.radius * Math.sin(a);
      const pz = sunOrbit.center.z;
      sunMesh.position.set(px, py, pz);
      glowMesh.position.set(px, py, pz);
      moonMesh.position.set(px, py, pz);
      moonGlow.position.set(px, py, pz);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  return { scene, camera, renderer };
}
