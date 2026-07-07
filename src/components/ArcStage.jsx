import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Text } from "troika-three-text";
import { gsap, ScrollTrigger } from "../lib/scroll";
import { PROJECTS } from "../data/content";

const N = PROJECTS.length;
const PANEL_W = 2.6;
const PANEL_H = 1.78;
const FLAT_GAP = 0.5;
const RADIUS = 3.1;
const SLOT = (PANEL_W / RADIUS) * 1.24; // angular slot per panel, with breathing room
const FLOOR_Y = -PANEL_H / 2 - 0.045;

/** Bend a subdivided plane onto a cylinder of RADIUS by `bend` (0 flat → 1 arc). */
function applyBend(geo, bend) {
  const pos = geo.attributes.position;
  const baseX = geo.userData.baseX;
  for (let i = 0; i < pos.count; i++) {
    const x = baseX[i];
    const theta = x / RADIUS;
    pos.setX(i, x + (RADIUS * Math.sin(theta) - x) * bend);
    pos.setZ(i, RADIUS * (Math.cos(theta) - 1) * bend);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function makeBendable(width, height) {
  const geo = new THREE.PlaneGeometry(width, height, 64, 1);
  geo.userData.baseX = Float32Array.from(geo.attributes.position.array.filter((_, i) => i % 3 === 0));
  return geo;
}

export default function ArcStage({ sectionRef, lenis, ready, onOpen }) {
  const mountRef = useRef(null);
  const worldRef = useRef(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("arc");
  const modeRef = useRef({ t: 1 }); // 1 = arc, 0 = flat

  /* ---------- build the scene once ready ---------- */
  useEffect(() => {
    if (!ready || !mountRef.current) return;
    const mount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.12, 5.45);
    camera.lookAt(0, 0, 0);

    // lighting: quiet ambience + a lamp that follows the visitor's hand
    scene.add(new THREE.AmbientLight(0xfff6e8, 0.55));
    const key = new THREE.DirectionalLight(0xfff2dd, 0.7);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const lamp = new THREE.PointLight(0xffffff, 8.5, 9, 1.8);
    lamp.position.set(0, 0.6, 2.4);
    scene.add(lamp);

    const panelGeo = makeBendable(PANEL_W, PANEL_H);
    const glassGeo = makeBendable(PANEL_W + 0.16, PANEL_H + 0.16);
    applyBend(panelGeo, 1);
    applyBend(glassGeo, 1);

    const glassMat = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.07,
      thickness: 0.22,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transparent: true,
      envMapIntensity: 1.15,
      side: THREE.DoubleSide,
    });

    const group = new THREE.Group();
    scene.add(group);
    const mirror = new THREE.Group();
    mirror.scale.y = -1;
    mirror.position.y = 2 * FLOOR_Y;
    scene.add(mirror);

    const loader = new THREE.TextureLoader();
    const carriers = [];
    const ghosts = [];

    PROJECTS.forEach((p, i) => {
      const tex = loader.load(p.image, (t) => {
        // cover-crop the portrait stills into the landscape panels
        const imgAspect = t.image.width / t.image.height;
        const panelAspect = PANEL_W / PANEL_H;
        t.repeat.y = imgAspect / panelAspect;
        t.offset.y = (1 - t.repeat.y) / 2;
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;

      const imgMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.5,
        metalness: 0,
        clearcoat: 0.9,
        clearcoatRoughness: 0.32,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
      });

      const carrier = new THREE.Group();
      const img = new THREE.Mesh(panelGeo, imgMat);
      img.userData.index = i;
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.z = 0.035;
      glass.userData.index = i;

      const label = new Text();
      label.text = p.title;
      label.font = "/fonts/BodoniModa-Medium.ttf";
      label.fontSize = 0.44;
      label.anchorX = "center";
      label.anchorY = "middle";
      label.position.z = 0.12;
      label.material = new THREE.MeshPhysicalMaterial({
        transmission: 0.9,
        roughness: 0.13,
        thickness: 0.65,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: true,
        envMapIntensity: 1.5,
        // navy-tinted glass: clear enough to read the image through the
        // letters, tinted enough to hold their own against pale stills
        color: 0x7488bf,
        attenuationColor: new THREE.Color(0x1e2d52),
        attenuationDistance: 1.6,
      });
      label.sync();

      carrier.add(img, glass, label);
      group.add(carrier);
      carriers.push(carrier);

      // reflection: image + glass only, sharing geometry and materials
      const ghost = new THREE.Group();
      ghost.add(new THREE.Mesh(panelGeo, imgMat));
      const ghostGlass = new THREE.Mesh(glassGeo, glassMat);
      ghostGlass.position.z = 0.035;
      ghost.add(ghostGlass);
      mirror.add(ghost);
      ghosts.push(ghost);
    });

    const world = {
      renderer,
      scene,
      camera,
      group,
      mirror,
      carriers,
      ghosts,
      lamp,
      panelGeo,
      glassGeo,
      pmrem,
      progress: 0,
      pointer: { x: 0, y: 0 },
      hover: -1,
      bend: 1,
      st: null,
      raf: 0,
    };
    worldRef.current = world;

    /* ---------- per-frame layout ---------- */
    const layout = () => {
      const t = modeRef.current.t;
      const a = world.progress * (N - 1);
      if (Math.abs(world.bend - t) > 0.0005) {
        applyBend(panelGeo, t);
        applyBend(glassGeo, t);
        world.bend = t;
      }
      carriers.forEach((carrier, i) => {
        const phi = (i - a) * SLOT;
        const ax = RADIUS * Math.sin(phi);
        const az = RADIUS * (Math.cos(phi) - 1);
        const fx = (i - a) * (PANEL_W + FLAT_GAP);
        carrier.position.set(ax * t + fx * (1 - t), 0, az * t);
        carrier.rotation.y = phi * t;
        const s = carrier.userData.scale ?? 1;
        carrier.scale.setScalar(s);
        const ghost = ghosts[i];
        ghost.position.copy(carrier.position);
        ghost.rotation.y = carrier.rotation.y;
        ghost.scale.setScalar(s);
      });
      // the room answers the hand: gentle tilt + roaming lamp
      group.rotation.x = world.pointer.y * -0.028;
      group.rotation.y = world.pointer.x * 0.05;
      mirror.rotation.x = -group.rotation.x;
      mirror.rotation.y = group.rotation.y;
      lamp.position.x += (world.pointer.x * 3.4 - lamp.position.x) * 0.08;
      lamp.position.y += (world.pointer.y * 1.5 + 0.55 - lamp.position.y) * 0.08;
    };

    const render = () => {
      layout();
      renderer.render(scene, camera);
      world.raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const r = mount.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- pointer: lamp, hover, click ---------- */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (e) => {
      const r = mount.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      world.pointer.x = ndc.x;
      world.pointer.y = ndc.y;
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(
        carriers.flatMap((c) => c.children.filter((m) => m.userData.index !== undefined))
      );
      return hits.length ? hits[0].object.userData.index : -1;
    };
    const onMove = (e) => {
      const idx = pick(e);
      if (idx !== world.hover) {
        if (world.hover >= 0)
          gsap.to(carriers[world.hover].userData, { scale: 1, duration: 0.7, ease: "power3.out" });
        if (idx >= 0)
          gsap.to(carriers[idx].userData, { scale: 1.035, duration: 0.7, ease: "power3.out" });
        world.hover = idx;
        if (idx >= 0) mount.setAttribute("data-cursor", "Open");
        else mount.removeAttribute("data-cursor");
      }
    };
    const onClick = (e) => {
      const idx = pick(e);
      if (idx >= 0) onOpen(PROJECTS[idx]);
    };
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("click", onClick);

    carriers.forEach((c) => (c.userData.scale = 1));

    /* ---------- scroll drives the walk ---------- */
    world.st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        world.progress = self.progress;
        const idx = Math.round(self.progress * (N - 1));
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });

    render();

    // this pin's spacer arrives after the initial refresh (lazy chunk), so
    // recalculate every trigger's positions once it exists
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(world.raf);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("click", onClick);
      world.st?.kill();
      carriers.forEach((c) =>
        c.children.forEach((m) => {
          if (m.dispose) m.dispose(); // troika Text
          if (m.material?.map) m.material.map.dispose();
          m.material?.dispose?.();
        })
      );
      panelGeo.dispose();
      glassGeo.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.contains(renderer.domElement) && mount.removeChild(renderer.domElement);
      worldRef.current = null;
    };
  }, [ready, sectionRef, onOpen]);

  /* ---------- controls ---------- */
  const toggleMode = () => {
    const next = mode === "arc" ? "flat" : "arc";
    setMode(next);
    gsap.to(modeRef.current, {
      t: next === "arc" ? 1 : 0,
      duration: 1.3,
      ease: "power3.inOut",
    });
  };

  const go = (dir) => {
    const world = worldRef.current;
    if (!world?.st) return;
    const target = Math.min(N - 1, Math.max(0, active + dir));
    const y = world.st.start + ((world.st.end - world.st.start) * target) / (N - 1);
    lenis?.scrollTo(y, { duration: 1.1 });
  };

  const current = PROJECTS[active];

  return (
    <div className="stage">
      <div ref={mountRef} className="stage__mount" aria-label="Selected work carousel" />
      <div className="stage__wash" aria-hidden="true" />
      <div className="stage-ui">
        <div className="stage-pill">
          <img className="stage-pill__thumb" src={current.image} alt="" />
          <span className="stage-pill__title">{current.title}</span>
          <span className="stage-pill__arrows">
            <button aria-label="Previous work" disabled={active === 0} onClick={() => go(-1)}>
              ←
            </button>
            <button aria-label="Next work" disabled={active === N - 1} onClick={() => go(1)}>
              →
            </button>
          </span>
        </div>
        <button className="stage-pill stage-pill--mode" onClick={toggleMode}>
          <span className="stage-pill__glyph" aria-hidden="true">
            {mode === "arc" ? "☰" : "◠"}
          </span>
          {mode === "arc" ? "Flat" : "Arc"} mode
        </button>
      </div>
    </div>
  );
}
