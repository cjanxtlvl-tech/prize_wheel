import { AppState } from '../types';

/**
 * Encode app state into a compact URL-friendly format
 * Uses Base64 for brevity and reliable encoding
 */
export function encodeStateToUrl(state: AppState): string {
  // Only include the shareable parts
  const shareableState = {
    participants: state.participants.map((p) => ({
      name: p.name,
      weight: p.weight,
      active: p.active,
    })),
    singlePrize: state.singlePrize,
    prizes: state.prizes.map((p) => ({
      label: p.label,
      active: p.active,
    })),
    prizeMode: state.wheelSettings.prizeMode,
    palette: state.wheelSettings.palette,
    spinDuration: state.wheelSettings.spinDuration,
    spinRpm: state.wheelSettings.spinRpm,
    weightedMode: state.wheelSettings.weightedMode,
    brandTitle: state.brandSettings.title,
    brandSubtitle: state.brandSettings.subtitle,
    // Logo Data URL not included - too large for URL
  };

  try {
    const jsonString = JSON.stringify(shareableState);
    const encoded = btoa(jsonString);
    return encoded;
  } catch (error) {
    console.error('Failed to encode state:', error);
    return '';
  }
}

/**
 * Decode state from URL-encoded format
 * Validates and handles malformed input safely
 */
export function decodeStateFromUrl(encoded: string): Partial<AppState> | null {
  if (!encoded) {
    return null;
  }

  try {
    const jsonString = atob(encoded);
    const data = JSON.parse(jsonString);

    return {
      participants: data.participants ? data.participants.map((p: unknown) => {
        const particle = p as Record<string, unknown>;
        return {
          id: generateId(),
          name: String(particle.name || ''),
          weight: typeof particle.weight === 'number' ? Math.max(1, particle.weight) : 1,
          active: particle.active !== false,
        };
      }) : [],
      singlePrize: data.singlePrize || '',
      prizes: data.prizes
        ? data.prizes.map((p: unknown) => {
            const prize = p as Record<string, unknown>;
            return {
              id: generateId(),
              label: String(prize.label || ''),
              active: prize.active !== false,
            };
          })
        : [],
      wheelSettings: {
        prizeMode: data.prizeMode || 'single',
        palette: data.palette || 'vibrant',
        spinDuration: data.spinDuration || 'normal',
        spinRpm: typeof data.spinRpm === 'number' ? Math.max(2, Math.min(120, Math.round(data.spinRpm))) : 30,
        weightedMode: data.weightedMode !== false,
        soundEnabled: true,
        confettiEnabled: true,
        showOuterLights: true,
      },
      brandSettings: {
        title: data.brandTitle || '',
        subtitle: data.brandSubtitle || '',
        logoDataUrl: null,
        wheelBackgroundImageDataUrl: null,
      },
    };
  } catch (error) {
    console.error('Failed to decode state:', error);
    return null;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a shareable URL with encoded state
 */
export function createShareUrl(state: AppState, baseUrl?: string): string {
  const encoded = encodeStateToUrl(state);
  const base = baseUrl || window.location.origin + window.location.pathname;
  return `${base}?state=${encoded}`;
}

/**
 * Extract state from URL query parameters
 */
export function getStateFromQueryParams(): Partial<AppState> | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('state');

  if (!encoded) {
    return null;
  }

  return decodeStateFromUrl(encoded);
}

/**
 * Update browser URL with new state (without page reload)
 */
export function updateUrlWithState(state: AppState): void {
  try {
    const url = createShareUrl(state);
    window.history.replaceState({ state }, '', url);
  } catch (error) {
    console.error('Failed to update URL:', error);
  }
}
