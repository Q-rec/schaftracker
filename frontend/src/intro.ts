const STORAGE_KEY = "schaftracker_seen_intro";

export function hasSeenIntro(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function markIntroSeen(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}
