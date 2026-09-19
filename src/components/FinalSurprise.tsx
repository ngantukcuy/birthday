import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import SafeImage from "./SafeImage";
import { audio } from "../lib/audio";
import { fireConfetti, fireGrandFinale } from "../lib/confetti";
import { birthdayData } from "../data/birthday";

const EASE = [0.22, 1, 0.36, 1] as const;

const enterFullscreen = () => {
  try {
    const p = document.documentElement.requestFullscreen?.();
    p?.catch(() => {});
  } catch {
    /* tidak didukung (mis. iOS Safari): overlay tetap menutupi layar */
  }
};
const leaveFullscreen = () => {
  try {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  } catch {
    /* abaikan */
  }
};

interface Props {
  onRestart: () => void;
}

/**
 * Final Surprise: suasana berubah jadi cinematic saat mendekati akhir halaman,
 * kalimat muncul satu per satu, lalu tombol "One Last Surprise" membuka layar penuh.
 */
export default function FinalSurprise({ onRestart }: Props) {
  const { finale, musicEmotionalStart } = birthdayData;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  const [line, setLine] = useState(-1);
  const [showBtn, setShowBtn] = useState(false);
  const [overlay, setOverlay] = useState(false);

  // suasana makin gelap & hangat seiring section mendekat
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const atmosphere = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!inView) return;
    const timers: number[] = [];
    let t = 500;
    finale.lines.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLine(i), t));
      if (i < finale.lines.length - 1) t += i === 1 ? 3000 : 2800;
    });
    timers.push(window.setTimeout(() => setShowBtn(true), t + 2200));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, finale.lines]);

  const launch = () => {
    enterFullscreen();
    if (audio.getSnapshot().playing) audio.jumpTo(musicEmotionalStart);
    setOverlay(true);
  };

  const closeOverlay = () => {
    leaveFullscreen();
    setOverlay(false);
  };

  const restart = () => {
    leaveFullscreen();
    setOverlay(false);
    onRestart();
  };

  const last = finale.lines.length - 1;

  return (
    <section
      ref={ref}
      id="finale"
      aria-label="Final surprise"
      className="grain grain-dark relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-[16svh]"
      style={{ background: "linear-gradient(180deg, #2A1719 0%, #1F1012 55%, #160B0D 100%)" }}
    >
      <motion.div aria-hidden style={{ opacity: atmosphere }} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 50% 45%, rgba(201,138,147,0.30), rgba(201,164,92,0.10) 45%, transparent 75%)",
          }}
        />
        <FloatingParticles variant="mixed" tone="dark" density={1.4} />
      </motion.div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="flex min-h-[13rem] w-full items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {line >= 0 && (
              <motion.p
                key={line}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(12px)", scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                exit={line === last ? undefined : { opacity: 0, y: -14, filter: "blur(10px)" }}
                transition={{ duration: 1.3, ease: EASE }}
                className={
                  line === last
                    ? "whitespace-pre-line font-display text-[clamp(2.6rem,12vw,4.8rem)] font-medium leading-[1.1] text-gold-soft"
                    : "whitespace-pre-line font-serif text-[clamp(1.8rem,7.4vw,3rem)] italic leading-snug text-ivory"
                }
              >
                {finale.lines[line]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex h-[72px] items-center">
          {showBtn && (
            <motion.button
              type="button"
              onClick={launch}
              className="btn-gift"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: EASE }}
            >
              {finale.button}
            </motion.button>
          )}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {overlay && <FinaleOverlay onClose={closeOverlay} onRestart={restart} />}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FinaleOverlay({ onClose, onRestart }: { onClose: () => void; onRestart: () => void }) {
  const { finale, heroImage, finalImage, name, sender } = birthdayData;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState(-1);
  const [stage, setStage] = useState<"a" | "b">("a");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(fireGrandFinale, 700));
    let t = 3200;
    finale.closing.forEach((_, i) => {
      timers.push(window.setTimeout(() => setMsg(i), t));
      t += i === 0 ? 5200 : 4200;
    });
    timers.push(
      window.setTimeout(() => {
        setStage("b");
        fireConfetti();
      }, t + 400),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [finale.closing]);

  const photo = (src: string, alt: string, dur: number) => (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: reduce ? 1 : 1.28, filter: reduce ? "blur(0px)" : "blur(34px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        opacity: { duration: 2.2 },
        filter: { duration: 3.2, ease: EASE },
        scale: { duration: dur, ease: "easeOut" },
      }}
    >
      <SafeImage src={src} alt={alt} eager className="h-full w-full object-cover" />
    </motion.div>
  );

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="One last surprise"
      tabIndex={-1}
      className="fixed inset-0 z-[260] overflow-hidden bg-[#160B0D] outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1 }}
    >
      <AnimatePresence>
        {stage === "a" ? (
          <motion.div key="a" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
            {photo(heroImage, `Foto ${name}`, 16)}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(22,11,13,0.45) 0%, rgba(22,11,13,0) 30%, rgba(22,11,13,0.55) 62%, rgba(22,11,13,0.93) 100%)",
              }}
            />
            <FloatingParticles variant="mixed" tone="dark" density={0.9} />
            <div
              className="absolute inset-x-0 bottom-[calc(9svh+env(safe-area-inset-bottom))] flex min-h-[9.5rem] items-end justify-center px-7 text-center"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {msg >= 0 && (
                  <motion.p
                    key={msg}
                    initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                    transition={{ duration: 1.3, ease: EASE }}
                    className={`max-w-lg whitespace-pre-line text-ivory [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] ${
                      msg === 1
                        ? "font-display text-[clamp(1.9rem,8vw,3.2rem)] text-gold-soft"
                        : "font-serif text-[clamp(1.4rem,5.8vw,2.2rem)] italic leading-snug"
                    }`}
                  >
                    {finale.closing[msg]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="b" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
            {photo(finalImage, `Foto ${name}`, 20)}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(22,11,13,0.35) 0%, rgba(22,11,13,0) 30%, rgba(22,11,13,0.6) 58%, rgba(22,11,13,0.95) 100%)",
              }}
            />
            <FloatingParticles variant="hearts" tone="dark" density={0.8} />
            <div className="absolute inset-x-0 bottom-[calc(8svh+env(safe-area-inset-bottom))] flex flex-col items-center px-7 text-center">
              <motion.p
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 1.2, ease: EASE }}
                className="font-serif text-[clamp(1.5rem,6vw,2.3rem)] italic text-ivory [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
              >
                {finale.madeWith}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 2 }}
                className="mt-2 font-display text-2xl text-gold-soft"
              >
                {sender} ♡
              </motion.p>
              <motion.button
                type="button"
                autoFocus
                onClick={onRestart}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3, ease: EASE }}
                className="btn-gift mt-8"
              >
                {finale.restart}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* letterbox sinematik */}
      <motion.div aria-hidden className="absolute inset-x-0 top-0 bg-[#0B0506]" initial={{ height: 0 }} animate={{ height: "5svh" }} transition={{ duration: 1.6, ease: EASE }} />
      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 bg-[#0B0506]" initial={{ height: 0 }} animate={{ height: "5svh" }} transition={{ duration: 1.6, ease: EASE }} />

      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup dan kembali ke halaman"
        className="absolute right-3 top-[calc(5svh+0.5rem)] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-ivory/80 backdrop-blur transition hover:bg-black/40"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
    </motion.div>
  );
}
