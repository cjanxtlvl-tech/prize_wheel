import React from 'react';

interface ControlButtonsProps {
  onSpin: () => void;
  onReset: () => void;
  isSpinning: boolean;
  isDisabled?: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onSpin,
  onReset,
  isSpinning,
  isDisabled = false,
}) => {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      {/* Spin Button */}
      <button
        onClick={onSpin}
        disabled={isSpinning || isDisabled}
        className={`flex-1 px-6 py-4 rounded font-bold text-lg transition-all transform ${
          isSpinning || isDisabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
        }`}
      >
        {isSpinning ? 'SPINNING...' : '🎡 SPIN'}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={isSpinning || isDisabled}
        className={`px-6 py-4 rounded font-bold transition-all ${
          isSpinning || isDisabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95'
        }`}
      >
        Reset
      </button>
    </div>
  );
};
