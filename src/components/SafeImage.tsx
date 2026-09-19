import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  draggable?: boolean;
  sizes?: string;
}

/**
 * <img> dengan lazy loading, fade-in saat selesai dimuat, dan fallback lembut
 * kalau file foto belum ada (jadi layout tidak pernah terlihat rusak).
 */
export default function SafeImage({ src, alt, className = "", eager = false, draggable = false, sizes }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-blush via-[#f3cfd0] to-rose/70 text-ivory/80 ${className}`}
      >
        <Heart aria-hidden className="h-10 w-10 fill-current opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={draggable}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
