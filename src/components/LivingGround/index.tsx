import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCalmBackground, WARM_EVENT } from '../../utils/ground';

/*
 * The living ground. A full-bleed, very low-contrast field of slowly drifting mint blobs on the warm
 * ground, with an ember spot that warms for ~800 ms when a line is kept or a sit ends.
 *
 * Constraints (from the Clearing brief):
 *  - half device resolution, at most 30 fps, paused when the tab is hidden or the player is open;
 *  - a CSS fallback that looks nearly the same for no WebGL2, reduced motion, or "Calm background: off";
 *  - decorative only: aria-hidden, no pointer events, nothing the user needs lives here.
 * Raw WebGL2, no library: one full-screen triangle and one fragment shader.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uGround;
uniform vec3 uMint;
uniform vec3 uCream;
uniform vec3 uEmber;
uniform float uStrength;
uniform float uWarm;
out vec4 outColor;

float blob(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // A gentle domain warp so the blobs breathe rather than slide. Periods run 12 to 20 s.
  p += 0.035 * vec2(sin(p.y * 3.1 + t * 0.42), cos(p.x * 2.7 + t * 0.36));

  vec2 c1 = vec2(aspect * (0.24 + 0.11 * sin(t * 0.39)), 0.80 + 0.07 * cos(t * 0.31));
  vec2 c2 = vec2(aspect * (0.80 + 0.09 * cos(t * 0.33 + 1.3)), 0.36 + 0.09 * sin(t * 0.47 + 0.4));
  vec2 c3 = vec2(aspect * (0.52 + 0.13 * sin(t * 0.36 + 2.1)), 0.04 + 0.06 * cos(t * 0.52));
  float m = blob(p, c1, 0.46) * 0.95 + blob(p, c2, 0.40) * 0.75 + blob(p, c3, 0.34) * 0.55;

  vec3 col = mix(uGround, uMint, clamp(m, 0.0, 1.0) * uStrength);
  col = mix(col, uCream, blob(p, vec2(aspect * 0.5, 0.55), 0.62) * 0.22 * uStrength);

  vec2 ec = vec2(aspect * (0.66 + 0.05 * sin(t * 0.21)), 0.70 + 0.04 * cos(t * 0.27));
  col = mix(col, uEmber, blob(p, ec, 0.24) * (0.08 + 0.32 * uWarm) * uStrength);

  // A whisper of noise to stop banding in the gradients.
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  outColor = vec4(col + (n - 0.5) / 255.0, 1.0);
}`;

const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  /* Shows the plain ground until the first frame lands, so there is never a black flash. */
  background: var(--ground);
`;

/* The fallback: the same three blobs and ember spot as still gradients. */
const Fallback = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(38% 34% at 66% 30%, color-mix(in srgb, var(--ember) 5%, transparent), transparent 70%),
    radial-gradient(46% 40% at 24% 20%, color-mix(in srgb, var(--mint) 30%, transparent), transparent 72%),
    radial-gradient(40% 38% at 80% 64%, color-mix(in srgb, var(--mint) 24%, transparent), transparent 72%),
    radial-gradient(34% 30% at 52% 96%, color-mix(in srgb, var(--mint) 18%, transparent), transparent 72%),
    var(--ground);

  .dark & {
    background:
      radial-gradient(38% 34% at 66% 30%, color-mix(in srgb, var(--ember) 4%, transparent), transparent 70%),
      radial-gradient(46% 40% at 24% 20%, color-mix(in srgb, var(--mint) 10%, transparent), transparent 72%),
      radial-gradient(40% 38% at 80% 64%, color-mix(in srgb, var(--mint) 8%, transparent), transparent 72%),
      radial-gradient(34% 30% at 52% 96%, color-mix(in srgb, var(--mint) 6%, transparent), transparent 72%),
      var(--ground);
  }
`;

const FRAME_MS = 1000 / 30;
/*
 * Half device resolution. Devices that report 4 GB of memory or less drop to a third: the shader is
 * cheap (about 0.14 ms GPU, 0.02 ms main thread per frame on a Mac, measured at 375 x 812 half-res),
 * but a mid-range phone GPU can be ten to twenty times slower, and the ground is never worth jank.
 */
const SCALE = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4 ? 1 / 3 : 0.5;
const WARM_MS = 800;

const hexToRgb = (value: string): [number, number, number] => {
  const hex = value.trim().replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex.slice(0, 6);
  const n = parseInt(full, 16);
  return Number.isNaN(n) ? [0.96, 0.97, 0.94] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const readPalette = () => {
  const css = getComputedStyle(document.documentElement);
  const dark = document.documentElement.classList.contains('dark');
  const ground = hexToRgb(css.getPropertyValue('--ground'));
  const mint = hexToRgb(css.getPropertyValue('--mint'));
  const ember = hexToRgb(css.getPropertyValue('--ember'));
  const cream = ground.map((c, i) => c + (ember[i] - c) * 0.12 + (1 - c) * (dark ? 0.02 : 0.25)) as [number, number, number];
  // Capped so every text token keeps 4.5:1 even where blobs overlap at full strength.
  return { ground, mint, ember, cream, strength: dark ? 0.1 : 0.3 };
};

interface Stats {
  frames: number;
  /** Mean main-thread milliseconds spent per rendered frame (uniforms + draw submission). */
  meanMs: number;
  maxMs: number;
  width: number;
  height: number;
}

const supportsWebGL2 = () => {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
};

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

const LivingGround = () => {
  const [calm] = useCalmBackground();
  const reduced = useReducedMotion();
  const [webgl] = useState(supportsWebGL2);
  const [lost, setLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = calm && !reduced && webgl && !lost;

  useEffect(() => {
    if (!live) return;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!canvas || !gl) {
      setLost(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setLost(true);
      return;
    }
    gl.useProgram(program);

    // One triangle that covers the screen.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uGround = u('uGround');
    const uMint = u('uMint');
    const uCream = u('uCream');
    const uEmber = u('uEmber');
    const uStrength = u('uStrength');
    const uWarm = u('uWarm');

    const applyPalette = () => {
      const p = readPalette();
      gl.uniform3fv(uGround, p.ground);
      gl.uniform3fv(uMint, p.mint);
      gl.uniform3fv(uCream, p.cream);
      gl.uniform3fv(uEmber, p.ember);
      gl.uniform1f(uStrength, p.strength);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(window.innerWidth * dpr * SCALE));
      const h = Math.max(1, Math.round(window.innerHeight * dpr * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // Always set these: a remounted effect gets a fresh program on an already-sized canvas.
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const stats: Stats = { frames: 0, meanMs: 0, maxMs: 0, width: 0, height: 0 };
    if (import.meta.env.DEV) (window as unknown as { __sageGround: Stats }).__sageGround = stats;

    const start = performance.now();
    let warmAt = -Infinity;
    let raf = 0;
    let last = 0;

    const paused = () => document.hidden || document.documentElement.dataset.player === 'open';

    const frame = (now: number) => {
      raf = 0;
      if (paused()) return;
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      const t0 = performance.now();
      const since = now - warmAt;
      // Rise fast, settle slowly: a bell over ~800 ms.
      const warm = since < WARM_MS ? Math.sin((since / WARM_MS) * Math.PI) : 0;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uWarm, warm);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const ms = performance.now() - t0;
      stats.frames += 1;
      stats.meanMs += (ms - stats.meanMs) / stats.frames;
      stats.maxMs = Math.max(stats.maxMs, ms);
      stats.width = canvas.width;
      stats.height = canvas.height;
    };

    const resume = () => {
      if (!raf && !paused()) raf = requestAnimationFrame(frame);
    };

    // Resizing clears the canvas; draw straight away rather than waiting for the next 30 fps slot.
    const resizeAndDraw = () => {
      resize();
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      frame(performance.now());
    };

    applyPalette();
    resizeAndDraw();

    const onWarm = () => {
      warmAt = performance.now();
      resume();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      setLost(true);
    };
    const observer = new MutationObserver(() => {
      applyPalette();
      resume();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-player'] });
    window.addEventListener('resize', resizeAndDraw);
    window.addEventListener(WARM_EVENT, onWarm);
    document.addEventListener('visibilitychange', resume);
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resizeAndDraw);
      window.removeEventListener(WARM_EVENT, onWarm);
      document.removeEventListener('visibilitychange', resume);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [live]);

  return live ? <Canvas ref={canvasRef} aria-hidden /> : <Fallback aria-hidden />;
};

export default LivingGround;
