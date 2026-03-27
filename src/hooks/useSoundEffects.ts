import { useState, useCallback } from 'react';

/**
 * Hook to manage sound effects
 * Provides functions to play different sounds
 * Handles mute/unmute state
 */
export function useSoundEffects(enabled: boolean = true) {
  const [isMuted, setIsMuted] = useState(!enabled);

  // Create a simple tone using Web Audio API
  // This is a lightweight alternative to loading audio files
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (isMuted) return;

      try {
        // Use Web Audio API for sound generation
        const audioContext =
          new (window.AudioContext || (window as any).webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Envelope: fade in and out
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration / 1000
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (error) {
        console.warn('Sound playback failed:', error);
      }
    },
    [isMuted]
  );

  // Tick sound - short beep
  const playTick = useCallback(() => {
    playTone(1200, 50, 'sine');
  }, [playTone]);

  // Multiple ticks for spinning wheel effect
  const playSpinTicks = useCallback(() => {
    const tickCount = 8;
    const interval = 150; // ms between ticks

    for (let i = 0; i < tickCount; i++) {
      setTimeout(() => {
        playTone(800 + i * 100, 40, 'sine');
      }, i * interval);
    }
  }, [playTone]);

  // Celebration sound - ascending notes
  const playCelebration = useCallback(() => {
    const notes = [
      { freq: 523.25, duration: 150 }, // C5
      { freq: 659.25, duration: 150 }, // E5
      { freq: 783.99, duration: 200 }, // G5
    ];

    let delay = 0;
    for (const note of notes) {
      setTimeout(() => {
        playTone(note.freq, note.duration, 'sine');
      }, delay);
      delay += note.duration;
    }
  }, [playTone]);

  // Error/buzz sound
  const playError = useCallback(() => {
    playTone(200, 100, 'square');
    setTimeout(() => {
      playTone(150, 100, 'square');
    }, 110);
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    isMuted,
    toggleMute,
    playTick,
    playSpinTicks,
    playCelebration,
    playError,
  };
}
