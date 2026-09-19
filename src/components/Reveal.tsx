import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface WordProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
}

/** Teks muncul kata demi kata: fade + blur → tajam + naik sedikit. Baris baru dengan "\n". */
export function WordReveal({ text, className = "", delay = 0, stagger = 0.07, amount = 0.7, as = "p" }: WordProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: EASE } },
  };

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const lines = text.split("\n");
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((w, wi) => (
            <motion.span key={wi} variants={word} className="inline-block whitespace-pre">
              {w + " "}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

interface FadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}

/** Muncul halus saat masuk viewport (dipakai hemat, hanya di tempat yang perlu). */
export function FadeIn({ children, className = "", delay = 0, y = 24, amount = 0.3 }: FadeProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export { EASE };
