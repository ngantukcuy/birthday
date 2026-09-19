import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Kursor hati kecil — hanya untuk perangkat dengan mouse; otomatis mati di HP/tablet. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      root.classList.add("heart-cursor");
      const t = e.target as Element | null;
      setActive(!!t?.closest("a, button, [role='button'], [data-cursor]"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      root.classList.remove("heart-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[500]"
    >
      <motion.svg
        viewBox="0 0 24 24"
        animate={{ scale: active ? 1.7 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="-ml-2.5 -mt-2 h-5 w-5 drop-shadow-[0_0_6px_rgba(201,138,147,0.7)]"
      >
        <path
          d="M12 21s-7.5-4.6-9.7-9.2C.6 8.3 2.6 4.5 6.2 4.5c2 0 3.7 1 5.8 3.3 2.1-2.3 3.8-3.3 5.8-3.3 3.6 0 5.6 3.8 3.9 7.3C19.5 16.4 12 21 12 21z"
          fill="#C98A93"
          stroke="#FFFAF2"
          strokeWidth="1.2"
        />
      </motion.svg>
    </motion.div>
  );
}
