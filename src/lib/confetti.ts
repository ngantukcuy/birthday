import { drawHeart } from "./draw";

/**
 * Confetti + hujan hati ringan berbasis canvas (tanpa library tambahan).
 * Membuat satu canvas fullscreen sementara, lalu menghapusnya saat selesai.
 */
type Kind = "rect" | "circle" | "heart";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  kind: Kind;
  life: number;
  max: number;
  wobble: number;
  wobbleSpeed: number;
  drag: number;
}

const COLORS = ["#C98A93", "#F6D9DB", "#C9A45C", "#E4CB94", "#FFFAF2", "#A8626E", "#E9B7BD"];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let parts: P[] = [];
let raf = 0;
let last = 0;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "300",
  });
  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx = canvas.getContext("2d");
  ctx?.scale(dpr, dpr);
}

function cleanup() {
  cancelAnimationFrame(raf);
  raf = 0;
  canvas?.remove();
  canvas = null;
  ctx = null;
  parts = [];
}

function tick(t: number) {
  if (!ctx || !canvas) return;
  const dt = Math.min((t - last) / 16.67, 2.5);
  last = t;
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  parts = parts.filter((p) => p.life < p.max && p.y < h + 60 && p.y > -200);
  for (const p of parts) {
    p.life += dt;
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.g * dt;
    p.wobble += p.wobbleSpeed * dt;
    p.x += (p.vx + Math.sin(p.wobble) * 0.6) * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    const fade = Math.min(1, (p.max - p.life) / 30);
    ctx.globalAlpha = Math.max(0, fade);
    ctx.fillStyle = p.color;
    if (p.kind === "heart") {
      drawHeart(ctx, p.x, p.y, p.size, Math.sin(p.wobble) * 0.3);
    } else if (p.kind === "circle") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.wobble));
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;

  if (parts.length === 0) {
    cleanup();
    return;
  }
  raf = requestAnimationFrame(tick);
}

function start() {
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
}

function makeConfetti(x: number, y: number, angle: number, spread: number, speed: number): P {
  const a = angle + rand(-spread, spread);
  const s = rand(speed * 0.5, speed);
  const kind: Kind = Math.random() < 0.18 ? "heart" : Math.random() < 0.3 ? "circle" : "rect";
  return {
    x,
    y,
    vx: Math.cos(a) * s,
    vy: Math.sin(a) * s,
    g: 0.22,
    size: kind === "heart" ? rand(10, 18) : rand(6, 11),
    rot: rand(0, 6),
    vr: rand(-0.2, 0.2),
    color: pick(COLORS),
    kind,
    life: 0,
    max: rand(110, 190),
    wobble: rand(0, 6),
    wobbleSpeed: rand(0.08, 0.2),
    drag: 0.985,
  };
}

/** Ledakan confetti dari satu titik (default: tengah layar, sedikit di bawah). */
export function fireConfetti(opts?: { x?: number; y?: number; count?: number }) {
  if (typeof window === "undefined") return;
  ensureCanvas();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const x = opts?.x ?? w / 2;
  const y = opts?.y ?? h * 0.62;
  const base = opts?.count ?? (w < 640 ? 90 : 150);
  const count = reduced() ? Math.round(base * 0.25) : base;
  for (let i = 0; i < count; i++) parts.push(makeConfetti(x, y, -Math.PI / 2, 1.1, 15));
  start();
}

/** Hujan confetti dari atas layar. */
export function fireConfettiRain(duration = 2200) {
  if (typeof window === "undefined") return;
  ensureCanvas();
  const w = window.innerWidth;
  const end = performance.now() + (reduced() ? duration / 3 : duration);
  const step = () => {
    if (performance.now() > end) return;
    const n = w < 640 ? 3 : 5;
    for (let i = 0; i < n; i++) {
      const p = makeConfetti(rand(0, w), -20, Math.PI / 2, 0.5, 3.5);
      p.g = 0.06;
      p.max = 320;
      parts.push(p);
    }
    start();
    setTimeout(step, 60);
  };
  step();
}

/** Hati naik memenuhi layar dari bawah. */
export function fireHearts(duration = 1800) {
  if (typeof window === "undefined") return;
  ensureCanvas();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const end = performance.now() + (reduced() ? duration / 3 : duration);
  const step = () => {
    if (performance.now() > end) return;
    const n = w < 640 ? 2 : 4;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: rand(0, w),
        y: h + 30,
        vx: rand(-0.4, 0.4),
        vy: rand(-6.5, -3),
        g: -0.005,
        size: rand(14, 34),
        rot: 0,
        vr: 0,
        color: pick(["#C98A93", "#E9B7BD", "#F6D9DB", "#A8626E", "#E4CB94"]),
        kind: "heart",
        life: 0,
        max: rand(150, 260),
        wobble: rand(0, 6),
        wobbleSpeed: rand(0.05, 0.12),
        drag: 0.995,
      });
    }
    start();
    setTimeout(step, 50);
  };
  step();
}

/** Kombinasi besar untuk final surprise. */
export function fireGrandFinale() {
  fireConfetti({ x: window.innerWidth * 0.2, y: window.innerHeight * 0.75 });
  fireConfetti({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.75 });
  setTimeout(() => fireConfetti(), 350);
  fireHearts(2600);
  setTimeout(() => fireConfettiRain(2600), 500);
}
