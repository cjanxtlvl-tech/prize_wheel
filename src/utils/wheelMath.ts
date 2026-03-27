import { Participant, WheelSegment } from '../types';

/**
 * Calculate wheel segments based on participants and their weights
 * Creates segments distributed proportionally to participant weights
 */
export function calculateWheelSegments(
  participants: Participant[],
  colors: string[]
): WheelSegment[] {
  if (participants.length === 0) {
    return [];
  }

  const activeParticipants = participants.filter((p) => p.active);
  if (activeParticipants.length === 0) {
    return [];
  }

  // Calculate total weight
  const totalWeight = activeParticipants.reduce((sum, p) => sum + p.weight, 0);

  const segments: WheelSegment[] = [];
  let currentAngle = 0;

  activeParticipants.forEach((participant, index) => {
    const proportion = participant.weight / totalWeight;
    const segmentAngle = proportion * 360;
    const color = colors[index % colors.length];

    segments.push({
      participantId: participant.id,
      participantName: participant.name,
      startAngle: currentAngle,
      endAngle: currentAngle + segmentAngle,
      weight: participant.weight,
      color,
    });

    currentAngle += segmentAngle;
  });

  return segments;
}

/**
 * Generate SVG path string for a wheel segment (pie slice)
 * Uses SVG arc command for smooth curves
 */
export function generateSegmentPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = degreesToRadians(startAngle - 90);
  const endRad = degreesToRadians(endAngle - 90);

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${centerX} ${centerY}
    L ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
    Z
  `;
}

/**
 * Calculate text label position for a segment
 * Returns coordinates and rotation angle for proper label placement
 */
export function calculateLabelPosition(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): {
  x: number;
  y: number;
  rotation: number;
  shouldRotate: boolean;
} {
  const midAngle = (startAngle + endAngle) / 2;

  // Position label at 70% of radius from center
  const labelRadius = radius * 0.7;
  const radians = degreesToRadians(midAngle - 90);

  const x = centerX + labelRadius * Math.cos(radians);
  const y = centerY + labelRadius * Math.sin(radians);

  // Always rotate text to run radially (parallel to wedge sides, hub -> rim)
  const shouldRotate = true;
  let rotation = midAngle - 90;

  // Adjust rotation so text isn't upside down
  if (rotation > 90 && rotation < 270) {
    rotation = rotation + 180;
  }

  return { x, y, rotation, shouldRotate };
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Find which segment a pointer (at top) is currently pointing at
 * Given current wheel rotation (in degrees)
 */
export function findPointedSegment(
  segments: WheelSegment[],
  wheelRotationDegrees: number
): WheelSegment | null {
  if (segments.length === 0) return null;

  // Pointer is at top (0 degrees), wheel rotates beneath it
  // Normalize the rotation to 0-360
  const normalizedRotation = normalizeAngle(wheelRotationDegrees);

  // Find segment that contains this angle
  // Account for pointer being fixed at top while wheel spins
  const pointerAngle = normalizeAngle(360 - normalizedRotation);

  for (const segment of segments) {
    const startNorm = normalizeAngle(segment.startAngle);
    const endNorm = normalizeAngle(segment.endAngle);

    // Handle wraparound cases
    if (startNorm < endNorm) {
      if (pointerAngle >= startNorm && pointerAngle < endNorm) {
        return segment;
      }
    } else {
      // Segment wraps around 360
      if (pointerAngle >= startNorm || pointerAngle < endNorm) {
        return segment;
      }
    }
  }

  return null;
}

/**
 * Calculate the final rotation needed to land on a specific segment
 * Returns a full rotation value (may be > 360)
 * The spin will complete the shortest full rotation and land on target
 */
export function calculateFinalRotation(
  targetSegment: WheelSegment,
  currentRotation: number,
  spinCount: number = 5
): number {
  // Get the middle of the target segment
  const targetAngle =
    (targetSegment.startAngle + targetSegment.endAngle) / 2;

  // We want the wheel to end up so the pointer (at top/0 degrees)
  // points to the target segment
  // Calculate number of full rotations and where to land
  const degreesPerRound = 360;
  const totalDegrees = spinCount * degreesPerRound;

  // The final resting angle should place the target at the pointer
  // Pointer is at 0 degrees (top), so we need the target segment's middle
  // to be at 360 - targetAngle (because wheel rotates opposite to visual)
  const targetRotationInRound = normalizeAngle(360 - targetAngle);

  // Account for current rotation and always move forward to the target.
  const currentInRound = normalizeAngle(currentRotation);
  const forwardDeltaToTarget = normalizeAngle(
    targetRotationInRound - currentInRound
  );

  // Add the full spins, then the remaining forward delta to target.
  const finalRotation =
    currentRotation + totalDegrees + forwardDeltaToTarget;

  return finalRotation;
}

/**
 * Easing function for spin animation
 * Starts fast, gradually slows down (ease-out cubic)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Calculate rotation angle at a specific time during spin
 */
export function getSpinRotationAtTime(
  startRotation: number,
  endRotation: number,
  elapsedMs: number,
  totalDurationMs: number
): number {
  const progress = Math.min(elapsedMs / totalDurationMs, 1);
  const eased = easeOutCubic(progress);
  const rotationDelta = endRotation - startRotation;
  return startRotation + rotationDelta * eased;
}

/**
 * Get spin duration in milliseconds based on setting
 */
export function getSpinDurationMs(
  duration: 'quick' | 'normal' | 'long'
): number {
  switch (duration) {
    case 'quick':
      return 2000;
    case 'normal':
      return 4000;
    case 'long':
      return 8000;
    default:
      return 4000;
  }
}
