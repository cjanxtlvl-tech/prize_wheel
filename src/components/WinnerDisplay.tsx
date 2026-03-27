import React, { useEffect } from 'react';
import { Participant } from '../types';
import confetti from 'canvas-confetti';

interface WinnerDisplayProps {
  winner: Participant | null;
  prize?: string;
  onRemoveWinner: () => void;
  onKeepWinner: () => void;
  onAdvancePrize?: () => void;
  confettiEnabled?: boolean;
}

export const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  prize,
  onRemoveWinner,
  onKeepWinner,
  onAdvancePrize,
  confettiEnabled = true,
}) => {
  // Fire confetti when winner is shown
  useEffect(() => {
    if (winner && confettiEnabled) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.warn('Confetti failed:', error);
      }
    }
  }, [winner, confettiEnabled]);

  if (!winner) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full animate-bounce-5s pointer-events-auto">
        <div className="text-center">
          {/* Celebration emoji */}
          <div className="text-5xl mb-4">🎉</div>

          {/* Winner name */}
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {winner.name}
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-6">Wins!</p>

          {/* Prize */}
          {prize && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <p className="text-sm text-gray-600 mb-1">Prize</p>
              <p className="text-xl font-bold text-yellow-700">{prize}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-col">
            <button
              onClick={onKeepWinner}
              className="px-6 py-3 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors"
            >
              Keep & Continue
            </button>

            <button
              onClick={onRemoveWinner}
              className="px-6 py-3 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors"
            >
              Remove & Continue
            </button>

            {onAdvancePrize && (
              <button
                onClick={onAdvancePrize}
                className="px-6 py-3 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition-colors text-sm"
              >
                Next Prize
              </button>
            )}
          </div>

          {/* Info note */}
          <p className="text-xs text-gray-500 mt-4">
            Choose an action to continue
          </p>
        </div>
      </div>
    </div>
  );
};
