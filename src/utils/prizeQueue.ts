import { Prize } from '../types';

/**
 * Get the next unawarded prize in the queue
 */
export function getNextPrize(prizes: Prize[]): Prize | null {
  return prizes.find((p) => p.active && !p.awardedToParticipantId) || null;
}

/**
 * Get all active unawarded prizes
 */
export function getActivePrizes(prizes: Prize[]): Prize[] {
  return prizes.filter((p) => p.active && !p.awardedToParticipantId);
}

/**
 * Mark a prize as awarded to a participant
 */
export function markPrizeAwarded(
  prizes: Prize[],
  prizeId: string,
  participantId: string,
  timestamp: string
): Prize[] {
  return prizes.map((p) =>
    p.id === prizeId
      ? {
          ...p,
          awardedToParticipantId: participantId,
          awardedAt: timestamp,
          active: false,
        }
      : p
  );
}

/**
 * Advance to next prize in queue
 * Marks current as awarded if needed, returns next active prize
 */
export function advanceToNextPrize(
  prizes: Prize[],
  currentPrizeId: string | null,
  participantId: string
): { updatedPrizes: Prize[]; nextPrize: Prize | null } {
  let updatedPrizes = prizes;

  // Mark current prize as awarded
  if (currentPrizeId) {
    updatedPrizes = markPrizeAwarded(
      updatedPrizes,
      currentPrizeId,
      participantId,
      new Date().toISOString()
    );
  }

  // Get next available prize
  const nextPrize = getNextPrize(updatedPrizes);

  return { updatedPrizes, nextPrize };
}

/**
 * Reset all prizes to unawarded state
 */
export function resetPrizes(prizes: Prize[]): Prize[] {
  return prizes.map((p) => ({
    ...p,
    awardedToParticipantId: null,
    awardedAt: null,
    active: true,
  }));
}

/**
 * Check if all prizes have been awarded
 */
export function areAllPrizesAwarded(prizes: Prize[]): boolean {
  const activePrizes = getActivePrizes(prizes);
  return activePrizes.length === 0;
}

/**
 * Get prize count
 */
export function getPrizeCount(prizes: Prize[]): number {
  return prizes.filter((p) => p.active).length;
}

/**
 * Reorder prizes in queue (basic swap)
 */
export function reorderPrizes(
  prizes: Prize[],
  fromIndex: number,
  toIndex: number
): Prize[] {
  const clone = [...prizes];
  const [removed] = clone.splice(fromIndex, 1);
  if (removed) {
    clone.splice(toIndex, 0, removed);
  }
  return clone;
}
