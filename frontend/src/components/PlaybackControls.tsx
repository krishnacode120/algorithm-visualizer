import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';
import { playStepSound, warmAudio } from '../utils/sound';

export function PlaybackControls() {
  const { isPlaying, play, pause, reset, stepForward, stepBackward, speed, setSpeed, currentIndex, steps, soundEnabled, toggleSound, reducedMotion } = useVisualizerStore();
  const lastSoundIndex = useRef(currentIndex);

  useEffect(() => {
    if (!isPlaying) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const effectiveSpeed = reducedMotion ? Math.max(speed, 700) : speed;
      if (now - last >= effectiveSpeed) {
        last = now;
        const { currentIndex: index, steps: allSteps, advancePlayback, pause: stop } = useVisualizerStore.getState();
        if (index >= allSteps.length - 1) stop();
        else advancePlayback();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, reducedMotion, speed]);

  useEffect(() => {
    if (!soundEnabled || !steps[currentIndex]) return;
    if (lastSoundIndex.current === currentIndex) return;
    lastSoundIndex.current = currentIndex;
    playStepSound(steps[currentIndex].action);
  }, [currentIndex, soundEnabled, steps]);

  const startPlayback = () => {
    warmAudio();
    if (soundEnabled && steps[currentIndex]) playStepSound(steps[currentIndex].action);
    play();
  };

  const manualStepForward = () => {
    warmAudio();
    stepForward();
  };

  const manualStepBackward = () => {
    warmAudio();
    stepBackward();
  };

  const handleSoundToggle = () => {
    warmAudio();
    toggleSound();
  };

  return (
    <div className="control-row">
      <button type="button" onClick={isPlaying ? pause : startPlayback} title={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button type="button" onClick={manualStepBackward} title="Step backward">Back</button>
      <button type="button" onClick={manualStepForward} title="Step forward">Step</button>
      <button type="button" onClick={reset} title="Reset">Reset</button>
      <button type="button" className={soundEnabled ? 'sound-on' : ''} onClick={handleSoundToggle} title="Toggle sound">
        {soundEnabled ? 'Sound on' : 'Sound off'}
      </button>
      <label className="slider-label">
        Speed
        <input type="range" min="80" max="1200" step="20" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
      </label>
      <span className="step-chip">{Math.min(currentIndex + 1, steps.length)} / {steps.length}</span>
    </div>
  );
}
