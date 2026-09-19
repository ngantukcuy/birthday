import { FadeIn, WordReveal } from "./Reveal";
import { birthdayData } from "../data/birthday";

/** "Let me tell you something..." — teks muncul bertahap seperti bagian dari sebuah surat. */
export default function Story() {
  const { story } = birthdayData;

  return (
    <section
      id="story"
      aria-label="Let me tell you something"
      className="grain relative overflow-hidden py-[16svh]"
      style={{
        background:
          "linear-gradient(180deg, #FBF4EA 0%, #EBD3C7 16%, #DDBBAB 50%, #E6CCBF 84%, #FBF4EA 100%)",
      }}
    >
      <div className="section flex flex-col items-center text-center">
        <FadeIn>
          <p className="font-serif text-lg italic text-cocoa-soft sm:text-xl">Let me tell you something...</p>
        </FadeIn>

        <div className="mt-[14svh] flex w-full max-w-2xl flex-col gap-[22svh]">
          {story.map((group, i) => (
            <WordReveal
              key={i}
              text={group.join("\n")}
              stagger={0.085}
              className="font-serif text-[clamp(1.6rem,6.6vw,2.7rem)] font-medium leading-[1.4] text-cocoa"
            />
          ))}
        </div>

        <FadeIn className="mt-[16svh]" delay={0.1}>
          <span aria-hidden className="font-serif text-3xl text-rose-deep">♡</span>
        </FadeIn>
      </div>
    </section>
  );
}
