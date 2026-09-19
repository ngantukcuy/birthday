import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { WordReveal } from "./Reveal";
import { audio } from "../lib/audio";
import { fireConfetti, fireHearts } from "../lib/confetti";
import { birthdayData } from "../data/birthday";

/** Mini interactive surprise: "Tap to reveal ♡" → confetti, hati memenuhi layar, kartu terbuka. */
export default function Surprise() {
  const { surprise } = birthdayData;
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const reveal = (e: React.MouseEvent<HTMLButtonElement>) => {
    fireConfetti({ x: e.clientX || undefined, y: e.clientY || undefined });
    fireHearts(2000);
    audio.chime();
    setRevealed(true);
  };

  return (
    <section
      id="surprise"
      aria-label="A small surprise"
      className="grain relative flex min-h-[85svh] items-center justify-center overflow-hidden py-[10svh]"
      style={{ background: "linear-gradient(180deg, #F8D9DB 0%, #FFFAF2 40%, #FBEBE6 100%)" }}
    >
      <div className="section flex flex-col items-center text-center" style={{ perspective: 1000 }}>
        <WordReveal
          text={surprise.lead}
          className="font-serif text-[clamp(1.8rem,7.4vw,3rem)] font-medium leading-tight text-cocoa"
        />

        <div className="mt-10 flex min-h-[260px] w-full items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.button
                key="btn"
                type="button"
                onClick={reveal}
                className="btn-gift"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {surprise.button}
              </motion.button>
            ) : (
              <motion.div
                key="card"
                className="relative w-full max-w-md origin-top rounded-[28px] border border-white/80 bg-ivory px-7 py-12 shadow-glow sm:px-12"
                initial={reduce ? false : { opacity: 0, rotateX: -85, scale: 0.85 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.25 }}
              >
                <motion.div
                  initial={reduce ? false : { scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.9, stiffness: 200, damping: 12 }}
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush text-rose-deep"
                >
                  <Heart aria-hidden className="h-6 w-6 fill-current" />
                </motion.div>
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.1, duration: 1.2 }}
                  className="font-serif text-[clamp(1.5rem,6vw,2.1rem)] font-medium italic leading-snug text-cocoa"
                >
                  {surprise.message}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
