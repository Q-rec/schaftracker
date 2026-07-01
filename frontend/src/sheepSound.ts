export function playMaeh(intensity: number = 1) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    // LFO adds wobble (bleating character)
    lfo.frequency.value = 6 + intensity * 2;
    lfoGain.gain.value = 15 * Math.min(intensity, 3);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";

    // Pitch contour: rises then falls like "määäh"
    const base = 160 + intensity * 15;
    const dur = 0.35 + intensity * 0.05;
    osc.frequency.setValueAtTime(base, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(base * 1.45, ctx.currentTime + 0.07);
    osc.frequency.linearRampToValueAtTime(base * 0.72, ctx.currentTime + dur);

    // Volume envelope
    const vol = Math.min(0.12 + intensity * 0.04, 0.3);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(vol, ctx.currentTime + 0.12);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur + 0.1);
    lfo.start(ctx.currentTime);
    lfo.stop(ctx.currentTime + dur + 0.1);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext not available (e.g. SSR or blocked)
  }
}

export function playSaltoMaeh() {
  // Two excited bleats for the salto
  playMaeh(4);
  setTimeout(() => playMaeh(5), 250);
}
