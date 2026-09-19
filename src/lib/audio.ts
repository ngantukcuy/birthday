/**
 * Pengendali musik tunggal (singleton) supaya tombol "Open Your Gift",
 * MusicPlayer, dan Final Surprise mengontrol satu audio yang sama.
 * Musik HANYA mulai setelah ada interaksi user (klik tombol).
 */
type Snapshot = { playing: boolean; available: boolean };

class AudioController {
  private el: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private snap: Snapshot = { playing: false, available: true };
  private listeners = new Set<() => void>();
  private fadeTimer: number | undefined;
  private baseVolume = 0.55;

  subscribe = (l: () => void) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  getSnapshot = () => this.snap;

  private set(next: Partial<Snapshot>) {
    this.snap = { ...this.snap, ...next };
    this.listeners.forEach((l) => l());
  }

  init(src: string) {
    if (this.el) return;
    const el = new Audio(src);
    el.loop = true;
    el.preload = "auto";
    el.volume = this.baseVolume;
    el.addEventListener("play", () => this.set({ playing: true }));
    el.addEventListener("pause", () => this.set({ playing: false }));
    el.addEventListener("error", () => this.set({ available: false, playing: false }));
    this.el = el;
  }

  async play() {
    if (!this.el) return;
    try {
      await this.el.play();
    } catch {
      /* diblokir browser atau file belum ada: tidak apa-apa, website tetap jalan */
    }
  }

  pause() {
    this.el?.pause();
  }

  toggle() {
    if (!this.el) return;
    if (this.el.paused) void this.play();
    else this.pause();
  }

  /** kembali ke awal (dipakai saat "Start Again") */
  reset() {
    if (!this.el) return;
    this.el.pause();
    this.el.currentTime = 0;
    this.el.volume = this.baseVolume;
  }

  /** loncat ke bagian emosional dengan fade halus */
  jumpTo(seconds: number) {
    const el = this.el;
    if (!el || seconds <= 0 || !this.snap.available) return;
    window.clearInterval(this.fadeTimer);
    let v = el.volume;
    const down = window.setInterval(() => {
      v = Math.max(0, v - 0.07);
      el.volume = v;
      if (v <= 0) {
        window.clearInterval(down);
        try {
          el.currentTime = seconds;
        } catch {
          /* metadata belum siap */
        }
        if (el.paused) void this.play();
        const up = window.setInterval(() => {
          v = Math.min(this.baseVolume + 0.1, v + 0.05);
          el.volume = v;
          if (v >= this.baseVolume + 0.1) window.clearInterval(up);
        }, 90);
        this.fadeTimer = up;
      }
    }, 40);
    this.fadeTimer = down;
  }

  /** efek suara kecil (chime lembut) via WebAudio — hanya jika musik sedang aktif */
  chime() {
    if (!this.snap.playing) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = this.ctx ?? new AC();
      const ctx = this.ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.12, now + i * 0.09 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.9);
        o.connect(g).connect(ctx.destination);
        o.start(now + i * 0.09);
        o.stop(now + i * 0.09 + 1);
      });
    } catch {
      /* abaikan */
    }
  }
}

export const audio = new AudioController();
