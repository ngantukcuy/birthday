import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import { FadeIn } from "./Reveal";
import { birthdayData } from "../data/birthday";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "My Wishes For You" — langit malam penuh bintang, kartu muncul satu per satu saat scroll. */
export default function Wishes() {
  const { wishes } = birthdayData;
  const reduce = useReducedMotion();

  return (
    <section
      id="wishes"
      aria-label="My Wishes For You"
      className="grain grain-dark relative overflow-hidden py-[14svh]"
      style={{
        background:
          "linear-gradient(180deg, #E9BFC0 0%, #8A5560 5%, #4A2B30 14%, #2A1719 32%, #2A1719 100%)",
      }}
    >
      <FloatingParticles variant="stars" tone="dark" density={1.7} />

      <div className="section relative z-10 pt-[8svh]">
        <FadeIn className="text-center">
          <h2 className="heading !text-ivory">My Wishes For You</h2>
        </FadeIn>

        <ul className="mx-auto mt-14 flex max-w-xl flex-col gap-5 sm:gap-6">
          {wishes.map((w, i) => (
            <motion.li
              key={i}
              className="relative rounded-3xl border border-white/15 bg-white/[0.06] px-6 py-7 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-10"
              initial={reduce ? false : { opacity: 0, y: 50, scale: 0.96, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <Sparkles aria-hidden className="mx-auto mb-3 h-4 w-4 text-gold-soft" />
              <p className="font-serif text-[clamp(1.35rem,5.4vw,1.85rem)] italic leading-snug text-ivory">{w}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
