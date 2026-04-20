import { ActionKind } from '../algorithms/types';

let audioContext: AudioContext | null = null;

const getContext = () => {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext ??= new AudioCtor();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
};

const profileByAction: Record<ActionKind, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  compare: { frequency: 520, duration: 0.085, type: 'sine', gain: 0.12 },
  swap: { frequency: 260, duration: 0.12, type: 'triangle', gain: 0.14 },
  overwrite: { frequency: 640, duration: 0.1, type: 'sine', gain: 0.12 },
  partition: { frequency: 370, duration: 0.13, type: 'square', gain: 0.08 },
  visit: { frequency: 430, duration: 0.095, type: 'sine', gain: 0.11 },
  enqueue: { frequency: 590, duration: 0.085, type: 'sine', gain: 0.1 },
  relax: { frequency: 720, duration: 0.1, type: 'triangle', gain: 0.11 },
  choose: { frequency: 820, duration: 0.14, type: 'triangle', gain: 0.14 },
  reject: { frequency: 190, duration: 0.12, type: 'sawtooth', gain: 0.08 },
  place: { frequency: 760, duration: 0.14, type: 'triangle', gain: 0.14 },
  remove: { frequency: 280, duration: 0.12, type: 'sine', gain: 0.1 },
  complete: { frequency: 980, duration: 0.2, type: 'sine', gain: 0.16 },
  idle: { frequency: 420, duration: 0.1, type: 'sine', gain: 0.1 },
};

export const warmAudio = () => {
  getContext();
};

export const playStepSound = (action: ActionKind) => {
  const context = getContext();
  if (!context) return;
  const profile = profileByAction[action] ?? profileByAction.idle;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = profile.type;
  oscillator.frequency.setValueAtTime(profile.frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, profile.frequency * 1.18), now + profile.duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(profile.gain, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + profile.duration + 0.02);
};

export const playSoundTest = () => {
  const context = getContext();
  if (!context) return;
  playStepSound('compare');
  window.setTimeout(() => playStepSound('swap'), 95);
  window.setTimeout(() => playStepSound('complete'), 210);
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
