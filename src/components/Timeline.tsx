import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import SafeImage from "./SafeImage";
import { FadeIn } from "./Reveal";
import { birthdayData } from "../data/birthday";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "Our Story" — timeline vertikal dengan garis yang menyala mengikuti scroll. */
export default function Timeline() {
  const { timeline } = birthdayData;
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 65%", "end 65%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <section
      id="story-timeline"
      aria-label="Our Story"
      className="relative overflow-hidden py-[12svh]"
      style={{ background: "linear-gradient(180deg, #FBEBE6 0%, #FFFAF2 50%, #FBF4EA 100%)" }}
    >
      <div className="section">
        <FadeIn className="text-center">
          <h2 className="heading">Our Story</h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic text-cocoa-soft sm:text-xl">
            Sedikit demi sedikit, sampai jadi sejauh ini.
          </p>
        </FadeIn>

        <div ref={trackRef} className="relative mt-16 sm:mt-20">
          {/* garis dasar */}
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-rose/25 md:left-1/2" />
          {/* garis menyala */}
          <motion.div
            aria-hidden
            style={{ scaleY: reduce ? 1 : fill }}
            className="absolute bottom-0 left-4 top-0 w-[2px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-gold via-rose to-rose-deep shadow-[0_0_14px_3px_rgba(201,138,147,0.55)] md:left-1/2"
          />

          <ol className="flex flex-col gap-16 md:gap-24">
            {timeline.map((item, i) => {
              const right = i % 2 === 1;
              return (
                <li key={i} className="relative pl-12 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
                  {/* titik */}
                  <motion.span
                    aria-hidden
                    className="absolute left-4 top-3 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-gold bg-ivory md:left-1/2"
                    initial={reduce ? false : { scale: 0.4, backgroundColor: "#FFFAF2" }}
                    whileInView={{ scale: 1.15, backgroundColor: "#C98A93" }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ boxShadow: "0 0 0 6px rgba(201,138,147,0.18)" }}
                  />
                  <motion.article
                    className={`${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                    initial={reduce ? false : { opacity: 0, x: right ? 36 : -36, y: 20, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <p className="font-serif text-2xl font-semibold text-gold">{item.date}</p>
                    <div className="mt-3 overflow-hidden rounded-2xl bg-blush shadow-soft">
                      <SafeImage src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                    </div>
                    <h3 className="mt-5 font-serif text-[1.55rem] font-medium leading-tight text-cocoa">{item.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-cocoa-soft">{item.description}</p>
                  </motion.article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
