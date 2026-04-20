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
  compare: { frequency: 420, duration: 0.045, type: 'sine', gain: 0.035 },
  swap: { frequency: 220, duration: 0.075, type: 'triangle', gain: 0.05 },
  overwrite: { frequency: 520, duration: 0.06, type: 'sine', gain: 0.04 },
  partition: { frequency: 330, duration: 0.08, type: 'square', gain: 0.025 },
  visit: { frequency: 360, duration: 0.055, type: 'sine', gain: 0.035 },
  enqueue: { frequency: 480, duration: 0.045, type: 'sine', gain: 0.03 },
  relax: { frequency: 610, duration: 0.06, type: 'triangle', gain: 0.035 },
  choose: { frequency: 700, duration: 0.08, type: 'triangle', gain: 0.045 },
  reject: { frequency: 170, duration: 0.07, type: 'sawtooth', gain: 0.025 },
  place: { frequency: 640, duration: 0.08, type: 'triangle', gain: 0.045 },
  remove: { frequency: 240, duration: 0.07, type: 'sine', gain: 0.035 },
  complete: { frequency: 880, duration: 0.14, type: 'sine', gain: 0.05 },
  idle: { frequency: 300, duration: 0.04, type: 'sine', gain: 0.02 },
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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
