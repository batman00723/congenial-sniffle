"use client";

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Subtle UI click / tick sound
export const playTick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

// Cinematic whoosh for Batman mode toggle or page transitions
export const playWhoosh = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Create noise buffer
  const bufferSize = ctx.sampleRate * 2; // 2 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  
  // Filter the noise to make it a low swoosh
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2);
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noiseSource.start(ctx.currentTime);
  noiseSource.stop(ctx.currentTime + 1.2);
};
