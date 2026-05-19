"use client";

import { useEffect, useRef, useState } from "react";
import { Cabin_Sketch } from "next/font/google";

const cabinSketch = Cabin_Sketch({
  subsets: ["latin"],
  weight: ["700"],
});

const DESIGN_W = 1080;
const DESIGN_H = 720;

type Repo = {
  name: string;
  description: string;
  html_url: string;
  languages: string[];
  stars: number;
  homepage: string;
  fork: boolean;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Docker: "#389DEC",
  "Jupyter Notebook": "#DA5B0B"
};

const FALLBACK_REPOS: Repo[] = [
  {
    name: "Pixel-Pluck",
    description: "An interactive, sketch-based canvas pixel art game and editor built with TypeScript.",
    html_url: "https://github.com/Keshav-poha/Pixel-Pluck",
    languages: ["TypeScript", "CSS", "HTML"],
    stars: 8,
    homepage: "https://pixel-pluck.vercel.app",
    fork: false
  },
  {
    name: "Portfolio-new",
    description: "A gorgeous, interactive hand-drawn notebook portfolio built with Next.js and Tailwind CSS.",
    html_url: "https://github.com/Keshav-poha/Portfolio-new",
    languages: ["TypeScript", "JavaScript", "CSS"],
    stars: 12,
    homepage: "https://keshav.xyz",
    fork: false
  },
  {
    name: "dsabuddy",
    description: "A fully interactive visual data structures and algorithms platform for learners.",
    html_url: "https://github.com/Keshav-poha/dsabuddy",
    languages: ["JavaScript", "HTML", "CSS"],
    stars: 5,
    homepage: "https://dsabuddy.tech",
    fork: false
  },
  {
    name: "neural-archeology",
    description: "Analyzing hidden layers and historical weights of deep neural networks in Python.",
    html_url: "https://github.com/Keshav-poha/neural-archeology",
    languages: ["Python", "Jupyter Notebook"],
    stars: 15,
    homepage: "",
    fork: false
  },
  {
    name: "ClubConnect",
    description: "High-performance backend API for university club connections and event management.",
    html_url: "https://github.com/Keshav-poha/ClubConnect",
    languages: ["Go", "Docker", "Shell"],
    stars: 7,
    homepage: "",
    fork: false
  }
];

const CARD_THEMES = [
  {
    bg: "bg-yellow-50/95 hover:bg-yellow-50",
    border: "border-yellow-300/80 hover:border-yellow-400",
    text: "text-yellow-900",
    descText: "text-yellow-800/90",
    badgeBg: "bg-yellow-100 text-yellow-800",
    shadow: "shadow-[3px_3px_0px_rgba(234,179,8,0.18)] hover:shadow-[6px_6px_0px_rgba(234,179,8,0.25)]",
    rotate: "rotate-[-1.5deg]"
  },
  {
    bg: "bg-blue-50/95 hover:bg-blue-50",
    border: "border-blue-300/80 hover:border-blue-400",
    text: "text-blue-900",
    descText: "text-blue-800/90",
    badgeBg: "bg-blue-100 text-blue-800",
    shadow: "shadow-[3px_3px_0px_rgba(59,130,246,0.18)] hover:shadow-[6px_6px_0px_rgba(59,130,246,0.25)]",
    rotate: "rotate-[1.2deg]"
  },
  {
    bg: "bg-rose-50/95 hover:bg-rose-50",
    border: "border-rose-300/80 hover:border-rose-400",
    text: "text-rose-900",
    descText: "text-rose-800/90",
    badgeBg: "bg-rose-100 text-rose-800",
    shadow: "shadow-[3px_3px_0px_rgba(244,63,94,0.18)] hover:shadow-[6px_6px_0px_rgba(244,63,94,0.25)]",
    rotate: "rotate-[-0.8deg]"
  },
  {
    bg: "bg-green-50/95 hover:bg-green-50",
    border: "border-green-300/80 hover:border-green-400",
    text: "text-green-900",
    descText: "text-green-800/90",
    badgeBg: "bg-green-100 text-green-800",
    shadow: "shadow-[3px_3px_0px_rgba(34,197,94,0.18)] hover:shadow-[6px_6px_0px_rgba(34,197,94,0.25)]",
    rotate: "rotate-[1.5deg]"
  },
  {
    bg: "bg-amber-50/95 hover:bg-amber-50",
    border: "border-amber-300/80 hover:border-amber-400",
    text: "text-amber-900",
    descText: "text-amber-800/90",
    badgeBg: "bg-amber-100 text-amber-800",
    shadow: "shadow-[3px_3px_0px_rgba(245,158,11,0.18)] hover:shadow-[6px_6px_0px_rgba(245,158,11,0.25)]",
    rotate: "rotate-[-1.2deg]"
  },
  {
    bg: "bg-purple-50/95 hover:bg-purple-50",
    border: "border-purple-300/80 hover:border-purple-400",
    text: "text-purple-900",
    descText: "text-purple-800/90",
    badgeBg: "bg-purple-100 text-purple-800",
    shadow: "shadow-[3px_3px_0px_rgba(168,85,247,0.18)] hover:shadow-[6px_6px_0px_rgba(168,85,247,0.25)]",
    rotate: "rotate-[0.8deg]"
  }
];

const navItems = ["About", "Projects", "Experience", "Blog", "Socials"];

const links: [string, string, string][] = [
  ['GitHub', 'https://github.com/Keshav-poha', '<path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z"/>'],
  ['LinkedIn', 'https://www.linkedin.com/in/keshav-ku', '<path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6.5H2v11h3V10ZM9 10H6v11h3v-6c0-1.66 1.34-3 3-3s3 .99 3 3v6h3v-6.5C18 10.57 15.43 8 12.5 8 10.98 8 9.66 8.71 9 9.76V10Z"/>'],
  ['Instagram', 'https://instagram.com/keshav.xyz/', '<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7ZM18 6.25a1.25 1.25 0 1 1 0 2.501A1.25 1.25 0 0 1 18 6.25Z"/>'],
  ['Email', 'mailto:keshav.poha@gmail.com', '<path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l9 5.6 9-5.6V7H3Zm18 10V9.25l-9 5.6-9-5.6V17h18Z"/>'],
];

const skills = [
  { name: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Golang", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { name: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "React Native", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Angular", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "Tailwind", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Django", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "Node", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Mongo", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Postgres", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Azure", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "AWS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
];

export default function Home() {
  const planeRef = useRef<HTMLImageElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("About");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [scale, setScale] = useState(1);
  const [scaleLeft, setScaleLeft] = useState(0);
  const [scaleTop, setScaleTop] = useState(0);
  const [navScale, setNavScale] = useState(1.2);
  const [navLeft, setNavLeft] = useState(0);
  const [secScale, setSecScale] = useState(1.0);
  const [secLeft, setSecLeft] = useState(0);
  const activeSectionRef = useRef("About");
  const scrollXRef = useRef(0);
  const velocityRef = useRef(0);
  const targetXRef = useRef<number | null>(null);
  const scrollRafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
      setScale(s);
      setScaleLeft(0);
      setScaleTop(window.innerHeight - DESIGN_H * s);

      const ns = 1.2 * Math.min(1, window.innerWidth / 850, window.innerHeight / 850);
      setNavScale(ns);
      setNavLeft(window.innerWidth * 0.01);

      const ssRatio = window.innerWidth / DESIGN_W;
      const ss = Math.min(1.0, ssRatio * (1.25 - 0.25 * ssRatio));
      setSecScale(ss);
      setSecLeft(window.innerWidth * 0.10);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch GitHub repos once on mount
  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data: Repo[]) => setRepos(data))
      .catch(() => { });
  }, []);

  const snapTo = (section: string) => {
    const idx = navItems.indexOf(section);
    if (idx < 0) return;
    targetXRef.current = idx * DESIGN_W;
    velocityRef.current = 0;
    activeSectionRef.current = section;
    setActiveSection(section);
  };

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) {
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    let steerRetargetAt = lastTime;
    let speedRetargetAt = lastTime;

    const normalizeAngle = (angle: number) => {
      let normalized = angle;
      while (normalized > Math.PI) {
        normalized -= Math.PI * 2;
      }
      while (normalized < -Math.PI) {
        normalized += Math.PI * 2;
      }
      return normalized;
    };

    const state = {
      x: DESIGN_W * 0.2,
      y: DESIGN_H * 0.7,
      heading: -0.45,
      speed: 165,
      targetSpeed: 165,
      turnRate: 0,
      targetTurnRate: 0,
      swayPhase: Math.random() * Math.PI * 2,
    };

    const pickSteering = () => {
      state.targetTurnRate = (Math.random() * 2 - 1) * 0.75;
      steerRetargetAt = performance.now() + 1600 + Math.random() * 2800;
    };

    const pickSpeed = () => {
      state.targetSpeed = 105 + Math.random() * 125;
      speedRetargetAt = performance.now() + 2200 + Math.random() * 3200;
    };

    const updateFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (now >= steerRetargetAt) {
        pickSteering();
      }

      if (now >= speedRetargetAt) {
        pickSpeed();
      }

      const steerBlend = 1 - Math.exp(-1.5 * dt);
      state.turnRate += (state.targetTurnRate - state.turnRate) * steerBlend;

      const speedBlend = 1 - Math.exp(-1.25 * dt);
      state.speed += (state.targetSpeed - state.speed) * speedBlend;

      const planeWidth = plane.offsetWidth || 220;
      const planeHeight = plane.offsetHeight || 140;
      const maxX = Math.max(0, DESIGN_W - planeWidth);
      const maxY = Math.max(0, DESIGN_H - planeHeight);
      const offscreenMargin = Math.max(120, Math.min(220, planeWidth * 0.9));
      const hardMinX = -offscreenMargin;
      const hardMaxX = maxX + offscreenMargin;
      const hardMinY = -offscreenMargin;
      const hardMaxY = maxY + offscreenMargin;

      const centerX = maxX * 0.5;
      const centerY = maxY * 0.5;
      const centerHeading = Math.atan2(centerY - state.y, centerX - state.x);
      const edgeDistanceX = Math.min(state.x, maxX - state.x);
      const edgeDistanceY = Math.min(state.y, maxY - state.y);
      const edgeDistance = Math.min(edgeDistanceX, edgeDistanceY);
      const safetyBand = Math.max(Math.min(DESIGN_W, DESIGN_H) * 0.18, 80);
      const edgeWeight = Math.max(0, 1 - edgeDistance / safetyBand);

      if (edgeWeight > 0) {
        const centerDelta = normalizeAngle(centerHeading - state.heading);
        state.turnRate += centerDelta * edgeWeight * 1.8 * dt;
      }

      const maxTurnRate = 1.25;
      state.turnRate = Math.max(-maxTurnRate, Math.min(maxTurnRate, state.turnRate));
      state.heading = normalizeAngle(state.heading + state.turnRate * dt);

      const sway = Math.sin(now * 0.0012 + state.swayPhase) * 12;
      const currentSpeed = Math.max(85, Math.min(250, state.speed + sway));

      const vx = Math.cos(state.heading) * currentSpeed;
      const vy = Math.sin(state.heading) * currentSpeed;

      state.x += vx * dt;
      state.y += vy * dt;

      if (!Number.isFinite(state.x) || !Number.isFinite(state.y)) {
        state.x = DESIGN_W * 0.2;
        state.y = DESIGN_H * 0.7;
        state.heading = -0.45;
        state.turnRate = 0;
      }

      const pullX = state.x < 0 ? -state.x : state.x > maxX ? maxX - state.x : 0;
      const pullY = state.y < 0 ? -state.y : state.y > maxY ? maxY - state.y : 0;

      if (pullX !== 0 || pullY !== 0) {
        const returnHeading = Math.atan2(pullY, pullX);
        const returnDelta = normalizeAngle(returnHeading - state.heading);
        state.turnRate += returnDelta * 1.6 * dt;
      }

      if (state.x < hardMinX) {
        state.x = hardMinX;
        state.heading = normalizeAngle(state.heading + 0.12);
      } else if (state.x > hardMaxX) {
        state.x = hardMaxX;
        state.heading = normalizeAngle(state.heading - 0.12);
      }

      if (state.y < hardMinY) {
        state.y = hardMinY;
        state.heading = normalizeAngle(state.heading + 0.12);
      } else if (state.y > hardMaxY) {
        state.y = hardMaxY;
        state.heading = normalizeAngle(state.heading - 0.12);
      }

      const heading = (state.heading * 180) / Math.PI;
      const rotation = heading - 180;

      plane.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${rotation}deg)`;
      rafId = requestAnimationFrame(updateFrame);
    };

    const onResize = () => {
      const planeWidth = plane.offsetWidth || 220;
      const planeHeight = plane.offsetHeight || 140;
      const maxX = Math.max(0, DESIGN_W - planeWidth);
      const maxY = Math.max(0, DESIGN_H - planeHeight);
      const offscreenMargin = Math.max(120, Math.min(220, planeWidth * 0.9));
      state.x = Math.max(-offscreenMargin, Math.min(state.x, maxX + offscreenMargin));
      state.y = Math.max(-offscreenMargin, Math.min(state.y, maxY + offscreenMargin));
      pickSteering();
      pickSpeed();
    };

    pickSteering();
    pickSpeed();
    rafId = requestAnimationFrame(updateFrame);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Horizontal scroll RAF: inertia + snap
  useEffect(() => {
    const FRICTION = 0.86;
    const SNAP_LERP = 0.14;

    const loop = () => {
      const strip = stripRef.current;
      if (strip) {
        const maxX = (navItems.length - 1) * DESIGN_W;

        if (targetXRef.current !== null) {
          const diff = targetXRef.current - scrollXRef.current;
          if (Math.abs(diff) < 0.4) {
            scrollXRef.current = targetXRef.current;
            targetXRef.current = null;
            // Snap complete — confirm active section
            const idx = Math.round(scrollXRef.current / DESIGN_W);
            const settled = navItems[Math.max(0, Math.min(navItems.length - 1, idx))];
            if (settled !== activeSectionRef.current) {
              activeSectionRef.current = settled;
              setActiveSection(settled);
            }
          } else {
            scrollXRef.current += diff * SNAP_LERP;
          }
        } else {
          scrollXRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
          scrollXRef.current = Math.max(0, Math.min(maxX, scrollXRef.current));
          if (Math.abs(velocityRef.current) < 0.4) {
            velocityRef.current = 0;
            const idx = Math.round(scrollXRef.current / DESIGN_W);
            const snapIdx = Math.max(0, Math.min(navItems.length - 1, idx));
            targetXRef.current = snapIdx * DESIGN_W;
            // Update active section when wheel scroll settles
            const settled = navItems[snapIdx];
            if (settled !== activeSectionRef.current) {
              activeSectionRef.current = settled;
              setActiveSection(settled);
            }
          }
        }

        strip.style.transform = `translateX(${-scrollXRef.current}px)`;
      }
      scrollRafRef.current = requestAnimationFrame(loop);
    };

    scrollRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(scrollRafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel → velocity
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      targetXRef.current = null; // cancel snap so user drives
      velocityRef.current += e.deltaY * 0.9;
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Touch swipe support for horizontal navigation on mobile/tablet devices
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isMoving = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isMoving = true;
        targetXRef.current = null; // cancel snap
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMoving || e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Only navigate horizontally if the horizontal motion is dominant
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) e.preventDefault();
        velocityRef.current += diffX * 0.75;
      }
      startX = currentX;
      startY = currentY;
    };

    const handleTouchEnd = () => {
      isMoving = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "linear-gradient(to bottom, rgba(191,219,254,0.7) 1px, transparent 1px), linear-gradient(to right, rgba(253,164,175,0.85) 2px, transparent 2px)",
        backgroundSize: "100% 2.22vh, 100% 100%",
        backgroundPosition: "0 0, 20vw 0",
      }}
    >
      {/* Paper Airplane — Detached and behind everything */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          left: scaleLeft,
          top: scaleTop,
        }}
      >
        <img
          ref={planeRef}
          src="/plane.webp"
          alt="Paper airplane"
          className="plane-drift absolute left-0 top-0 h-auto opacity-100"
          style={{ width: '19%' }}
        />
      </div>

      <header
        className="absolute z-40 bg-transparent px-4"
        style={{
          width: DESIGN_W,
          transform: `scale(${navScale})`,
          transformOrigin: "top left",
          left: navLeft,
          top: 16,
        }}
      >
        <nav className="flex flex-nowrap items-center justify-start gap-0">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => snapTo(item)}
              className={`${cabinSketch.className} cursor-pointer bg-cover bg-center bg-no-repeat min-w-[140px] px-8 py-6 text-base ${activeSection === item
                ? "text-white [text-shadow:0_0_3px_#fff,0_0_1px_rgba(255,255,255,0.8)]"
                : "text-slate-700"
                }`}
              style={{
                backgroundImage: activeSection === item
                  ? "url('/black_cloud.webp')"
                  : "url('/cloud.webp')",
              }}
            >
              <span className="relative top-1">{item}</span>
            </button>
          ))}
        </nav>
      </header>


      {/* Sections Wrapper — Detached from main scaling window */}
      <div
        className="pointer-events-none absolute z-10 overflow-hidden"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${secScale})`,
          transformOrigin: "top left",
          left: secLeft,
          top: 100,
        }}
      >
        {/* Horizontal section strip */}
        <div
          ref={stripRef}
          className="pointer-events-none absolute top-0 left-[14%] h-full flex"
          style={{ width: `${navItems.length * DESIGN_W}px`, willChange: "transform" }}
        >
          {navItems.map((section) => (
            <div
              key={section}
              className="pointer-events-none relative flex-none h-full"
              style={{ width: DESIGN_W }}
            >
              {section === "About" ? (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <h1 className="text-6xl md:text-7xl tracking-wider text-green-600">KESHAV</h1>
                  <p className="text-3xl md:text-3xl font-semibold tracking-wide text-green-600 mt-1">
                    NSUT&apos;29 · Information Technology
                  </p>
                  <p className="mt-3 text-3xl md:text-2xl leading-relaxed text-slate-700">
                    I love creating interactive experiences, capturing moments through my lens, and building projects that make a difference.
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-3xl md:text-3xl tracking-wide text-green-600">Skills</h2>
                    <div className="mt-3 flex max-w-[760px] flex-wrap gap-x-2 gap-y-2">
                      {skills.map((logo) => (
                        <div key={logo.name} className="flex w-[84px] md:w-[56px] flex-col items-center text-center">
                          <img src={logo.src} alt={logo.name} title={logo.name} className="sketch-logo h-12 w-12 md:h-7 md:w-7" loading="lazy" />
                          <span className="mt-0.5 text-[16px] md:text-[10px] font-semibold leading-tight text-slate-700">{logo.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : section === "Experience" ? (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <h1 className="text-6xl md:text-7xl tracking-wider text-green-600">Experience</h1>
                  <p className="mt-4 text-3xl md:text-xl leading-relaxed text-slate-600">
                    Check out my full experience on LinkedIn.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/keshav-ku"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto mt-5 inline-flex items-center gap-4 md:gap-3 rounded-none border-b-2 border-green-500 pb-0.5 text-3xl md:text-xl text-green-600 transition-colors hover:text-green-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-10 w-10 md:h-6 md:w-6 flex-none fill-current">
                      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6.5H2v11h3V10ZM9 10H6v11h3v-6c0-1.66 1.34-3 3-3s3 .99 3 3v6h3v-6.5C18 10.57 15.43 8 12.5 8 10.98 8 9.66 8.71 9 9.76V10Z" />
                    </svg>
                    Visit my LinkedIn
                  </a>
                </div>
              ) : section === "Projects" ? (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <div className="flex items-baseline justify-between pr-2">
                    <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">Projects</h1>
                    <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider hidden sm:inline">
                      Pinned Repositories
                    </span>
                  </div>
                  <div
                    className="mt-4 grid grid-cols-3 gap-3 p-1.5 pb-2 pr-3"
                  >
                    {(repos.length > 0 ? repos : FALLBACK_REPOS).map((repo, index) => {
                      const theme = CARD_THEMES[index % CARD_THEMES.length];

                      // Handle cached response schema without languages array
                      const repoLangs = repo.languages && repo.languages.length > 0
                        ? repo.languages
                        : (repo as any).language
                          ? [(repo as any).language]
                          : [];

                      let finalLangs = repoLangs;
                      if (finalLangs.length === 0) {
                        const nameLower = repo.name.toLowerCase();
                        if (nameLower.includes("express") || nameLower.includes("add-on") || nameLower.includes("romanizer")) {
                          finalLangs = ["JavaScript", "HTML", "CSS"];
                        } else if (nameLower.includes("portfolio")) {
                          finalLangs = ["TypeScript", "CSS", "HTML"];
                        } else if (nameLower.includes("dsabuddy")) {
                          finalLangs = ["JavaScript", "HTML", "CSS"];
                        } else if (nameLower.includes("pluck")) {
                          finalLangs = ["TypeScript", "HTML", "CSS"];
                        } else if (nameLower.includes("club")) {
                          finalLangs = ["Go", "Docker", "Shell"];
                        } else {
                          finalLangs = ["TypeScript", "CSS"];
                        }
                      }

                      return (
                        <div
                          key={repo.name}
                          style={{
                            animationDelay: `${index * 80}ms`,
                            animationFillMode: "both",
                          }}
                          className={`slide-up-in pointer-events-auto p-3 rounded-md border-2 border-dashed ${theme.bg} ${theme.border} ${theme.shadow} ${theme.rotate} transition-all duration-300 ease-in-out hover:scale-[1.02] hover:rotate-0 hover:-translate-y-0.5 flex flex-col justify-between min-h-[135px]`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5 w-full">
                              <h2 className="text-[14px] font-bold tracking-wide text-slate-800 leading-snug break-all sm:break-words flex-1" title={repo.name}>
                                {repo.name}
                              </h2>
                              <div className="flex flex-none items-center gap-1">
                                {repo.fork && (
                                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-slate-400 border border-slate-300 px-1 py-0.5 rounded leading-none">
                                    fork
                                  </span>
                                )}
                                {repo.stars > 0 && (
                                  <span className="flex items-center gap-0.5 rounded bg-amber-100/90 border border-amber-200/80 px-1 py-0.5 text-[10px] font-bold text-amber-700 leading-none">
                                    ★{repo.stars}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Render multiple languages as chips */}
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {finalLangs.slice(0, 3).map((lang) => (
                                <span key={lang} className="inline-flex items-center gap-1 rounded bg-white/70 border border-slate-200/50 px-1.5 py-0.5 text-[9px] font-sans font-bold text-slate-600">
                                  <span
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: LANG_COLORS[lang] ?? "#8b949e" }}
                                  />
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-end border-t border-slate-200/40 pt-2 text-[10px] gap-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans font-bold text-green-700 hover:text-green-900 border-b border-dashed border-green-500 hover:border-solid"
                            >
                              code ↗
                            </a>
                            {repo.homepage && (
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans font-bold text-blue-700 hover:text-blue-900 border-b border-dashed border-blue-500 hover:border-solid"
                              >
                                live ↗
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : section === "Socials" ? (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <h1 className="text-6xl md:text-7xl tracking-wider text-green-600">Socials</h1>
                  <div className="mt-6 flex flex-col gap-6 md:gap-4 items-start">
                    {links.map(([label, href, svgPath]) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                      >
                        <svg viewBox="0 0 24 24" className="h-12 w-12 md:h-8 md:w-8 flex-none fill-current" dangerouslySetInnerHTML={{ __html: svgPath }} />
                        <span className="text-4xl md:text-2xl tracking-wide">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : section === "Blog" ? (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <h1 className="text-6xl md:text-7xl tracking-wider text-green-600">My Blogs on</h1>
                  <div className="mt-6 flex flex-col gap-6 md:gap-4 items-start">
                    <a
                      href="https://blog.developer.adobe.com/en/authors/keshav-kumar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                    >
                      <svg viewBox="0 0 24 24" className="h-12 w-12 md:h-8 md:w-8 flex-none fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7zm-6 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                      </svg>
                      <span className="text-4xl md:text-2xl tracking-wide">Adobe Developer Blogs</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/keshav-ku"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                    >
                      <svg viewBox="0 0 24 24" className="h-12 w-12 md:h-8 md:w-8 flex-none fill-current">
                        <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6.5H2v11h3V10ZM9 10H6v11h3v-6c0-1.66 1.34-3 3-3s3 .99 3 3v6h3v-6.5C18 10.57 15.43 8 12.5 8 10.98 8 9.66 8.71 9 9.76V10Z" />
                      </svg>
                      <span className="text-4xl md:text-2xl tracking-wide"> LinkedIn</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className={`${cabinSketch.className} absolute left-[2%] top-[18%] w-[75%] text-left`}>
                  <h1 className="text-6xl md:text-7xl tracking-wider text-green-600">{section}</h1>
                  <p className="mt-4 text-3xl md:text-lg leading-relaxed text-slate-600">
                    Coming soon...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Camera — Detached from scaling window */}
      <div
        className="pointer-events-none absolute z-20"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          left: scaleLeft,
          top: scaleTop,
        }}
      >
        <div
          className={`pointer-events-none absolute right-6 z-20 w-[220px] aspect-square transition-all duration-500 ease-in-out ${activeSection === "Blog" ? "bottom-[40px] translate-x-0 rotate-[-6deg] opacity-100" : "bottom-[40px] translate-x-[260px] rotate-[-6deg] opacity-0"
            }`}
        >
          <img
            src="/camera.webp"
            alt="Camera"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>

      {/* Scroll/Swipe hint — Detached & fixed to bottom-right of viewport */}
      <div className={`${cabinSketch.className} pointer-events-none fixed bottom-6 right-6 z-50 text-slate-500`}>
        {/* Mouse/scroll hint (hidden on touch devices) */}
        <div className="mouse-only-hint flex flex-col items-center gap-1">
          <svg className="scroll-bounce" width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" stroke="currentColor" strokeWidth="2" />
            <rect x="9.5" y="6" width="3" height="7" rx="1.5" fill="currentColor" />
          </svg>
          <span className="text-[11px] tracking-widest sm:text-xs">scroll</span>
        </div>

        {/* Touch/swipe hint (shown only on touch devices) */}
        <div className="touch-only-hint flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-swipe">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-[11px] tracking-widest sm:text-xs">swipe</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-swipe-reverse">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>

      <main
        className="pointer-events-none relative overflow-hidden"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          left: scaleLeft,
          top: scaleTop,
          zIndex: 20,
        }}
      >



        <div
          className="pointer-events-none absolute top-80 z-20 w-[400px] transition-all duration-500 ease-in-out bottom-[-58px]"
        >
          <img
            src="/me.webp"
            alt="Portrait"
            className="h-auto w-full object-contain transition-transform duration-500 ease-in-out"
            style={{ transform: "translateY(0)" }}
          />
        </div>

        {/* Normal glasses — outside strip, always on screen, slides onto portrait except in Projects */}
        <div
          className={`pointer-events-none absolute top-37 left-11 z-30 w-[300px] aspect-[43/62] transition-all duration-500 ease-in-out ${activeSection === "Projects" ? "bottom-[29px] -translate-x-[178px] rotate-90" : "bottom-[-65px] translate-x-0 rotate-0"
            }`}
        >
          <img
            src="/glasses.webp"
            alt="Glasses"
            className="pointer-events-none absolute left-[52.5%] top-[33.8%] h-auto w-[40%] -translate-x-1/2"
          />
        </div>

        {/* Sunglasses — outside strip, always on screen, slides onto portrait in Projects */}
        <div
          className={`pointer-events-none absolute left-12 top-52 z-30 w-[290px] aspect-[43/62] transition-all duration-500 ease-in-out ${activeSection === "Projects" ? "bottom-[-65px] translate-x-0 rotate-0" : "bottom-[29px] -translate-x-[178px] rotate-90"
            }`}
        >
          <img
            src="/sunglasses.webp"
            alt="Sunglasses"
            className="pointer-events-none absolute left-[52.5%] top-[27%] h-auto w-[42%] -translate-x-1/2"
          />
        </div>

        {/* Suit — outside strip, slides onto portrait in Experience */}
        <div
          className={`pointer-events-none absolute left-1.5 top-14 z-30 w-[400px] aspect-[43/62] transition-all duration-500 ease-in-out ${activeSection === "Experience" ? "bottom-[72px] translate-x-0 rotate-0" : "bottom-[29px] -translate-x-[178px] rotate-90"
            }`}
        >
          <img
            src="/suit.webp"
            alt="Suit"
            className="pointer-events-none absolute left-[48.5%] top-[44%] h-auto w-[110%] -translate-x-1/2"
          />
        </div>

      </main>
    </div>
  );
}
