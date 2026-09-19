import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OpeningScreen from "./components/OpeningScreen";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Memories from "./components/Memories";
import Timeline from "./components/Timeline";
import LoveCards from "./components/LoveCards";
import Surprise from "./components/Surprise";
import LoveLetter from "./components/LoveLetter";
import Wishes from "./components/Wishes";
import Countdown from "./components/Countdown";
import FinalSurprise from "./components/FinalSurprise";
import MusicPlayer from "./components/MusicPlayer";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { audio } from "./lib/audio";
import { birthdayData } from "./data/birthday";

audio.init(birthdayData.music);

export default function App() {
  const [opened, setOpened] = useState(false);
  const [run, setRun] = useState(0); // naik setiap "Start Again" supaya semua section mulai dari nol

  // preload foto utama saat layar pembuka tampil, supaya hero langsung muncul mulus
  useEffect(() => {
    const img = new Image();
    img.src = birthdayData.heroImage;
  }, []);

  // saat layar pembuka tampil, kunci scroll
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [opened]);

  const open = useCallback(() => {
    // dipanggil langsung dari klik user → aman untuk autoplay policy (termasuk iOS)
    void audio.play();
    window.scrollTo(0, 0);
    setOpened(true);
  }, []);

  const restart = useCallback(() => {
    audio.reset();
    window.scrollTo({ top: 0, behavior: "auto" });
    setOpened(false);
    setRun((r) => r + 1);
  }, []);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>{!opened && <OpeningScreen key={`open-${run}`} onOpen={open} />}</AnimatePresence>

      {opened && (
        <motion.div
          key={`main-${run}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrollProgress />
          <MusicPlayer />
          <main>
            <Hero />
            <Story />
            <Memories />
            <Timeline />
            <LoveCards />
            <Surprise />
            <LoveLetter />
            <Wishes />
            <Countdown />
            <FinalSurprise onRestart={restart} />
          </main>
        </motion.div>
      )}
    </>
  );
}
