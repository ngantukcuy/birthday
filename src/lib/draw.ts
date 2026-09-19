/** Menggambar hati (path bezier) di canvas, berpusat di (x, y). */
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const s = size / 32;
  ctx.beginPath();
  ctx.moveTo(0, 9 * s);
  ctx.bezierCurveTo(-18 * s, -3 * s, -14 * s, -18 * s, 0, -8 * s);
  ctx.bezierCurveTo(14 * s, -18 * s, 18 * s, -3 * s, 0, 9 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Bintang empat sudut (sparkle). */
export function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);
  const r = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.quadraticCurveTo(0, 0, 0, r);
  ctx.quadraticCurveTo(0, 0, -r, 0);
  ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
