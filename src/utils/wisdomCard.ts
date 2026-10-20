import { Video } from '../data/videos';

export type CardTheme = 'dark' | 'light';

const W = 1080;
const H = 1350;

const PALETTE: Record<CardTheme, { ground: string; ink: string; ink2: string; ink3: string; sage: string; amber: string; glow: string }> = {
  dark: { ground: '#0F1A17', ink: '#EDE7DA', ink2: '#A8B3A6', ink3: '#6F7E74', sage: '#8FA98F', amber: '#D4A373', glow: 'rgba(233,184,114,0.34)' },
  light: { ground: '#EEF1EA', ink: '#1C2622', ink2: '#5B6B61', ink3: '#8B9890', sage: '#4F6B5A', amber: '#B8853F', glow: 'rgba(212,163,115,0.42)' },
};

const DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif";
const UI = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

const wrap = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const drawMark = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 100, size / 100);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(20, -20, 0, -40);
    ctx.quadraticCurveTo(-20, -20, 0, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

/** Render a kept line as a 1080×1350 image in the Lamplight style. Resolves to a PNG blob. */
export const renderWisdomCard = async (video: Video, theme: CardTheme = 'dark'): Promise<Blob> => {
  await Promise.all([
    document.fonts.load(`300 72px ${DISPLAY}`),
    document.fonts.load(`700 28px ${UI}`),
    document.fonts.load(`500 28px ${UI}`),
  ]).catch(() => undefined);

  const p = PALETTE[theme];
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  // Ground and lamp.
  ctx.fillStyle = p.ground;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, -120, 40, W / 2, -120, 980);
  glow.addColorStop(0, p.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  drawMark(ctx, W / 2, 150, 64, p.amber);

  // Eyebrow.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = p.sage;
  ctx.font = `700 24px ${UI}`;
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '5px';
  ctx.fillText('A LINE TO SIT WITH', W / 2, 262);
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';

  // The line, sized to fit.
  const maxWidth = 860;
  let size = 76;
  let lines: string[] = [];
  for (; size >= 44; size -= 4) {
    ctx.font = `300 ${size}px ${DISPLAY}`;
    lines = wrap(ctx, video.wisdom, maxWidth);
    if (lines.length * size * 1.22 <= 620) break;
  }
  const lineHeight = size * 1.22;
  const blockHeight = lines.length * lineHeight;
  const top = 330 + (660 - blockHeight) / 2;
  ctx.fillStyle = p.ink;
  ctx.font = `300 ${size}px ${DISPLAY}`;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, top + lineHeight * (i + 0.8)));

  // Attribution.
  const who = video.thinker ?? video.title;
  const rest = [video.thinker ? video.title : null, video.creatorChannel ? `via ${video.creatorChannel}` : null].filter(Boolean).join(' · ');
  let y = top + blockHeight + 70;
  ctx.fillStyle = p.ink;
  ctx.font = `700 30px ${UI}`;
  ctx.fillText(who, W / 2, y);
  if (rest) {
    y += 44;
    ctx.fillStyle = p.ink2;
    ctx.font = `500 26px ${UI}`;
    ctx.fillText(rest, W / 2, y);
  }

  // Footer.
  ctx.fillStyle = p.ink3;
  ctx.font = `600 24px ${UI}`;
  drawMark(ctx, W / 2 - 86, 1258, 26, p.ink3);
  ctx.textAlign = 'left';
  ctx.fillText('Sage Advice', W / 2 - 62, 1267);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not render the card'))), 'image/png'));
};

export const cardFileName = (video: Video) => `sage-advice-${video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.png`;

export const canShareFiles = (file: File) =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

export const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
};
