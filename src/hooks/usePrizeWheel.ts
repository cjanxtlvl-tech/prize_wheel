import { useState, useCallback, useEffect } from 'react';
import {
  AppState,
  BrandSettings,
  Participant,
  Prize,
  SpinHistoryEntry,
  PrizeMode,
  PaletteOption,
  SpinDurationOption,
} from '../types';
import {
  calculateWheelSegments,
  calculateFinalRotation,
} from '../utils/wheelMath';
import { selectRandomSegment } from '../utils/randomWinner';
import { saveState, loadState } from '../utils/localStorage';
import { getNextPrize, advanceToNextPrize, resetPrizes } from '../utils/prizeQueue';
import { generateId } from '../utils/stateEncoding';

const DEFAULT_STATE: AppState = {
  participants: [],
  prizes: [],
  currentActivePrizeId: null,
  singlePrize: '',
  selectedWinnerId: null,
  currentRotation: 0,
  isSpinning: false,
  wheelSettings: {
    spinDuration: 'normal',
    spinRpm: 30,
    palette: 'vibrant',
    soundEnabled: true,
    confettiEnabled: true,
    showOuterLights: true,
    prizeMode: 'single',
    weightedMode: true,
  },
  brandSettings: {
    title: 'Prize Wheel',
    subtitle: '',
    logoDataUrl: null,
    wheelBackgroundImageDataUrl: '/background.png',
  },
  adminSettings: {
    isAdminMode: false,
    isEditingLocked: false,
    showAdvancedControls: false,
    allowPrizeEditingDuringSession: false,
    allowWeightEditing: true,
    passcodeEnabled: false,
  },
  history: [],
};

function normalizeBrandSettings(
  settings?: Partial<BrandSettings> & {
    backgroundImageDataUrl?: string | null;
  }
): BrandSettings {
  // Determine if the user has explicitly set (or cleared) the background.
  // If neither old nor new key is present in saved state, fall back to the
  // default asset so fresh loads always get background.png.
  const hasExplicitValue =
    settings != null &&
    ('wheelBackgroundImageDataUrl' in settings ||
      'backgroundImageDataUrl' in settings);

  const resolvedBackground = hasExplicitValue
    ? (settings?.wheelBackgroundImageDataUrl ??
      settings?.backgroundImageDataUrl ??
      null)
    : DEFAULT_STATE.brandSettings.wheelBackgroundImageDataUrl;

  return {
    ...DEFAULT_STATE.brandSettings,
    ...settings,
    wheelBackgroundImageDataUrl: resolvedBackground,
  };
}

/**
 * Main hook for managing wheel state and all operations
 */
export function usePrizeWheel(initialState?: Partial<AppState>) {
  const [state, setState] = useState<AppState>(() => {
    // Try to load from localStorage first
    const saved = loadState();
    if (saved) {
      return {
        ...DEFAULT_STATE,
        ...saved,
        wheelSettings: {
          ...DEFAULT_STATE.wheelSettings,
          ...saved.wheelSettings,
        },
        brandSettings: normalizeBrandSettings(saved.brandSettings as any),
        adminSettings: {
          ...DEFAULT_STATE.adminSettings,
          ...saved.adminSettings,
        },
      };
    }

    // Fall back to initial state or default
    return {
      ...DEFAULT_STATE,
      ...initialState,
      wheelSettings: {
        ...DEFAULT_STATE.wheelSettings,
        ...initialState?.wheelSettings,
      },
      brandSettings: normalizeBrandSettings(initialState?.brandSettings as any),
      adminSettings: {
        ...DEFAULT_STATE.adminSettings,
        ...initialState?.adminSettings,
      },
    };
  });

  // Auto-save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Participant management
  const addParticipant = useCallback((name: string) => {
    if (!name.trim()) return;

    setState((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        {
          id: generateId(),
          name: name.trim(),
          weight: 1,
          active: true,
        },
      ],
    }));
  }, []);

  const updateParticipant = useCallback(
    (id: string, updates: Partial<Participant>) => {
      setState((prev) => ({
        ...prev,
        participants: prev.participants.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const removeParticipant = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== id),
    }));
  }, []);

  const clearParticipants = useCallback(() => {
    setState((prev) => ({
      ...prev,
      participants: [],
    }));
  }, []);

  const shuffleParticipants = useCallback(() => {
    setState((prev) => {
      const shuffled = [...prev.participants];

      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return { ...prev, participants: shuffled };
    });
  }, []);

  const setParticipantWeight = useCallback(
    (id: string, weight: number) => {
      const validWeight = Math.max(1, Math.min(100, Math.round(weight)));
      updateParticipant(id, { weight: validWeight });
    }, [updateParticipant]
  );

  // Prize management
  const setSinglePrize = useCallback((prize: string) => {
    setState((prev) => ({
      ...prev,
      singlePrize: prize.trim(),
    }));
  }, []);

  const addPrize = useCallback((label: string) => {
    if (!label.trim()) return;

    setState((prev) => {
      const newPrize: Prize = {
        id: generateId(),
        label: label.trim(),
        active: true,
      };

      const newPrizes = [...prev.prizes, newPrize];

      // If no active prize is set, make this one active
      const newActivePrizeId =
        prev.currentActivePrizeId || newPrize.id;

      return {
        ...prev,
        prizes: newPrizes,
        currentActivePrizeId: newActivePrizeId,
      };
    });
  }, []);

  const updatePrize = useCallback(
    (id: string, updates: Partial<Prize>) => {
      setState((prev) => ({
        ...prev,
        prizes: prev.prizes.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const removePrize = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((p) => p.id !== id),
      currentActivePrizeId:
        prev.currentActivePrizeId === id
          ? getNextPrize(prev.prizes.filter((p) => p.id !== id))?.id ||
            null
          : prev.currentActivePrizeId,
    }));
  }, []);

  const setActivePrize = useCallback(
    (prizeId: string | null) => {
      setState((prev) => ({
        ...prev,
        currentActivePrizeId: prizeId,
      }));
    },
    []
  );

  const advancePrizeQueue = useCallback(() => {
    if (state.selectedWinnerId && state.currentActivePrizeId) {
      const { updatedPrizes, nextPrize } = advanceToNextPrize(
        state.prizes,
        state.currentActivePrizeId,
        state.selectedWinnerId
      );

      setState((prev) => ({
        ...prev,
        prizes: updatedPrizes,
        currentActivePrizeId: nextPrize?.id || null,
      }));
    }
  }, [state.selectedWinnerId, state.currentActivePrizeId, state.prizes]);

  // Branding
  const setLogo = useCallback((dataUrl: string) => {
    setState((prev) => ({
      ...prev,
      brandSettings: {
        ...prev.brandSettings,
        logoDataUrl: dataUrl,
      },
    }));
  }, []);

  const clearLogo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      brandSettings: {
        ...prev.brandSettings,
        logoDataUrl: null,
      },
    }));
  }, []);

  const setBrandTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      brandSettings: {
        ...prev.brandSettings,
        title: title.trim(),
      },
    }));
  }, []);

  const setBrandSubtitle = useCallback((subtitle: string) => {
    setState((prev) => ({
      ...prev,
      brandSettings: {
        ...prev.brandSettings,
        subtitle: subtitle.trim(),
      },
    }));
  }, []);

  const setBackgroundImage = useCallback((dataUrl: string | null) => {
    setState((prev) => ({
      ...prev,
      brandSettings: {
        ...prev.brandSettings,
        wheelBackgroundImageDataUrl: dataUrl,
      },
    }));
  }, []);

  // Wheel control
  const spinWheel = useCallback(
    (callback?: (winnerId: string, segment: any) => void) => {
      const { participants, wheelSettings } = state;

      const activeParticipants = participants.filter((p) => p.active);
      if (activeParticipants.length === 0) {
        return;
      }

      // Pre-select winner before animation
      const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
      const segments = calculateWheelSegments(activeParticipants, colors);

      const winningSegment = selectRandomSegment(segments);
      if (!winningSegment) {
        return;
      }

      const winningParticipant = activeParticipants.find(
        (p) => p.id === winningSegment.participantId
      );

      if (!winningParticipant) {
        return;
      }

      // Mark as spinning
      setState((prev) => ({
        ...prev,
        isSpinning: true,
      }));

      // Calculate final rotation
      const currentRotation = state.currentRotation;
      const spinCount = 5;
      const finalRotation = calculateFinalRotation(
        winningSegment,
        currentRotation,
        spinCount
      );

      // Animate the spin
      const safeRpm = Math.max(2, Math.min(120, wheelSettings.spinRpm || 30));
      const rotationDelta = Math.max(finalRotation - currentRotation, 360);
      const totalTurns = rotationDelta / 360;
      const durationFromRpm = (totalTurns / safeRpm) * 60000;

      // Keep duration presets as multipliers while RPM controls baseline speed.
      const durationPresetMultiplier =
        wheelSettings.spinDuration === 'quick'
          ? 0.75
          : wheelSettings.spinDuration === 'long'
            ? 1.25
            : 1;

      const duration = Math.max(
        900,
        durationFromRpm * durationPresetMultiplier
      );
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentRot =
          currentRotation +
          (finalRotation - currentRotation) * eased;

        setState((prev) => ({
          ...prev,
          currentRotation: currentRot,
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Spin complete
          setState((prev) => ({
            ...prev,
            isSpinning: false,
            selectedWinnerId: winningParticipant.id,
            currentRotation: finalRotation,
          }));

          // Add to history
          const historyEntry: SpinHistoryEntry = {
            id: generateId(),
            participantId: winningParticipant.id,
            participantName: winningParticipant.name,
            prizeLabel:
              wheelSettings.prizeMode === 'single'
                ? state.singlePrize
                : state.prizes.find((p) => p.id === state.currentActivePrizeId)
                    ?.label,
            timestamp: new Date().toISOString(),
            removedAfterWin: false,
          };

          setState((prev) => ({
            ...prev,
            history: [historyEntry, ...prev.history],
          }));

          if (callback) {
            callback(winningParticipant.id, winningSegment);
          }
        }
      };

      animate();
    },
    [state]
  );

  const removeWinnerAndContinue = useCallback(() => {
    if (!state.selectedWinnerId) return;

    setState((prev) => {
      // Remove winner from participants
      const updated = {
        ...prev,
        participants: prev.participants.filter(
          (p) => p.id !== prev.selectedWinnerId
        ),
        selectedWinnerId: null,
      };

      // Update history to mark as removed
      updated.history = updated.history.map((h) =>
        h.participantId === prev.selectedWinnerId
          ? { ...h, removedAfterWin: true }
          : h
      );

      return updated;
    });
  }, [state.selectedWinnerId]);

  const keepWinnerAndContinue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedWinnerId: null,
    }));
  }, []);

  const resetWheel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedWinnerId: null,
      currentRotation: 0,
      isSpinning: false,
      participants: prev.participants.map((p) => ({ ...p, active: true })),
      prizes: resetPrizes(prev.prizes),
    }));
  }, []);

  // Admin mode
  const toggleAdminMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      adminSettings: {
        ...prev.adminSettings,
        isAdminMode: !prev.adminSettings.isAdminMode,
      },
    }));
  }, []);

  const setEditingLocked = useCallback((locked: boolean) => {
    setState((prev) => ({
      ...prev,
      adminSettings: {
        ...prev.adminSettings,
        isEditingLocked: locked,
      },
    }));
  }, []);

  // Settings
  const setSoundEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        soundEnabled: enabled,
      },
    }));
  }, []);

  const setConfettiEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        confettiEnabled: enabled,
      },
    }));
  }, []);

  const setSpinDuration = useCallback(
    (duration: SpinDurationOption) => {
      setState((prev) => ({
        ...prev,
        wheelSettings: {
          ...prev.wheelSettings,
          spinDuration: duration,
        },
      }));
    },
    []
  );

  const setSpinRpm = useCallback((rpm: number) => {
    const safeRpm = Math.max(2, Math.min(120, Math.round(rpm)));
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        spinRpm: safeRpm,
      },
    }));
  }, []);

  const setPalette = useCallback((palette: PaletteOption) => {
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        palette,
      },
    }));
  }, []);

  const setPrizeMode = useCallback((mode: PrizeMode) => {
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        prizeMode: mode,
      },
    }));
  }, []);

  const setWeightedMode = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        weightedMode: enabled,
      },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      history: [],
    }));
  }, []);

  return {
    // State
    state,
    // Participants
    addParticipant,
    updateParticipant,
    removeParticipant,
    clearParticipants,
    shuffleParticipants,
    setParticipantWeight,
    // Prizes
    setSinglePrize,
    addPrize,
    updatePrize,
    removePrize,
    setActivePrize,
    advancePrizeQueue,
    // Branding
    setLogo,
    clearLogo,
    setBrandTitle,
    setBrandSubtitle,
    setBackgroundImage,
    // Wheel control
    spinWheel,
    removeWinnerAndContinue,
    keepWinnerAndContinue,
    resetWheel,
    // Admin
    toggleAdminMode,
    setEditingLocked,
    // Settings
    setSoundEnabled,
    setConfettiEnabled,
    setSpinDuration,
    setSpinRpm,
    setPalette,
    setPrizeMode,
    setWeightedMode,
    // History
    clearHistory,
  };
}
