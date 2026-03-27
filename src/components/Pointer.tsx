import React from 'react';

interface PointerProps {
  size?: number;
}

/**
 * Pointer displayed at top of wheel
 * Fixed position while wheel spins beneath it
 */
export const Pointer: React.FC<PointerProps> = ({ size = 40 }) => {
  return (
    <g>
      {/* Pointer triangle */}
      <polygon
        points={`${size / 2},0 ${size},${size} 0,${size}`}
        fill="#FFD700"
        stroke="#2C3E50"
        strokeWidth="2"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Center dot */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r="3"
        fill="#2C3E50"
      />
    </g>
  );
};
