import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import { birthdayData } from "../data/birthday";

interface Props {
  onOpen: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Layar pembuka fullscreen: "A Gift For You". Musik BELUM diputar sampai tombol ditekan. */
export default function OpeningScreen({ onOpen }: Props) {
  const { opening, name } = birthdayData;
  const reduce = useReducedMotion();
  const [step, setStep] = useState<0 | 1>(0);

  useEffect(() => {
    const t = window.setTimeout(() => setStep(1), 3400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <motion.section
      aria-label="A Gift For You"
      className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "linear-gradient(165deg, #FFFAF2 0%, #FBE7E3 55%, #F3CDD1 100%)" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <FloatingParticles variant="hearts" density={1.1} tone="light" />

      {/* glow lembut di tengah */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(246,190,198,0.75), rgba(246,190,198,0) 68%)" }}
      />

      {/* hati kecil yang bergerak perlahan */}
      <motion.div
        aria-hidden
        className="relative z-10 mb-8"
        animate={reduce ? undefined : { y: [0, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9 drop-shadow-[0_0_14px_rgba(201,138,147,0.8)]">
          <path
            d="M12 21s-7.5-4.6-9.7-9.2C.6 8.3 2.6 4.5 6.2 4.5c2 0 3.7 1 5.8 3.3 2.1-2.3 3.8-3.3 5.8-3.3 3.6 0 5.6 3.8 3.9 7.3C19.5 16.4 12 21 12 21z"
            fill="#C98A93"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 flex min-h-[220px] max-w-xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.p
              key="intro"
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)", transition: { duration: 0.8 } }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
              className="font-serif text-[clamp(1.6rem,6.4vw,2.6rem)] italic leading-snug text-cocoa"
            >
              {opening.intro}
            </motion.p>
          ) : (
            <motion.div
              key="greet"
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <h1 className="font-serif text-[clamp(1.4rem,5vw,2rem)] font-medium text-cocoa-soft">
                {opening.greetingPrefix}
              </h1>
              <p className="mt-1 break-words font-display text-[clamp(2.6rem,12vw,5rem)] font-medium leading-[1.05] text-rose-deep">
                {name} <span className="text-rose">♡</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-6 flex h-[110px] flex-col items-center">
        {step === 1 && (
          <>
            <motion.button
              type="button"
              onClick={onOpen}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
              className="btn-gift"
            >
              {opening.button}
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="mt-5 text-xs tracking-wide text-cocoa-soft/80"
            >
              {opening.soundNote}
            </motion.p>
          </>
        )}
      </div>
    </motion.section>
  );
}
