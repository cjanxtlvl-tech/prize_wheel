import React, { useState } from 'react';
import { Prize } from '../types';

interface PrizeInputProps {
  onAddPrize: (label: string) => void;
  isEditingLocked?: boolean;
}

export const PrizeInput: React.FC<PrizeInputProps> = ({
  onAddPrize,
  isEditingLocked = false,
}) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAddPrize(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAdd();
          }
        }}
        placeholder="Enter prize..."
        disabled={isEditingLocked}
        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <button
        onClick={handleAdd}
        disabled={isEditingLocked}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
      >
        Add Prize
      </button>
    </div>
  );
};

interface PrizeDisplayProps {
  prize: Prize;
  isActive?: boolean;
  onUpdate?: (updates: Partial<Prize>) => void;
  onRemove?: () => void;
  isEditingLocked?: boolean;
}

export const PrizeDisplay: React.FC<PrizeDisplayProps> = ({
  prize,
  isActive = false,
  onUpdate,
  onRemove,
  isEditingLocked = false,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded transition-all ${
        isActive
          ? 'bg-yellow-100 border-2 border-yellow-400'
          : 'bg-gray-50 border border-gray-300'
      }`}
    >
      {/* Active indicator */}
      <input
        type="checkbox"
        checked={prize.active}
        onChange={(e) => {
          onUpdate?.({ active: e.target.checked });
        }}
        disabled={isEditingLocked}
        className="w-4 h-4"
      />

      {/* Prize label */}
      <span className="flex-1 text-gray-800 font-medium">
        {prize.label}
      </span>

      {/* Awarded info */}
      {prize.awardedToParticipantId && (
        <span className="text-sm text-green-600 font-semibold">✓ Awarded</span>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          disabled={isEditingLocked}
          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:text-gray-400 text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
};
