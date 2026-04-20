import { useEffect } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';
import { playStepSound, warmAudio } from '../utils/sound';

export function PlaybackControls() {
  const { isPlaying, play, pause, reset, stepForward, stepBackward, speed, setSpeed, currentIndex, steps, soundEnabled, toggleSound } = useVisualizerStore();

  useEffect(() => {
    if (!isPlaying) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        const { currentIndex: index, steps: allSteps, advancePlayback, pause: stop } = useVisualizerStore.getState();
        if (index >= allSteps.length - 1) stop();
        else advancePlayback();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!soundEnabled || !steps[currentIndex]) return;
    playStepSound(steps[currentIndex].action);
  }, [currentIndex, soundEnabled, steps]);

  const startPlayback = () => {
    warmAudio();
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

  return (
    <div className="control-row">
      <button type="button" onClick={isPlaying ? pause : startPlayback} title={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button type="button" onClick={manualStepBackward} title="Step backward">Back</button>
      <button type="button" onClick={manualStepForward} title="Step forward">Step</button>
      <button type="button" onClick={reset} title="Reset">Reset</button>
      <button type="button" className={soundEnabled ? 'sound-on' : ''} onClick={() => { warmAudio(); toggleSound(); }} title="Toggle sound">
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
