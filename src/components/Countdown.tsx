import { useEffect, useState } from "react";
import { FadeIn } from "./Reveal";
import { birthdayData } from "../data/birthday";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    finished: ms <= 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Countdown realtime ke tanggal spesial. Ubah tanggal di birthday.ts → countdown.targetDate. */
export default function Countdown() {
  const { countdown } = birthdayData;
  const target = new Date(countdown.targetDate).getTime();
  const valid = countdown.targetDate !== "" && !Number.isNaN(target);
  const [t, setT] = useState(() => (valid ? diff(target) : null));

  useEffect(() => {
    if (!valid) return;
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [valid, target]);

  if (!valid || !t) return null;

  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <section
      id="countdown"
      aria-label="Special date countdown"
      className="relative overflow-hidden pb-[16svh] pt-[6svh]"
      style={{ background: "linear-gradient(180deg, #2A1719 0%, #34201F 60%, #2A1719 100%)" }}
    >
      <div className="section text-center">
        <FadeIn>
          <h2 className="font-serif text-[clamp(1.7rem,6.6vw,2.6rem)] font-medium italic leading-tight text-ivory">
            {countdown.title}
          </h2>
          <p className="mt-3 text-sm text-blush/80">{countdown.subtitle}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="mx-auto mt-10 max-w-lg">
          {t.finished ? (
            <p className="rounded-3xl border border-gold/40 bg-white/[0.05] px-6 py-8 font-serif text-2xl italic text-gold-soft">
              {countdown.finishedMessage}
            </p>
          ) : (
            <div role="timer" aria-label={`${t.days} hari ${t.hours} jam ${t.minutes} menit lagi`} className="grid grid-cols-4 gap-2 sm:gap-4">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="rounded-2xl border border-gold/30 bg-white/[0.05] px-1 py-4 shadow-[0_0_30px_-10px_rgba(201,164,92,0.5)] backdrop-blur sm:py-6"
                >
                  <div className="font-display text-[clamp(1.6rem,8.4vw,2.9rem)] font-medium leading-none tabular-nums text-gold-soft">
                    {pad(u.value)}
                  </div>
                  <div className="mt-2 text-[0.68rem] tracking-wide text-blush/70 sm:text-xs">{u.label}</div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
