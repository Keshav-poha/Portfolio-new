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
  language: string | null;
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
};

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
  const activeSectionRef = useRef("About");
  const scrollXRef = useRef(0);
  const velocityRef = useRef(0);
  const targetXRef = useRef<number | null>(null);
  const scrollRafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
      setScale(s);
      setScaleLeft((window.innerWidth - DESIGN_W * s) / 2);
      setScaleTop((window.innerHeight - DESIGN_H * s) / 2);
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
      .catch(() => {});
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
    <main
      className="relative overflow-hidden"
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "absolute",
        left: scaleLeft,
        top: scaleTop,
      }}
    >
      <header className="absolute left-0 top-0 z-30 w-full bg-transparent px-4 py-3 sm:px-6 sm:py-4">
        <nav className="flex flex-wrap items-center justify-start gap-0 sm:gap-0">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => snapTo(item)}
              className={`${cabinSketch.className} cursor-pointer bg-cover bg-center bg-no-repeat min-w-[120px] px-6 py-5 text-sm sm:min-w-[140px] sm:px-8 sm:py-6 sm:text-base ${
                activeSection === item
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

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          ref={planeRef}
          src="/plane.webp"
          alt="Paper airplane"
          className="plane-drift absolute left-0 top-0 h-auto opacity-100"
          style={{ width: '19%' }}
        />
      </div>

      {/* Horizontal section strip */}
      <div
        ref={stripRef}
        className="pointer-events-none absolute top-0 left-0 h-full flex z-20"
        style={{ width: `${navItems.length * DESIGN_W}px`, willChange: "transform" }}
      >
        {navItems.map((section) => (
          <div
            key={section}
            className="pointer-events-none relative flex-none h-full"
            style={{ width: DESIGN_W }}
          >
            {section === "About" ? (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[34%] w-[56%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 sm:text-6xl md:text-7xl">KESHAV</h1>
                <p className="text-lg font-semibold tracking-wide text-green-600 sm:text-2xl md:text-3xl">
                  NSUT&apos;29 · Information Technology
                </p>
                <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg md:text-2xl">
                  I love creating interactive experiences, capturing moments through my lens, and building projects that make a difference.
                </p>
                <div className="mt-4 sm:mt-6">
                  <h2 className="text-xl tracking-wide text-green-600 sm:text-2xl md:text-3xl">Skills</h2>
                  <div className="mt-3 flex max-w-[760px] flex-wrap gap-x-2 gap-y-2">
                    {skills.map((logo) => (
                      <div key={logo.name} className="flex w-[52px] flex-col items-center text-center sm:w-[56px]">
                        <img src={logo.src} alt={logo.name} title={logo.name} className="sketch-logo h-6 w-6 sm:h-7 sm:w-7" loading="lazy" />
                        <span className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-700 sm:text-[10px]">{logo.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : section === "Experience" ? (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[22%] w-[56%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">Experience</h1>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Check out my full experience on LinkedIn.
                </p>
                <a
                  href="https://www.linkedin.com/in/keshav-ku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto mt-5 inline-flex items-center gap-3 rounded-none border-b-2 border-green-500 pb-0.5 text-xl text-green-600 transition-colors hover:text-green-800"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 flex-none fill-current">
                    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6.5H2v11h3V10ZM9 10H6v11h3v-6c0-1.66 1.34-3 3-3s3 .99 3 3v6h3v-6.5C18 10.57 15.43 8 12.5 8 10.98 8 9.66 8.71 9 9.76V10Z"/>
                  </svg>
                  Visit my LinkedIn
                </a>
              </div>
            ) : section === "Projects" ? (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[14%] w-[58%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">Projects</h1>
                <div className="mt-3 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 520 }}>
                  {repos.length === 0 ? (
                    <p className="text-slate-400">Loading...</p>
                  ) : (
                    repos.map((repo) => (
                      <div key={repo.name} className="border-l-4 border-green-400 pl-3 pr-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto text-lg font-bold text-green-700 hover:underline"
                          >
                            {repo.name}
                          </a>
                          {repo.fork && (
                            <span className="text-[10px] text-slate-400 border border-slate-300 px-1 rounded">fork</span>
                          )}
                          {repo.homepage && (
                            <a
                              href={repo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pointer-events-auto text-xs text-green-500 hover:underline ml-auto pr-1"
                            >
                              live ↗
                            </a>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm leading-snug text-slate-600 mt-0.5">{repo.description}</p>
                        )}
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#8b949e" }}
                              />
                              {repo.language}
                            </span>
                          )}
                          {repo.stars > 0 && (
                            <span>★ {repo.stars}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : section === "Socials" ? (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[34%] w-[56%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">Socials</h1>
                <div className="mt-6 flex flex-col gap-4">
                  {links.map(([label, href, svgPath]) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                    >
                      <svg viewBox="0 0 24 24" className="h-8 w-8 flex-none fill-current" dangerouslySetInnerHTML={{ __html: svgPath }} />
                      <span className="text-2xl tracking-wide">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : section === "Blog" ? (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[34%] w-[56%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">My Blogs on</h1>
                <div className="mt-6 flex flex-col gap-4">
                  <a
                    href="https://blog.developer.adobe.com/en/authors/keshav-kumar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8 flex-none fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7zm-6 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
                    </svg>
                    <span className="text-2xl tracking-wide">Adobe Developer Blogs</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/keshav-ku"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto flex items-center gap-4 text-slate-700 transition-colors hover:text-green-600"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8 flex-none fill-current">
                      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5Zm.02 6.5H2v11h3V10ZM9 10H6v11h3v-6c0-1.66 1.34-3 3-3s3 .99 3 3v6h3v-6.5C18 10.57 15.43 8 12.5 8 10.98 8 9.66 8.71 9 9.76V10Z"/>
                    </svg>
                    <span className="text-2xl tracking-wide"> LinkedIn</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className={`${cabinSketch.className} absolute left-[34%] top-[34%] w-[56%] text-left`}>
                <h1 className="text-4xl tracking-wider text-green-600 md:text-7xl">{section}</h1>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Coming soon...
                </p>
              </div>
            )}




          </div>
        ))}
      </div>

      {/* Portrait — outside strip, swaps on section change with smooth transition */}
      <div
        className={`pointer-events-none absolute left-3 z-10 w-[360px] transition-all duration-500 ease-in-out ${
          activeSection === "Projects" ? "bottom-[-112px]" : "bottom-[-58px]"
        }`}
      >
        <img
          src={activeSection === "Projects" ? "/smirk.webp" : "/me.webp"}
          alt="Portrait"
          className="h-auto w-full object-contain transition-transform duration-500 ease-in-out"
          style={{ transform: activeSection === "Projects" ? "translateY(8px)" : "translateY(0)" }}
        />
      </div>

      {/* Normal glasses — outside strip, always on screen, slides onto portrait except in Projects */}
      <div
        className={`pointer-events-none absolute left-3 z-20 w-[360px] aspect-[43/62] transition-all duration-500 ease-in-out ${
          activeSection === "Projects" ? "bottom-[29px] -translate-x-[178px] rotate-90" : "bottom-[-65px] translate-x-0 rotate-0"
        }`}
      >
        <img
          src="/glasses.webp"
          alt="Glasses"
          className="pointer-events-none absolute left-[50.5%] top-[19%] h-auto w-[49%] -translate-x-1/2"
        />
      </div>

      {/* Sunglasses — outside strip, always on screen, slides onto portrait in Projects */}
      <div
        className={`pointer-events-none absolute left-3 z-20 w-[360px] aspect-[43/62] transition-all duration-500 ease-in-out ${
          activeSection === "Projects" ? "bottom-[-65px] translate-x-0 rotate-0" : "bottom-[29px] -translate-x-[178px] rotate-90"
        }`}
      >
        <img
          src="/sunglasses.webp"
          alt="Sunglasses"
          className="pointer-events-none absolute left-[50.5%] top-[19%] h-auto w-[49%] -translate-x-1/2"
        />
      </div>

      {/* Suit — outside strip, slides onto portrait in Experience */}
      <div
        className={`pointer-events-none absolute left-3 z-20 w-[360px] aspect-[43/62] transition-all duration-500 ease-in-out ${
          activeSection === "Experience" ? "bottom-[72px] translate-x-0 rotate-0" : "bottom-[29px] -translate-x-[178px] rotate-90"
        }`}
      >
        <img
          src="/suit.webp"
          alt="Suit"
          className="pointer-events-none absolute left-[50%] top-[40%] h-auto w-[120%] -translate-x-1/2"
        />
      </div>

      {/* Camera — outside strip, slides in on Blog */}
      <div
        className={`pointer-events-none absolute right-6 z-20 w-[220px] aspect-square transition-all duration-500 ease-in-out ${
          activeSection === "Blog" ? "bottom-[40px] translate-x-0 rotate-[-6deg] opacity-100" : "bottom-[40px] translate-x-[260px] rotate-[-6deg] opacity-0"
        }`}
      >
        <img
          src="/camera.webp"
          alt="Camera"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Scroll hint — fixed, outside strip */}
      <div className={`${cabinSketch.className} absolute bottom-6 right-5 z-30 flex flex-col items-center gap-1 text-slate-500`}>
        <svg className="scroll-bounce" width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" stroke="currentColor" strokeWidth="2"/>
          <rect x="9.5" y="6" width="3" height="7" rx="1.5" fill="currentColor"/>
        </svg>
        <span className="text-[11px] tracking-widest sm:text-xs">scroll</span>
      </div>
    </main>
    </div>
  );
}
