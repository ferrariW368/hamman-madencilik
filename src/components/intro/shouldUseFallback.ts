export function shouldUseFallback(options: { prefersReducedMotion: boolean; hasWebGL: boolean }): boolean {
  return options.prefersReducedMotion || !options.hasWebGL;
}

/**
 * Whether this browser can give us a WebGL context at all.
 *
 * The probe context is explicitly released before returning. Dropping the
 * reference is not enough: a WebGL context is freed only when the GC gets
 * around to the canvas, which is nondeterministic, and mobile browsers cap the
 * number of live contexts (around 16 on iOS Safari and Android Chrome) and
 * evict the OLDEST one when the cap is reached. The oldest one would be the
 * intro's own scene, so an unreleased probe turns a cheap capability check into
 * a black canvas with no error.
 *
 * That is not hypothetical here: the intro is re-enterable within a session
 * (the homepage link, the back button, a typed URL), so IntroScene remounts and
 * this runs again on every visit, plus twice per mount under React's
 * development StrictMode double-invoke. It leaks per visit, not once.
 *
 * `WEBGL_lose_context` is the only way to force the release; it is optional, so
 * the call is guarded — on a browser without it we are no worse off than before.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
