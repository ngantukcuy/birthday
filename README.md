# 💌 Digital Birthday Experience

Website ulang tahun romantis & cinematic (React + TypeScript + Vite + Tailwind + Framer Motion).

## Jalankan

```bash
npm install
npm run dev        # buka http://localhost:5173
```

Mau coba di HP? `npm run dev` sudah memakai `--host`. Pastikan HP & laptop satu WiFi,
lalu buka alamat "Network" yang muncul di terminal (contoh: http://192.168.1.10:5173).

## Yang diedit — cukup satu file

`src/data/birthday.ts` → nama, pengirim, tanggal, cerita, memories, timeline, surat, wishes, countdown, lagu.

## Foto & musik

| Isi | Taruh di | Dipakai di |
|---|---|---|
| Foto utama | `public/images/hero.jpg` | Hero + Final Surprise |
| Foto ending | `public/images/final.jpg` | Layar akhir "Made with love" |
| Galeri | `public/images/photo-1.jpg` … `photo-8.jpg` | Memories + Timeline |
| Musik | `public/music/birthday.mp3` | Background music |

File bawaan hanyalah placeholder — cukup timpa dengan nama file yang sama, atau ubah path di `birthday.ts`.
Tips: kompres foto ke lebar ±1200px (≤ 300 KB per foto) supaya cepat dibuka di HP.

## Build & deploy

```bash
npm run build      # hasil di folder dist/
npm run preview
```

Upload folder `dist/` ke Netlify / Vercel / Cloudflare Pages / GitHub Pages.
"# birthday" 
