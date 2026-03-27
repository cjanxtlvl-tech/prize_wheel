import React, { useMemo } from 'react';
import { Participant, PaletteOption, WheelSegment } from '../types';
import {
  calculateWheelSegments,
  generateSegmentPath,
  calculateLabelPosition,
} from '../utils/wheelMath';
import { getPalette, getContrastTextColor } from '../utils/colors';
import { Pointer } from './Pointer';

interface WheelCanvasProps {
  participants: Participant[];
  palette: PaletteOption;
  rotation: number;
  isSpinning: boolean;
  size?: number;
  showOuterLights?: boolean;
}

/**
 * SVG-based wheel rendering
 * Displays all participants as proportional wedges
 * Rotates based on spin animation
 */
export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  participants,
  palette,
  rotation,
  isSpinning,
  size = 500,
  showOuterLights = true,
}) => {
  const colors = getPalette(palette);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const hubRadius = 40;

  const segments: WheelSegment[] = useMemo(() => {
    return calculateWheelSegments(participants, colors);
  }, [participants, colors]);

  const pointerSize = 40;

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`filter drop-shadow-lg ${isSpinning ? '' : ''}`}
      >
        {/* Define gradients */}
        <defs>
          <radialGradient id="hubGradient">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
          <filter id="wheelShadow">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Outer lights (decorative dots) */}
        {showOuterLights && (
          <g>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360;
              const rad = (angle * Math.PI) / 180;
              const x = centerX + (radius + 30) * Math.cos(rad);
              const y = centerY + (radius + 30) * Math.sin(rad);
              return (
                <circle
                  key={`light-${i}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#FFD700"
                  opacity="0.8"
                  filter="url(#wheelShadow)"
                />
              );
            })}
          </g>
        )}

        {/* Wheel segments */}
        <g
          transform={`rotate(${rotation} ${centerX} ${centerY})`}
          filter="url(#wheelShadow)"
        >
          {segments.length > 0 ? (
            segments.map((segment) => {
              const path = generateSegmentPath(
                centerX,
                centerY,
                radius,
                segment.startAngle,
                segment.endAngle
              );

              const labelPos = calculateLabelPosition(
                centerX,
                centerY,
                radius,
                segment.startAngle,
                segment.endAngle
              );

              return (
                <g key={segment.participantId}>
                  {/* Segment */}
                  <path
                    d={path}
                    fill={segment.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={getContrastTextColor(segment.color)}
                    fontSize="14"
                    fontWeight="bold"
                    transform={
                      labelPos.shouldRotate
                        ? `rotate(${labelPos.rotation} ${labelPos.x} ${labelPos.y})`
                        : undefined
                    }
                    className="pointer-events-none select-none"
                  >
                    {segment.participantName}
                  </text>
                </g>
              );
            })
          ) : (
            // Empty state
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#E5E7EB"
              stroke="#D1D5DB"
              strokeWidth="2"
            />
          )}

          {/* Center hub */}
          <circle
            cx={centerX}
            cy={centerY}
            r={hubRadius}
            fill="url(#hubGradient)"
            stroke="#2C3E50"
            strokeWidth="3"
          />

          {/* Hub center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="#2C3E50"
          />
        </g>

        {/* Pointer (fixed at top) */}
        <g transform={`translate(${centerX - pointerSize / 2} 0)`}>
          <Pointer size={pointerSize} />
        </g>
      </svg>
    </div>
  );
};
