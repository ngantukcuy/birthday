import { motion, useScroll, useSpring } from "framer-motion";

/** Progress bar tipis di atas halaman berdasarkan posisi scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-rose via-gold to-rose-deep"
    />
  );
}
