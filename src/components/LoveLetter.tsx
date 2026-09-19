import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FadeIn } from "./Reveal";
import { birthdayData } from "../data/birthday";

interface Segment {
  text: string;
  className: string;
}

/** "A Letter For You" — surat digital dengan efek mengetik yang pelan (typewriter). */
export default function LoveLetter() {
  const { letter } = birthdayData;
  const reduce = useReducedMotion();
  const paperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(paperRef, { once: true, amount: 0.35 });

  const segments = useMemo<Segment[]>(
    () => [
      { text: letter.greeting, className: "mb-6 text-rose-deep" },
      ...letter.paragraphs.map((p) => ({ text: p, className: "mb-5" })),
      ...letter.closingLines.map((l, i, arr) => ({
        text: l,
        className: i === 0 ? "mt-8 mb-5 text-rose-deep" : i === arr.length - 1 ? "text-rose-deep" : "",
      })),
    ],
    [letter],
  );
  const total = useMemo(() => segments.reduce((s, x) => s + x.text.length, 0), [segments]);
  const flat = useMemo(() => segments.map((s) => s.text).join(""), [segments]);

  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0); // naik setiap "Read it again"
  const [started, setStarted] = useState(false);
  const done = count >= total;

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setCount(total);
      return;
    }
    let i = 0;
    let t: number;
    setCount(0);
    const tick = () => {
      i += 1;
      setCount(i);
      if (i >= total) return;
      const ch = flat[i - 1];
      const delay = ".!?".includes(ch) ? 380 : ch === "," ? 190 : 44 + Math.random() * 26;
      t = window.setTimeout(tick, delay);
    };
    t = window.setTimeout(tick, 900);
    return () => window.clearTimeout(t);
  }, [started, run, total, flat, reduce]);

  const finish = useCallback(() => setCount(total), [total]);
  const again = () => {
    setCount(0);
    setRun((r) => r + 1);
    paperRef.current?.scrollIntoView({ block: "center" });
  };

  let offset = 0;

  return (
    <section
      id="letter"
      aria-label="A Letter For You"
      className="relative overflow-hidden py-[12svh]"
      style={{ background: "linear-gradient(180deg, #FBEBE6 0%, #F1CFCF 45%, #E9BFC0 100%)" }}
    >
      <div className="section max-w-2xl">
        <FadeIn className="text-center">
          <h2 className="heading">A Letter For You</h2>
        </FadeIn>

        <FadeIn className="mt-10" y={40}>
          <motion.div
            ref={paperRef}
            onClick={!done ? finish : undefined}
            data-cursor={!done ? "" : undefined}
            className="grain relative mx-auto rounded-[10px] px-6 py-9 shadow-[0_30px_60px_-25px_rgba(91,58,46,0.5),0_2px_0_rgba(255,255,255,0.7)_inset] sm:px-12 sm:py-14"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%, #FFFDF7 0%, #FBF3E4 70%, #F3E6D0 100%)",
              rotate: reduce ? 0 : -0.6,
            }}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 rounded-t-[10px] bg-gradient-to-r from-gold-soft via-gold to-gold-soft opacity-70" />

            {/* untuk screen reader: seluruh isi surat langsung terbaca */}
            <div className="sr-only">
              {segments.map((s, i) => (
                <p key={i}>{s.text}</p>
              ))}
            </div>

            <div aria-hidden className="font-serif text-[clamp(1.2rem,4.6vw,1.45rem)] italic leading-[1.75] text-cocoa">
              {segments.map((s, i) => {
                const start = offset;
                offset += s.text.length;
                const n = Math.max(0, Math.min(s.text.length, count - start));
                const caretHere = !done && count >= start && count < start + s.text.length;
                return (
                  <p key={i} className={s.className}>
                    <span>{s.text.slice(0, n)}</span>
                    {caretHere && (
                      <span className="relative inline-block w-0">
                        <span className="absolute left-0 top-[0.2em] h-[1.05em] w-[2px] bg-rose-deep animate-caret" />
                      </span>
                    )}
                    <span className="opacity-0">{s.text.slice(n)}</span>
                  </p>
                );
              })}
            </div>
          </motion.div>
        </FadeIn>

        <div className="mt-8 flex h-14 items-center justify-center">
          {done ? (
            <motion.button
              type="button"
              onClick={again}
              className="btn-ghost"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Read it again ♡
            </motion.button>
          ) : (
            started && <p className="text-xs tracking-wide text-cocoa-soft/80">Ketuk kertas untuk langsung membaca semuanya</p>
          )}
        </div>
      </div>
    </section>
  );
}
