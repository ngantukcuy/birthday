import { useEffect, useRef } from "react";
import { drawHeart, drawSparkle } from "../lib/draw";

type Variant = "hearts" | "sparkles" | "stars" | "mixed";
type PType = "heart" | "sparkle" | "glow" | "star";

interface Props {
  variant?: Variant;
  /** kepadatan relatif, 1 = default */
  density?: number;
  /** "light" untuk background cream, "dark" untuk background gelap */
  tone?: "light" | "dark";
  className?: string;
}

interface Pt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  type: PType;
  color: string;
}

const PALETTE = {
  light: {
    heart: ["#C98A93", "#E3A6AE", "#F0C0C6"],
    sparkle: ["#C9A45C", "#E4CB94"],
    glow: ["255,214,190", "246,190,198"],
    star: ["#C9A45C"],
  },
  dark: {
    heart: ["#E9B7BD", "#C98A93", "#F6D9DB"],
    sparkle: ["#E4CB94", "#FFFAF2"],
    glow: ["228,203,148", "233,183,189"],
    star: ["#FFFAF2", "#E4CB94", "#F6D9DB"],
  },
} as const;

const WEIGHTS: Record<Variant, [PType, number][]> = {
  hearts: [["heart", 0.5], ["glow", 0.5]],
  sparkles: [["sparkle", 0.45], ["glow", 0.55]],
  stars: [["star", 0.78], ["sparkle", 0.1], ["glow", 0.12]],
  mixed: [["heart", 0.3], ["sparkle", 0.25], ["glow", 0.3], ["star", 0.15]],
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

function pickType(v: Variant): PType {
  let r = Math.random();
  for (const [t, w] of WEIGHTS[v]) {
    if ((r -= w) <= 0) return t;
  }
  return "glow";
}

function makeGlowSprite(rgb: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.35)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/** Partikel melayang (hati, kilau, bintang) di canvas. Berhenti otomatis saat tidak terlihat. */
export default function FloatingParticles({ variant = "hearts", density = 1, tone = "light", className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pal = PALETTE[tone];
    const sprites = new Map<string, HTMLCanvasElement>();
    pal.glow.forEach((rgb) => sprites.set(rgb, makeGlowSprite(rgb)));

    let w = 0;
    let h = 0;
    let pts: Pt[] = [];
    let raf = 0;
    let visible = false;
    let last = 0;

    const spawn = (initial: boolean): Pt => {
      const type = pickType(variant);
      const isStar = type === "star";
      return {
        x: rand(0, w),
        y: initial ? rand(0, h) : h + 20,
        vx: rand(-0.1, 0.1),
        vy: isStar ? rand(-0.01, -0.03) : -rand(0.12, 0.42),
        size: type === "heart" ? rand(8, 17) : type === "glow" ? rand(14, 38) : type === "sparkle" ? rand(6, 12) : rand(1, 2.4),
        alpha: type === "heart" ? rand(0.25, 0.55) : type === "glow" ? rand(0.25, 0.6) : rand(0.5, 1),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.6, 1.8),
        type,
        color:
          type === "glow"
            ? pick(pal.glow)
            : type === "heart"
              ? pick(pal.heart)
              : type === "sparkle"
                ? pick(pal.sparkle)
                : pick(pal.star),
      };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        let a = p.alpha;
        if (p.type === "star" || p.type === "sparkle") a *= 0.55 + 0.45 * Math.sin(t * 0.001 * p.speed + p.phase);
        ctx.globalAlpha = Math.max(0, a);
        if (p.type === "glow") {
          const s = sprites.get(p.color)!;
          ctx.drawImage(s, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.color;
          if (p.type === "heart") drawHeart(ctx, p.x, p.y, p.size, Math.sin(t * 0.0006 * p.speed + p.phase) * 0.25);
          else if (p.type === "sparkle") drawSparkle(ctx, p.x, p.y, p.size);
          else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (t: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const dt = Math.min((t - last) / 16.67, 3);
      last = t;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += (p.vx + Math.sin(t * 0.0005 * p.speed + p.phase) * 0.12) * dt;
        p.y += p.vy * dt;
        if (p.y < -30) pts[i] = spawn(false);
        if (p.x < -30) p.x = w + 20;
        if (p.x > w + 30) p.x = -20;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const perArea = w < 640 ? 24000 : 16000;
      const count = Math.min(70, Math.round(((w * h) / perArea) * density));
      pts = Array.from({ length: count }, () => spawn(true));
      if (reduce || !visible) draw(performance.now());
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf && !reduce) {
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [variant, density, tone]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
