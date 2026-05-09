'use client';

import { useEffect, useRef } from 'react';

/*
 * MOTION.md §3.2 — Option A: generative grain field.
 *
 * Single-pass WebGL fragment shader. Renders at 0.5× resolution into a
 * canvas that's CSS-upscaled with `filter: blur(1px)` for free supersampling
 * smoothing. Animation is a slow noise-field shift (~0.3 cycles/sec) layered
 * over a vertical brand-900 → brand-700 gradient. ~12 KB shader code,
 * runs on integrated GPUs without breaking a sweat.
 *
 * Cleans up rAF + GL resources on unmount. Honors prefers-reduced-motion
 * by drawing one static frame and stopping.
 */
const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 frag;
uniform float u_time;
uniform vec2 u_res;

// Simple hash + value noise — small, fast, no textures.
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = v_uv;
  // Brand-900 → brand-700 gradient (RGB approximations of the @theme palette).
  vec3 top    = vec3(0.141, 0.231, 0.318); // brand-900 #243b51
  vec3 bottom = vec3(0.169, 0.322, 0.447); // brand-700 #2b5272
  vec3 base = mix(top, bottom, smoothstep(0.0, 1.0, uv.y));

  // Slow drifting grain field. Scale to viewport so grain stays consistent.
  vec2 p = uv * u_res * 0.0035 + vec2(u_time * 0.05, u_time * 0.03);
  float n = noise(p);
  // Layer a finer grain on top for a film-grain look.
  float fine = noise(uv * u_res * 0.015 + u_time * 0.6);

  vec3 col = base + (n - 0.5) * 0.04 + (fine - 0.5) * 0.025;
  frag = vec4(col, 1.0);
}`;

export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) return; // WebGL2 unsupported — let CSS fallback show.

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const program = makeProgram(gl, VERT, FRAG);
    if (!program) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Full-screen triangle strip.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_res');

    const dpr = Math.min(window.devicePixelRatio, 2);
    const scale = 0.5;

    let raf = 0;
    let start = performance.now();

    function resize() {
      if (!canvas || !gl) return;
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.max(1, Math.floor(w * dpr * scale));
      canvas.height = Math.max(1, Math.floor(h * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(canvas);

    function render(now: number) {
      gl?.uniform1f(uTime, (now - start) / 1000);
      gl?.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) raf = requestAnimationFrame(render);
    }
    if (reduced) {
      render(performance.now());
    } else {
      raf = requestAnimationFrame(render);
    }

    // Pause when offscreen — no point burning GPU on a tab the user isn't
    // looking at. Resume when visible again.
    function onVis() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        start = performance.now();
        raf = requestAnimationFrame(render);
      }
    }
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full [filter:blur(1px)] ${className ?? ''}`}
      style={{ background: 'linear-gradient(180deg, #243b51, #2b5272)' }}
    />
  );
}

function makeProgram(gl: WebGL2RenderingContext, vert: string, frag: string): WebGLProgram | null {
  const v = compile(gl, gl.VERTEX_SHADER, vert);
  const f = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('hero-canvas link error', gl.getProgramInfoLog(p));
    return null;
  }
  gl.deleteShader(v);
  gl.deleteShader(f);
  return p;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('hero-canvas shader error', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}
