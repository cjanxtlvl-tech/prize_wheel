import { Participant, WheelSegment } from '../types';
import { selectWeightedRandomWinner } from './weightedRandom';

/**
 * Select a winner from participants
 * Uses weighted random selection internally
 */
export function selectWinner(participants: Participant[]): Participant | null {
  return selectWeightedRandomWinner(participants);
}

/**
 * Find which participant corresponds to a wheel segment
 */
export function findParticipantInSegment(
  segment: WheelSegment,
  participants: Participant[]
): Participant | null {
  return (
    participants.find((p) => p.id === segment.participantId) || null
  );
}

/**
 * Get a random segment from available segments
 * Used for determining the target segment during spin
 */
export function selectRandomSegment(segments: WheelSegment[]): WheelSegment | null {
  if (segments.length === 0) {
    return null;
  }

  // Each segment's probability should match its weight
  // This method ensures the wheel fairness matches visual representation
  const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);

  if (totalWeight <= 0) {
    return segments[Math.floor(Math.random() * segments.length)];
  }

  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const segment of segments) {
    cumulativeWeight += segment.weight;
    if (random <= cumulativeWeight) {
      return segment;
    }
  }

  return segments[segments.length - 1];
}
