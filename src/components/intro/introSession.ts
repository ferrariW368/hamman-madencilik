const INTRO_SEEN_KEY = "hamman_intro_seen";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
}

export function markIntroSeen(): void {
  window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
}
