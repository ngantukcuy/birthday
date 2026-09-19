import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { audio } from "../lib/audio";

/** Tombol musik melayang (pojok kanan bawah) + visualizer mini saat musik aktif. */
export default function MusicPlayer() {
  const { playing, available } = useSyncExternalStore(audio.subscribe, audio.getSnapshot, audio.getSnapshot);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed right-4 z-[280]"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={() => audio.toggle()}
        disabled={!available}
        aria-label={!available ? "Musik tidak tersedia" : playing ? "Jeda musik" : "Putar musik"}
        aria-pressed={playing}
        title={!available ? "File musik belum ditemukan (public/music/birthday.mp3)" : undefined}
        className="group flex h-12 items-center gap-2.5 rounded-full border border-white/50 bg-ivory/70 pl-3.5 pr-4 text-rose-deep shadow-soft backdrop-blur-md transition hover:bg-ivory disabled:opacity-50"
      >
        {playing ? <Pause className="h-4 w-4 fill-current" aria-hidden /> : <Play className="h-4 w-4 fill-current" aria-hidden />}
        <span aria-hidden className="flex h-4 items-end gap-[3px]">
          {[0, 0.25, 0.5, 0.15].map((d, i) => (
            <span
              key={i}
              className={`block h-full w-[3px] origin-bottom rounded-full bg-gradient-to-t from-rose to-gold ${playing ? "animate-bar" : ""}`}
              style={{ animationDelay: `${d}s`, transform: playing ? undefined : "scaleY(0.25)" }}
            />
          ))}
        </span>
      </button>
    </motion.div>
  );
}
