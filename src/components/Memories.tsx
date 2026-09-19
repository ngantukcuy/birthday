import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SafeImage from "./SafeImage";
import { FadeIn } from "./Reveal";
import { birthdayData } from "../data/birthday";

const EASE = [0.22, 1, 0.36, 1] as const;
const TILTS = [-3.5, 2.5, -1.5, 3.5, -2.5, 1.5, -3, 2];

/** "Our Little Memories" — polaroid horizontal scroll + lightbox fullscreen dengan caption. */
export default function Memories() {
  const { memories } = birthdayData;
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setActive(i);
  };
  const close = useCallback(() => {
    setActive(null);
    lastFocus.current?.focus?.();
  }, []);
  const step = useCallback(
    (d: number) => setActive((a) => (a === null ? a : (a + d + memories.length) % memories.length)),
    [memories.length],
  );

  const scrollBy = (d: number) => scroller.current?.scrollBy({ left: d * 300, behavior: reduce ? "auto" : "smooth" });

  return (
    <section
      id="memories"
      aria-label="Our Little Memories"
      className="relative overflow-hidden py-[12svh]"
      style={{ background: "linear-gradient(180deg, #FBF4EA 0%, #FFFAF2 45%, #FBEBE6 100%)" }}
    >
      <div className="section text-center">
        <FadeIn>
          <h2 className="heading">Our Little Memories</h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic text-cocoa-soft sm:text-xl">
            Some moments are too beautiful to be forgotten.
          </p>
        </FadeIn>
      </div>

      <div className="relative mt-10">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-14 pt-8 sm:gap-8 sm:px-[max(2.5rem,calc((100vw_-_64rem)/2))]"
          style={{ scrollPaddingLeft: "1.5rem" }}
          tabIndex={0}
          aria-label="Galeri foto, geser ke samping"
        >
          {memories.map((m, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => open(i)}
              aria-label={`Buka foto: ${m.caption}`}
              className="group relative w-[68vw] max-w-[290px] shrink-0 snap-start bg-ivory p-3 pb-4 text-left shadow-soft outline-offset-4 sm:w-[270px]"
              style={{ rotate: TILTS[i % TILTS.length], borderRadius: 6 }}
              initial={reduce ? false : { opacity: 0, y: 50, rotate: TILTS[i % TILTS.length] * 3, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, rotate: TILTS[i % TILTS.length], filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25, root: scroller }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: EASE }}
              whileHover={reduce ? undefined : { y: -8, rotate: 0, scale: 1.03 }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-blush">
                <SafeImage
                  src={m.image}
                  alt={m.alt ?? m.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <p className="mt-3 min-h-[2.6rem] px-1 font-serif text-[1.05rem] italic leading-snug text-cocoa-soft">
                {m.caption}
              </p>
            </motion.button>
          ))}
          <div aria-hidden className="w-2 shrink-0 sm:w-8" />
        </div>

        <div className="section mt-2 flex items-center justify-center gap-4">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Foto sebelumnya" className="btn-ghost hidden !min-h-[44px] !px-3 sm:inline-flex">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <p className="text-xs tracking-wide text-cocoa-soft/80 sm:hidden">Geser ke samping →</p>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Foto berikutnya" className="btn-ghost hidden !min-h-[44px] !px-3 sm:inline-flex">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <Lightbox active={active} onClose={close} onStep={step} />
    </section>
  );
}

function Lightbox({
  active,
  onClose,
  onStep,
}: {
  active: number | null;
  onClose: () => void;
  onStep: (d: number) => void;
}) {
  const { memories } = birthdayData;
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose, onStep]);

  const m = active === null ? null : memories[active];

  return (
    <AnimatePresence>
      {m && active !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={m.caption}
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-night/92 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory transition hover:bg-ivory/20"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>

          <motion.figure
            key={active}
            className="flex max-h-[82svh] w-full max-w-md flex-col items-center"
            initial={reduce ? false : { opacity: 0, scale: 0.86, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) onStep(1);
              else if (info.offset.x > 70) onStep(-1);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-xl bg-ivory p-2 shadow-2xl sm:p-3">
              <SafeImage
                src={m.image}
                alt={m.alt ?? m.caption}
                eager
                className="max-h-[62svh] w-auto max-w-full rounded-md object-contain"
              />
            </div>
            <figcaption className="mt-5 px-2 text-center font-serif text-[clamp(1.25rem,5vw,1.7rem)] italic text-blush">
              {m.caption}
            </figcaption>
            <p className="mt-2 text-xs tracking-wide text-ivory/50">
              {active + 1} / {memories.length}
            </p>
          </motion.figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition hover:bg-ivory/20 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            aria-label="Foto berikutnya"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition hover:bg-ivory/20 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
