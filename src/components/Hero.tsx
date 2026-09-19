import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import SafeImage from "./SafeImage";
import { birthdayData, formatBirthday } from "../data/birthday";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Hero: foto utama sebagai centerpiece dengan reveal blur → tajam dan parallax halus. */
export default function Hero() {
  const { name, heroImage, hero, birthday } = birthdayData;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, 0]);

  const dateLabel = formatBirthday(birthday);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Happy Birthday"
      className="grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-16"
      style={{ background: "linear-gradient(180deg, #FFFAF2 0%, #FBEBE6 60%, #FBF4EA 100%)" }}
    >
      <FloatingParticles variant="hearts" density={0.9} />

      <motion.div style={{ opacity: fade }} className="relative z-10 flex flex-col items-center">
        {/* foto + glow */}
        <div className="relative">
          <motion.div
            aria-hidden
            style={{ y: glowY }}
            className="absolute left-1/2 top-1/2 h-[115%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, delay: 0.2 }}
          >
            <div
              className="h-full w-full rounded-full"
              style={{ background: "radial-gradient(circle, rgba(240,170,182,0.7), rgba(228,203,148,0.25) 55%, transparent 72%)" }}
            />
          </motion.div>

          <motion.div style={{ y: imgY }} className="relative">
            {/* bingkai gold tipis, sedikit miring */}
            <motion.div
              aria-hidden
              className="absolute inset-0 -rotate-3 border border-gold/70"
              style={{ borderRadius: "46% 54% 44% 56% / 54% 44% 56% 46%" }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1.04 }}
              transition={{ duration: 1.8, delay: 1.2, ease: EASE }}
            />
            <motion.div
              className="relative overflow-hidden shadow-soft"
              style={{
                borderRadius: "46% 54% 44% 56% / 54% 44% 56% 46%",
                aspectRatio: "4 / 5",
                height: "min(44svh, 400px)",
              }}
              initial={{ opacity: 0, filter: "blur(28px)", scale: 1.12 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 2.2, delay: 0.3, ease: EASE }}
            >
              <SafeImage src={heroImage} alt={`Foto ${name}`} eager className="h-full w-full object-cover" />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 60%, rgba(91,58,46,0.18))" }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* teks */}
        <motion.div style={{ y: textY }} className="mt-9 text-center sm:mt-11">
          <motion.h1
            className="font-display text-[clamp(2.2rem,10vw,4.6rem)] font-medium leading-[1.06] text-cocoa"
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.5, ease: EASE }}
          >
            Happy Birthday,
            <br />
            <span className="break-words text-rose-deep">{name}</span>
          </motion.h1>

          <motion.p
            className="mt-3 font-serif text-[clamp(1.15rem,4.4vw,1.5rem)] italic text-cocoa-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.1 }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-5 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.5, ease: EASE }}
          >
            <span className="rounded-full border border-gold/50 bg-ivory/60 px-4 py-1.5 text-[0.8rem] tracking-wide text-cocoa-soft backdrop-blur">
              {hero.counter}
            </span>
            {dateLabel && (
              <time dateTime={birthday} className="text-xs text-cocoa-soft/70">
                {dateLabel}
              </time>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.button
        type="button"
        onClick={() => document.getElementById("story")?.scrollIntoView()}
        className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-10 mx-auto flex min-h-[48px] w-fit flex-col items-center gap-1 text-xs tracking-wide text-cocoa-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
      >
        Scroll to continue
        <ChevronDown  className="h-4 w-4 animate-bob" />
      </motion.button>
    </section>
  );
}
