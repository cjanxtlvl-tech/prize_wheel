import { Participant } from '../types';

/**
 * Select a random winner from participants using weighted random selection
 * Participants with higher weight have higher probability of being selected
 *
 * Uses cumulative weight method:
 * - Calculate total weight
 * - Generate random number 0 to total weight
 * - Find which participant's segment the random number falls into
 */
export function selectWeightedRandomWinner(
  participants: Participant[]
): Participant | null {
  const activeParticipants = participants.filter((p) => p.active);

  if (activeParticipants.length === 0) {
    return null;
  }

  if (activeParticipants.length === 1) {
    return activeParticipants[0];
  }

  // Calculate total weight
  const totalWeight = activeParticipants.reduce((sum, p) => sum + p.weight, 0);

  if (totalWeight <= 0) {
    // Fallback to simple random if weights are invalid
    return activeParticipants[
      Math.floor(Math.random() * activeParticipants.length)
    ];
  }

  // Generate random number between 0 and totalWeight
  const random = Math.random() * totalWeight;

  // Find which participant this random value falls into
  let cumulativeWeight = 0;

  for (const participant of activeParticipants) {
    cumulativeWeight += participant.weight;
    if (random <= cumulativeWeight) {
      return participant;
    }
  }

  // Fallback (should not reach here)
  return activeParticipants[activeParticipants.length - 1];
}

/**
 * Calculate the probability of selection for a participant
 * Returns a percentage 0-100
 */
export function calculateWinProbability(
  participant: Participant,
  allParticipants: Participant[]
): number {
  const activeParticipants = allParticipants.filter((p) => p.active);
  const totalWeight = activeParticipants.reduce((sum, p) => sum + p.weight, 0);

  if (totalWeight <= 0 || !participant.active) {
    return 0;
  }

  return (participant.weight / totalWeight) * 100;
}

/**
 * Generate weights that match the visual wheel wedges
 * Ensures fairness: same segments should have same selection probability
 */
export function validateWeights(
  participants: Participant[]
): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  const activeParticipants = participants.filter((p) => p.active);
  if (activeParticipants.length === 0) {
    warnings.push('No active participants');
  }

  for (const participant of participants) {
    if (participant.weight < 1) {
      warnings.push(
        `${participant.name} has weight < 1, which may cause uneven distribution`
      );
    }
    if (!Number.isFinite(participant.weight)) {
      warnings.push(`${participant.name} has invalid weight`);
      return { isValid: false, warnings };
    }
  }

  return { isValid: warnings.length === 0, warnings };
}
