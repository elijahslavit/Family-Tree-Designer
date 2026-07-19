"use client";

import { useEffect, useRef } from "react";

/**
 * Per-pixel lit card surface: a WebGL2 canvas laid over the frame image that
 * relights it from the material maps as the pointer moves.
 *
 * The maps do the work a flat image cannot. The normal map gives every contour
 * groove a facing direction, so a warm key light rakes across the embossed
 * topography and the relief genuinely turns as the pointer crosses it. The
 * roughness map shapes the specular exponent, so gold leaf takes a tight
 * highlight while the paper stays matte. The height map offsets the sample UV
 * against the pointer, so raised ornament drifts over sunken paper.
 *
 * Falls back silently to the plain <img> underneath when WebGL2 is missing, and
 * holds a still light under prefers-reduced-motion.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 frag;

uniform sampler2D uDiffuse;
uniform sampler2D uNormal;
uniform sampler2D uRough;
uniform sampler2D uHeight;

uniform vec2  uMouse;
uniform float uHasMouse;
uniform float uParallax;
uniform float uLightZ;
uniform float uNormalStr;
uniform float uSpecStr;
uniform float uDiffuseAmt;
uniform float uAmbientAmt;
uniform vec3  uLightColor;
uniform vec3  uAmbientColor;
uniform float uMotion;

void main() {
  vec2 uv = vUv;

  // Height parallax: raised ornament drifts against the pointer.
  float h0 = texture(uHeight, uv).r;
  if (uMotion > 0.5 && uHasMouse > 0.5) {
    vec2 viewOff = (uMouse - vec2(0.5)) * 2.0;
    uv = clamp(uv - viewOff * (h0 * uParallax), 0.001, 0.999);
  }

  vec4 diff = texture(uDiffuse, uv);
  float a = diff.a;
  if (a < 0.004) { frag = vec4(0.0); return; }

  vec3 albedo = diff.rgb;
  float rough = texture(uRough, uv).r;
  float h = texture(uHeight, uv).r;

  vec3 nRaw = texture(uNormal, uv).xyz * 2.0 - 1.0;
  nRaw.xy *= uNormalStr;
  vec3 N = normalize(vec3(nRaw.xy, max(nRaw.z, 0.08)));

  vec3 V = vec3(0.0, 0.0, 1.0);
  float ambRelief = 0.74 + 0.26 * max(N.z, 0.0);
  vec3 col = albedo * uAmbientColor * uAmbientAmt * ambRelief;

  // Warm key light following the pointer.
  vec2 lightUv = (uHasMouse > 0.5) ? uMouse : vec2(0.5, 0.72);
  vec3 L = normalize(vec3(lightUv.x - uv.x, lightUv.y - uv.y, uLightZ));
  float ndl = max(dot(N, L), 0.0);
  float wrap = ndl * 0.8 + 0.2;
  col += albedo * uLightColor * (wrap * uDiffuseAmt);

  // Roughness-shaped sheen: gold leaf catches, matte paper stays quiet.
  vec3 H = normalize(L + V);
  float shininess = mix(52.0, 6.0, clamp(rough, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), shininess);
  spec *= (1.0 - rough * 0.85) * uSpecStr;
  spec *= 0.82 + 0.34 * h;
  col += uLightColor * spec;

  // Faint warm rim when the key rakes in from the side.
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  float side = 1.0 - abs(L.z);
  col += uLightColor * rim * side * 0.1 * (1.0 - rough * 0.5);

  col = clamp(col, 0.0, 1.0);
  frag = vec4(col * a, a);
}`;

export type LitCardSurfaceProps = {
  diffuse: string;
  normal: string;
  roughness: string;
  height: string;
  className?: string;
};

export function LitCardSurface({ diffuse, normal, roughness, height, className }: LitCardSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "default",
    });
    if (!gl) return; // No WebGL2: the plain frame image stays visible.
    // Bound once so the nested draw/upload closures keep the non-null type.
    const ctx: WebGL2RenderingContext = gl;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    function compile(type: number, src: string) {
      const s = ctx.createShader(type);
      if (!s) return null;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        console.error("lit card shader:", ctx.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(ctx.VERTEX_SHADER, VERT);
    const fs = compile(ctx.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = ctx.createProgram();
    if (!prog) return;
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      console.error("lit card link:", ctx.getProgramInfoLog(prog));
      return;
    }
    ctx.useProgram(prog);

    const vao = ctx.createVertexArray();
    ctx.bindVertexArray(vao);
    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
    const aPos = ctx.getAttribLocation(prog, "aPos");
    ctx.enableVertexAttribArray(aPos);
    ctx.vertexAttribPointer(aPos, 2, ctx.FLOAT, false, 0, 0);

    const U: Record<string, WebGLUniformLocation | null> = {};
    for (const name of [
      "uDiffuse", "uNormal", "uRough", "uHeight", "uMouse", "uHasMouse",
      "uParallax", "uLightZ", "uNormalStr", "uSpecStr", "uDiffuseAmt",
      "uAmbientAmt", "uLightColor", "uAmbientColor", "uMotion",
    ]) {
      U[name] = ctx.getUniformLocation(prog, name);
    }

    ctx.uniform1i(U.uDiffuse, 0);
    ctx.uniform1i(U.uNormal, 1);
    ctx.uniform1i(U.uRough, 2);
    ctx.uniform1i(U.uHeight, 3);

    // Daylight over warm paper — the card sits on a sunlit atlas, not a night
    // scene, so ambient carries most of the exposure and the key only shapes.
    ctx.uniform3f(U.uLightColor, 1.0, 0.95, 0.84);
    ctx.uniform3f(U.uAmbientColor, 0.98, 0.96, 0.92);
    ctx.uniform1f(U.uAmbientAmt, 0.66);
    ctx.uniform1f(U.uDiffuseAmt, 0.34);
    ctx.uniform1f(U.uSpecStr, 0.5);
    ctx.uniform1f(U.uNormalStr, 1.5);
    ctx.uniform1f(U.uLightZ, 0.45);
    ctx.uniform1f(U.uParallax, reduceMotion ? 0.0 : 0.003);
    ctx.uniform1f(U.uMotion, reduceMotion ? 0.0 : 1.0);
    ctx.uniform1f(U.uHasMouse, 0.0);
    ctx.uniform2f(U.uMouse, 0.5, 0.72);

    function makeTex(unit: number, format: number) {
      const t = ctx.createTexture();
      ctx.activeTexture(ctx.TEXTURE0 + unit);
      ctx.bindTexture(ctx.TEXTURE_2D, t);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
      const px = format === ctx.RGBA ? new Uint8Array([0, 0, 0, 0]) : new Uint8Array([128, 128, 255]);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, format, 1, 1, 0, format, ctx.UNSIGNED_BYTE, px);
      return t;
    }

    const texDiffuse = makeTex(0, ctx.RGBA);
    const texNormal = makeTex(1, ctx.RGB);
    const texRough = makeTex(2, ctx.RGB);
    const texHeight = makeTex(3, ctx.RGB);

    let ready = false;
    let needsDraw = true;
    const mouse = { x: 0.5, y: 0.72 };
    let hasMouse = false;

    ctx.enable(ctx.BLEND);
    ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
    ctx.clearColor(0, 0, 0, 0);

    function resize() {
      const w0 = canvas!.offsetWidth;
      const h0 = canvas!.offsetHeight;
      if (w0 < 2 || h0 < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(w0 * dpr));
      const h = Math.max(1, Math.round(h0 * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        needsDraw = true;
      }
    }

    function draw() {
      resize();
      ctx.viewport(0, 0, canvas!.width, canvas!.height);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.uniform2f(U.uMouse, mouse.x, mouse.y);
      ctx.uniform1f(U.uHasMouse, hasMouse ? 1.0 : 0.0);
      ctx.activeTexture(ctx.TEXTURE0); ctx.bindTexture(ctx.TEXTURE_2D, texDiffuse);
      ctx.activeTexture(ctx.TEXTURE1); ctx.bindTexture(ctx.TEXTURE_2D, texNormal);
      ctx.activeTexture(ctx.TEXTURE2); ctx.bindTexture(ctx.TEXTURE_2D, texRough);
      ctx.activeTexture(ctx.TEXTURE3); ctx.bindTexture(ctx.TEXTURE_2D, texHeight);
      ctx.bindVertexArray(vao);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    }

    function frame() {
      if (disposed || !ready) return;
      if (needsDraw) {
        needsDraw = false;
        draw();
      }
      requestAnimationFrame(frame);
    }

    function load(src: string) {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`lit card: failed to load ${src}`));
        img.src = src;
      });
    }

    function upload(tex: WebGLTexture | null, unit: number, image: HTMLImageElement, format: number) {
      ctx.activeTexture(ctx.TEXTURE0 + unit);
      ctx.bindTexture(ctx.TEXTURE_2D, tex);
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, format, format, ctx.UNSIGNED_BYTE, image);
      ctx.generateMipmap(ctx.TEXTURE_2D);
    }

    Promise.all([load(diffuse), load(normal), load(roughness), load(height)])
      .then(([d, n, r, h]) => {
        if (disposed) return;
        upload(texDiffuse, 0, d, ctx.RGBA);
        upload(texNormal, 1, n, ctx.RGB);
        upload(texRough, 2, r, ctx.RGB);
        upload(texHeight, 3, h, ctx.RGB);
        ready = true;
        needsDraw = true;
        canvas.dataset.lit = "true";
        resize();
        requestAnimationFrame(frame);
      })
      .catch((err) => console.error(err));

    function onPointer(e: PointerEvent) {
      if (!ready || e.pointerType !== "mouse") return;
      const r = canvas!.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      // Overshoot allowed so the key can rake in from off the card.
      const x = (e.clientX - r.left) / r.width;
      const y = 1.0 - (e.clientY - r.top) / r.height;
      mouse.x = Math.min(1.4, Math.max(-0.4, x));
      mouse.y = Math.min(1.4, Math.max(-0.4, y));
      hasMouse = true;
      needsDraw = true;
    }

    function onLeave() {
      hasMouse = false;
      needsDraw = true;
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    const host = canvas.parentElement;
    host?.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => { needsDraw = true; });
    ro.observe(canvas);

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onPointer);
      host?.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      ctx.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [diffuse, normal, roughness, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 data-[lit=true]:opacity-100 ${className ?? ""}`}
    />
  );
}
