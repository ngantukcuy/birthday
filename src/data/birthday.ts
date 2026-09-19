/**
 * ============================================================
 *  SATU-SATUNYA FILE YANG PERLU KAMU EDIT
 * ============================================================
 *  Ganti nama, tanggal, foto, cerita, surat, wishes, dan lagu di sini.
 *  Foto & musik ditaruh di folder /public (lihat path di bawah).
 *  Kalau sebuah foto belum ada, website otomatis menampilkan
 *  placeholder lembut, jadi tidak akan pernah terlihat rusak.
 */

export interface Memory {
  image: string;
  caption: string;
  /** teks alt untuk aksesibilitas (opsional) */
  alt?: string;
}

export interface TimelineItem {
  /** tanggal / tahun yang ditampilkan, bebas: "Maret 2024", "2025", dst. */
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface LoveCard {
  title: string;
  description: string;
  /** nama ikon dari lucide-react yang sudah dipetakan di LoveCards.tsx */
  icon: "smile" | "laugh" | "care" | "habits" | "sun" | "heart";
}

export interface BirthdayData {
  name: string;
  sender: string;
  /** tanggal ulang tahun, format YYYY-MM-DD (hanya untuk ditampilkan di hero) */
  birthday: string;
  heroImage: string;
  finalImage: string;

  music: string;
  /** detik ke berapa musik "loncat" saat One Last Surprise (bagian emosional). 0 = tidak loncat */
  musicEmotionalStart: number;

  opening: {
    intro: string;
    greetingPrefix: string;
    button: string;
    soundNote: string;
  };

  hero: {
    subtitle: string;
    counter: string;
  };

  /** setiap item = satu "paragraf" yang muncul saat di-scroll, tiap elemen array = satu baris */
  story: string[][];

  memories: Memory[];
  timeline: TimelineItem[];
  loves: LoveCard[];

  surprise: {
    lead: string;
    button: string;
    message: string;
  };

  letter: {
    greeting: string;
    paragraphs: string[];
    closingLines: string[];
  };

  wishes: string[];

  countdown: {
    title: string;
    subtitle: string;
    /** tanggal & jam target, format ISO lokal: "2026-12-31T00:00:00". Kosongkan "" untuk menyembunyikan section */
    targetDate: string;
    finishedMessage: string;
  };

  finale: {
    lines: string[];
    button: string;
    closing: string[];
    madeWith: string;
    restart: string;
  };
}

const name = "Sayang"; // ← GANTI: nama doi
const sender = "Aku"; // ← GANTI: nama kamu

export const birthdayData: BirthdayData = {
  name,
  sender,
  birthday: "2026-10-05", // ← GANTI: tanggal ulang tahun doi (YYYY-MM-DD)

  // ── Foto utama (taruh file di /public/images/) ──────────────
  heroImage: "/images/hero.jpg",
  finalImage: "/images/final.jpg",

  // ── Musik (taruh file di /public/music/) ────────────────────
  music: "/music/birthday.mp3",
  musicEmotionalStart: 24,

  opening: {
    intro: "Untuk seseorang yang sangat spesial...",
    greetingPrefix: "Happy Birthday,",
    button: "Open Your Gift ✨",
    soundNote: "Turn on your sound for the full experience ♡",
  },

  hero: {
    subtitle: "Today is all about you.",
    counter: "Another beautiful year of you ✨",
  },

  // ── Section "Let me tell you something..." ──────────────────
  story: [
    [
      "Kalau ada satu hal yang aku syukuri,",
      "salah satunya adalah bisa mengenal kamu.",
    ],
    [
      "Karena dari sekian banyak orang di dunia,",
      "entah bagaimana ceritanya,",
      "aku bisa menemukan kamu.",
    ],
    [
      "Kamu mungkin nggak sadar,",
      "tapi hari-hari biasa terasa lebih ringan",
      "sejak ada kamu di dalamnya.",
    ],
    ["Jadi hari ini, izinkan aku", "merayakan kamu sedikit lebih lama."],
  ],

  // ── Galeri "Our Little Memories" (minimal 8, boleh lebih) ───
  memories: [
    { image: "/images/photo-1.jpg", caption: "First time we..." },
    { image: "/images/photo-2.jpg", caption: "One of my favorite days." },
    { image: "/images/photo-3.jpg", caption: "Look at us here ♡" },
    { image: "/images/photo-4.jpg", caption: "Another memory worth keeping." },
    { image: "/images/photo-5.jpg", caption: "You, laughing. My favorite sound." },
    { image: "/images/photo-6.jpg", caption: "Nothing special, and yet everything." },
    { image: "/images/photo-7.jpg", caption: "The day I didn't want to end." },
    { image: "/images/photo-8.jpg", caption: "Us, being us." },
  ],

  // ── "Our Story" ─────────────────────────────────────────────
  timeline: [
    {
      date: "2024",
      title: "Where everything started",
      description: "Hari itu aku belum tahu, kamu akan jadi bagian paling penting dari cerita ini.",
      image: "/images/photo-1.jpg",
    },
    {
      date: "2024",
      title: "The day I realized you were special",
      description: "Ada satu momen kecil yang bikin aku sadar: ini bukan orang biasa buat aku.",
      image: "/images/photo-2.jpg",
    },
    {
      date: "2025",
      title: "More memories, more laughter",
      description: "Makin banyak tawa, makin banyak hari yang ingin aku simpan baik-baik.",
      image: "/images/photo-4.jpg",
    },
    {
      date: "2025",
      title: "Another chapter together",
      description: "Kita belajar, tumbuh, dan tetap memilih satu sama lain.",
      image: "/images/photo-6.jpg",
    },
    {
      date: "2026",
      title: "And here we are...",
      description: "Dan sampai hari ini, aku masih sesyukur itu bisa jalan bareng kamu.",
      image: "/images/photo-8.jpg",
    },
  ],

  // ── "Things I Love About You" ───────────────────────────────
  loves: [
    { icon: "smile", title: "Your smile", description: "Yang bisa bikin hariku langsung membaik." },
    { icon: "laugh", title: "Your laugh", description: "Suara favoritku, dari semua suara." },
    { icon: "care", title: "The way you care", description: "Kamu peduli dengan cara yang tulus dan tenang." },
    { icon: "habits", title: "Your little habits", description: "Hal-hal kecil yang cuma aku yang hafal." },
    { icon: "sun", title: "The way you make ordinary days special", description: "Hari biasa jadi terasa layak dikenang." },
    { icon: "heart", title: "Simply... you", description: "Nggak perlu alasan lain." },
  ],

  // ── Mini surprise ───────────────────────────────────────────
  surprise: {
    lead: "Wait... I have something for you.",
    button: "Tap to reveal ♡",
    message: "You are one of the best things that ever happened to me.",
  },

  // ── Surat ───────────────────────────────────────────────────
  letter: {
    greeting: `Dear ${name},`,
    paragraphs: [
      "Happy birthday to the person who somehow makes my ordinary days feel a little more special.",
      // ↓↓↓ GANTI isi surat di bawah ini dengan kata-katamu sendiri ↓↓↓
      "Aku nggak selalu pandai merangkai kata, tapi hari ini aku ingin bilang: terima kasih sudah hadir, sudah bertahan, dan sudah jadi rumah untuk banyak hal kecil yang berarti buatku.",
      // ↑↑↑ sampai sini ↑↑↑
      "I hope this year brings you everything you've been wishing for.",
      "And whatever happens, I hope you always remember that you are loved, appreciated, and incredibly special.",
    ],
    closingLines: [`Happy Birthday, ${name}.`, "With love,", `${sender} ♡`],
  },

  // ── My Wishes For You ───────────────────────────────────────
  wishes: [
    "May you always have reasons to smile.",
    "May your dreams find their way to you.",
    "May this year be kinder to you.",
    "May you always know how loved you are.",
    "May we create many more memories together.",
  ],

  // ── Countdown ───────────────────────────────────────────────
  countdown: {
    title: "Until our next adventure...",
    subtitle: "Here's to another year of you.",
    targetDate: "2026-12-31T00:00:00", // ← GANTI: tanggal spesial berikutnya ("" = sembunyikan)
    finishedMessage: "It's today. Let's make it a good one ♡",
  },

  // ── Final surprise ──────────────────────────────────────────
  finale: {
    // urutan kalimat yang muncul satu per satu
    lines: [
      "Before you go...",
      "I just want you to know...",
      "Thank you for being you.",
      `Happy Birthday,\n${name} ♡`,
    ],
    button: "One Last Surprise ✨",
    closing: [
      "I hope this little website reminds you\nof how special you are to me.",
      `Happy Birthday, ${name}.`,
      "Here's to many more memories together. ♡",
    ],
    madeWith: "Made with love, just for you.",
    restart: "Start Again ↻",
  },
};

export const formatBirthday = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};
