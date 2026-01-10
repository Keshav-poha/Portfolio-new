import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.target.set(0, 0.6, 0);
  controls.update();

  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1.2);
  scene.add(hemisphereLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
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
    radius: 20,
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
    sunIntensity: 1.0,
    hemiIntensity: 1.2,
    ambientIntensity: 1.2,
  };
  const nightParams = {
    sky: new THREE.Color(0x0b1230),
    sunColor: new THREE.Color(0xa8c0ff),
    sunIntensity: 0.35,
    hemiIntensity: 0.6,
    ambientIntensity: 0.5,
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

  const islandWidth = 10;
  const islandDepth = 10;
  const islandHeight = 1;
    const islandRadius = Math.max(islandWidth, islandDepth) * 0.5;
    const islandGeo = new THREE.CylinderGeometry(islandRadius, islandRadius, islandHeight, 48);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0xbfeeb7, roughness: 1, metalness: 0 });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = 0.6;
  island.receiveShadow = true;
  island.castShadow = true;
  island.userData.isIsland = true;
  scene.add(island);

  const islandTopY = island.position.y + (islandHeight * 0.5);
  const loader = new GLTFLoader();
  const roadSources = [];
  let roadTemplate = null;
  const roadTemplateSize = new THREE.Vector3();
  let decagonRadius = null;
  function createRoadFor(source) {
    if (!roadTemplate || decagonRadius == null) return;
    const pos = new THREE.Vector3();
    source.getWorldPosition(pos);
    const center = new THREE.Vector3(0, islandTopY, 0);
    const angle = Math.atan2(pos.z - center.z, pos.x - center.x);
    const target = new THREE.Vector3(Math.cos(angle) * decagonRadius, islandTopY, Math.sin(angle) * decagonRadius);
    const dir = new THREE.Vector3().subVectors(target, pos);
    const distance = dir.length();
    if (distance < 0.05) return;
    dir.normalize();
    const segLenRaw = Math.max(roadTemplateSize.x, roadTemplateSize.z) * refScale;
    const overlapFactor = 0.8; 
    const segLen = Math.max(0.01, segLenRaw * overlapFactor);
    const count = Math.max(1, Math.ceil(distance / segLen));
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const p = new THREE.Vector3().lerpVectors(pos, target, t);
      const clone = roadTemplate.clone(true);
      clone.position.set(p.x, islandTopY, p.z);
      clone.rotation.y = -angle + Math.PI / 2;
      clone.updateMatrixWorld(true);
      scene.add(clone);
    }
  }
  
  loader.load('src/assets/building-type-p.glb', (gltf) => {
    const building = gltf.scene || gltf.scenes[0];
    building.traverse((n) => {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    building.scale.set(1.3, 1.3, 1.3);
    building.position.set(-2.5, islandTopY, -2.5);
    building.rotation.y = Math.PI * -0.7;
    scene.add(building);
    roadSources.push(building);
    if (roadTemplate) createRoadFor(building);
    loader.load('src/assets/factory.glb', (gltf2) => {
      const building2 = gltf2.scene || gltf2.scenes[0];
      building2.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      building2.scale.set(0.004, 0.004, 0.004);
      building2.position.set(-2.8, islandTopY, 2.2);
      building2.rotation.y = -Math.PI * 0.3;
      scene.add(building2);
      roadSources.push(building2);
      if (roadTemplate) createRoadFor(building2);
    }, undefined, (err) => console.warn('Failed to load building2', err));
    loader.load('src/assets/Camera.glb', (camGltf) => {
      const camModel = camGltf.scene || camGltf.scenes[0];
      camModel.traverse((n) => {
        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
        }
      });
      const bbox = new THREE.Box3().setFromObject(building);
      const topY = bbox.max.y;
      const center = bbox.getCenter(new THREE.Vector3());
      camModel.scale.setScalar(2);
      camModel.position.set(center.x, topY + 0.4, center.z);
      camModel.rotation.y = building.rotation.y;
      scene.add(camModel);
    }, undefined, (err) => console.warn('Failed to load camera model', err));
  }, undefined, (err) => console.warn('Failed to load building', err));

    loader.load('src/assets/cityb.glb', (gltfC) => {
      const cityB = gltfC.scene || gltfC.scenes[0];
      cityB.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      cityB.scale.set(4,4,4);
      cityB.position.set(2, islandTopY+2.8, -3);
      cityB.rotation.y = -Math.PI * -0.3;
      scene.add(cityB);
        roadSources.push(cityB);
        if (roadTemplate) createRoadFor(cityB);
    }, undefined, (err) => console.warn('Failed to load city building', err));

  loader.load('src/assets/Radio tower.glb', (gltfR) => {
    const tower = gltfR.scene || gltfR.scenes[0];
    tower.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    tower.scale.set(1,1,1);
    tower.position.set(2, islandTopY+2.3, 3.2);
    tower.rotation.y = Math.PI * 0.15;
    scene.add(tower);
    roadSources.push(tower);
    if (roadTemplate) createRoadFor(tower);
  }, undefined, (err) => console.warn('Failed to load radio tower', err));

  const refScale = 1.3;
  loader.load('src/assets/path-long.glb', (g) => {
    const template = g.scene || g.scenes[0];
    template.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    const s = 1.0 * refScale;
    template.scale.set(s, s, s);
    template.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(template);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const radius = Math.max(size.x, size.z) * 1.4;
    roadTemplate = template;
    roadTemplateSize.copy(size);
    decagonRadius = radius;
    const count = 10; 
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * step;
      const clone = template.clone(true);
      clone.position.set(Math.cos(angle) * radius, islandTopY, Math.sin(angle) * radius);
      clone.rotation.y = -angle;
      clone.updateMatrixWorld(true);
      scene.add(clone);
    }

  
    loader.load('src/assets/Stag Statue.glb', (gStag) => {
      const stag = gStag.scene || gStag.scenes[0];
      stag.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      stag.scale.setScalar(0.5);
      stag.updateMatrixWorld(true);
      const bboxStag = new THREE.Box3().setFromObject(stag);
      const minY = bboxStag.min.y;
      stag.position.set(0, islandTopY - minY, 0);
      scene.add(stag);
    }, undefined, (err) => console.warn('Failed to load stag statue', err));

    roadSources.forEach((s) => createRoadFor(s));
  }, undefined, (err) => console.warn('Failed to load path-long', err));
  
    loader.load('src/assets/tree-large.glb', (gTreeL) => {
      const tmplL = gTreeL.scene || gTreeL.scenes[0];
      tmplL.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      tmplL.scale.set(1.2 * refScale, 1.2 * refScale, 1.2 * refScale);
      loader.load('src/assets/tree-small.glb', (gTreeS) => {
        const tmplS = gTreeS.scene || gTreeS.scenes[0];
        tmplS.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
        tmplS.scale.set(0.9 * refScale, 0.9 * refScale, 0.9 * refScale);

        const toRemove = [];
        scene.children.forEach((c) => { if (c.userData && (c.userData.isTree || c.userData.isTreePatch)) toRemove.push(c); });
        toRemove.forEach((c) => scene.remove(c));

        const patches = [
          { name: 'patch1', center: new THREE.Vector3(0, islandTopY, 3), large: 10, small: 10, spread: 0.9 },
          { name: 'patch2', center: new THREE.Vector3(2.1, islandTopY, 1.3), large: 5, small: 12, spread: 0.8 },
          { name: 'patch3', center: new THREE.Vector3(-0.6, islandTopY, -2.2), large: 4, small: 8, spread: 0.7 },
          { name: 'patch4', center: new THREE.Vector3(-2, islandTopY, -0.5), large: 3, small: 6, spread: 0.6 }
        ];

        patches.forEach((p) => {
          const group = new THREE.Group();
          group.name = p.name;
          group.userData.isTreePatch = true;
          for (let i = 0; i < p.large; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * p.spread;
            const x = p.center.x + Math.cos(a) * r;
            const z = p.center.z + Math.sin(a) * r;
            const clone = tmplL.clone(true);
            clone.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
            clone.position.set(x, p.center.y, z);
            clone.rotation.y = Math.random() * Math.PI * 2;
            clone.userData.isTree = true;
            group.add(clone);
          }
          for (let i = 0; i < p.small; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * p.spread;
            const x = p.center.x + Math.cos(a) * r;
            const z = p.center.z + Math.sin(a) * r;
            const clone = tmplS.clone(true);
            clone.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
            clone.position.set(x, p.center.y, z);
            clone.rotation.y = Math.random() * Math.PI * 2;
            clone.userData.isTree = true;
            group.add(clone);
          }
          scene.add(group);
        });
      }, undefined, (err) => console.warn('Failed to load tree-small', err));
    }, undefined, (err) => console.warn('Failed to load tree-large', err));

  loader.load('src/assets/Pond.glb', (gltfP) => {
    const pond = gltfP.scene || gltfP.scenes[0];
    pond.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = true; } });
    pond.scale.set(0.07, 0.07, 0.07);
    pond.position.set(3.8, islandTopY -0.4, -0.6);
    pond.updateMatrixWorld(true);
    scene.add(pond);
  }, undefined, (err) => console.warn('Failed to load pond', err));

  loader.load('src/assets/Volcano.glb', (gltfV) => {
    const volcano = gltfV.scene || gltfV.scenes[0];
    volcano.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    volcano.scale.set(4, 4, 4);
    volcano.rotation.x = Math.PI;
    volcano.rotation.y = Math.PI * 0.1;
    volcano.position.set(0, -0.5, 0);
    volcano.updateMatrixWorld(true);
    const bboxVol = new THREE.Box3().setFromObject(volcano);
    const topY = bboxVol.max.y;
    const islandBottomY = island.position.y - (islandHeight * 0.5);
    volcano.position.set(0, islandBottomY - 0.1 - topY, 0);
    scene.add(volcano);
    const volcanoLight = new THREE.PointLight(0xff3300, 2.5, 10, 2);
    volcanoLight.position.set(volcano.position.x, volcano.position.y + 0.6, volcano.position.z);
    scene.add(volcanoLight);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.9 });
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), glowMat);
    glowSphere.position.copy(volcanoLight.position);
    glowSphere.renderOrder = 2;
    scene.add(glowSphere);
  }, undefined, (err) => console.warn('Failed to load volcano', err));


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

    
    
    if (transition.active) {
      transition.t += delta / transition.duration;
      const t = Math.min(1, transition.t);

      const c = new THREE.Color();
      c.lerpColors(transition.from.sky, transition.to.sky, t);
      scene.background = c;

      const sc = new THREE.Color();
      sc.lerpColors(transition.from.sunColor, transition.to.sunColor, t);
      sunLight.color.copy(sc);

      
      sunLight.intensity = THREE.MathUtils.lerp(transition.from.sunIntensity, transition.to.sunIntensity, t);
      hemisphereLight.intensity = THREE.MathUtils.lerp(transition.from.hemiIntensity, transition.to.hemiIntensity, t);
      ambientLight.intensity = THREE.MathUtils.lerp(transition.from.ambientIntensity, transition.to.ambientIntensity, t);

      const r = sunOrbit.radius;
      const angle = sunOrbit.baseAngle + (transition.pathDir || 1) * Math.PI * 2 * t;
      const ox = r * Math.cos(angle);
      const oy = r * Math.sin(angle);
      const posX = sunOrbit.center.x + ox;
      const posY = sunOrbit.center.y + oy;
      const posZ = sunOrbit.center.z;
      sunMesh.position.set(posX, posY, posZ);
      glowMesh.position.copy(sunMesh.position);
      moonMesh.position.copy(sunMesh.position);
      moonGlow.position.copy(sunMesh.position);

      if (t >= 1) {
        transition.active = false;
        
        
        sunOrbit.baseAngle = (sunOrbit.baseAngle + (transition.pathDir || 1) * Math.PI * 2) % (Math.PI * 2);
      }
    }

    const showingSun = (!transition.active && isDay) || (transition.active && transition.to === dayParams);
    sunMesh.visible = showingSun;
    glowMesh.visible = showingSun;
    moonMesh.visible = !showingSun;
    moonGlow.visible = !showingSun;

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

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  return { scene, camera, renderer };
}
