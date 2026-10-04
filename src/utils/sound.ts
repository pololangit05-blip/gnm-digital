// Web Audio API emergency siren synthesizer

let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sirenInterval: any = null;

export const playEmergencySiren = () => {
  try {
    stopEmergencySiren();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(700, audioCtx.currentTime);

    // Initial moderate volume to prevent deafening
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    // Frequency sweep pattern for Indonesian Siskamling / Sirine Darurat
    let high = false;
    sirenInterval = setInterval(() => {
      if (!audioCtx || !oscillator) return;
      const targetFreq = high ? 600 : 960;
      oscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.15);
      high = !high;
    }, 350);
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
};

export const stopEmergencySiren = () => {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
      oscillator.disconnect();
    } catch {
      // ignore
    }
    oscillator = null;
  }
  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch {
      // ignore
    }
    gainNode = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch {
      // ignore
    }
    audioCtx = null;
  }
};
