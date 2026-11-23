"use client";

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled && !audioCtx && typeof window !== "undefined") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Plays a synthesized mechanical camera shutter sound using Web Audio API.
 * Consists of an initial click/burst (mirror flip-up) and a trailing latch click (curtain close).
 */
export function playShutterSound() {
  if (!soundEnabled || typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // 1. Shutter initial metallic click (high-passed noise burst)
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.04);
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    whiteNoise.start(now);

    // 2. Body resonance & slap (low frequency pop)
    const osc1 = audioCtx.createOscillator();
    const oscGain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.05);

    oscGain1.gain.setValueAtTime(0.5, now);
    oscGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc1.connect(oscGain1);
    oscGain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.06);

    // 3. Second mechanical curtain release click (~45ms later)
    const secondClickTime = now + 0.048;
    const osc2 = audioCtx.createOscillator();
    const oscGain2 = audioCtx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(950, secondClickTime);
    osc2.frequency.exponentialRampToValueAtTime(120, secondClickTime + 0.035);

    oscGain2.gain.setValueAtTime(0.3, secondClickTime);
    oscGain2.gain.exponentialRampToValueAtTime(0.001, secondClickTime + 0.035);

    osc2.connect(oscGain2);
    oscGain2.connect(audioCtx.destination);
    osc2.start(secondClickTime);
    osc2.stop(secondClickTime + 0.04);
  } catch (err) {
    console.debug("Web Audio shutter sound failed:", err);
  }
}
