import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Flower2, Heart, HeartHandshake, Laugh, Smile, Sun, type LucideIcon } from "lucide-react";
import { FadeIn } from "./Reveal";
import { birthdayData, type LoveCard } from "../data/birthday";

const ICONS: Record<LoveCard["icon"], LucideIcon> = {
  smile: Smile,
  laugh: Laugh,
  care: HeartHandshake,
  habits: Flower2,
  sun: Sun,
  heart: Heart,
};

/** "Things I Love About You" — kartu interaktif (tilt + glow + hati kecil). Di HP: geser ke samping. */
export default function LoveCards() {
  const { loves } = birthdayData;

  return (
    <section
      id="loves"
      aria-label="Things I Love About You"
      className="relative overflow-hidden py-[12svh]"
      style={{ background: "linear-gradient(180deg, #FBF4EA 0%, #FBE7E3 50%, #F8D9DB 100%)" }}
    >
      <div className="section text-center">
        <FadeIn>
          <h2 className="heading">Things I Love About You</h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic text-cocoa-soft sm:text-xl">
            Sebagian kecil dari daftar yang sangat panjang.
          </p>
        </FadeIn>
      </div>

      <div
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-8 pt-4 sm:mx-auto sm:grid sm:max-w-5xl sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-10 lg:grid-cols-3"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        {loves.map((c, i) => (
          <Card key={i} card={c} index={i} />
        ))}
        <div aria-hidden className="w-2 shrink-0 sm:hidden" />
      </div>
      <p className="mt-2 text-center text-xs tracking-wide text-cocoa-soft/80 sm:hidden">Geser ke samping →</p>
    </section>
  );
}

interface Burst {
  id: number;
  x: number;
  dx: number;
  dy: number;
  size: number;
}

let burstId = 0;

function Card({ card, index }: { card: LoveCard; index: number }) {
  const reduce = useReducedMotion();
  const Icon = ICONS[card.icon];
  const [bursts, setBursts] = useState<Burst[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const spawn = () => {
    const n = 5;
    const items: Burst[] = Array.from({ length: n }, () => ({
      id: ++burstId,
      x: 20 + Math.random() * 60,
      dx: (Math.random() - 0.5) * 60,
      dy: -(60 + Math.random() * 60),
      size: 12 + Math.random() * 10,
    }));
    setBursts((b) => [...b, ...items].slice(-14));
  };

  return (
    <motion.article
      className="relative w-[74vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <motion.div
        data-cursor
        tabIndex={0}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && spawn()}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        onClick={spawn}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && spawn()}
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { scale: 1.03 }}
        className="group relative flex h-full min-h-[210px] cursor-pointer flex-col items-center rounded-[28px] border border-white/70 bg-ivory/75 p-7 text-center shadow-soft backdrop-blur transition-shadow duration-500 hover:shadow-glow"
      >
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blush to-[#f1c3c8] text-rose-deep transition-transform duration-500 group-hover:scale-110">
          <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <h3 className="font-serif text-[1.5rem] font-medium leading-tight text-cocoa">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cocoa-soft">{card.description}</p>

        {/* hati kecil */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
          {bursts.map((b) => (
            <motion.span
              key={b.id}
              className="absolute bottom-10 text-rose"
              style={{ left: `${b.x}%`, fontSize: b.size }}
              initial={{ opacity: 0.95, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: b.dy, x: b.dx, scale: 1.1 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              onAnimationComplete={() => setBursts((all) => all.filter((h) => h.id !== b.id))}
            >
              ♥
            </motion.span>
          ))}
        </span>
      </motion.div>
    </motion.article>
  );
}
