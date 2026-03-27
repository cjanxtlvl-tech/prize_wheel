import React, { useState } from 'react';
import { Participant } from '../types';

interface NameEntryPanelProps {
  participants: Participant[];
  onAddParticipant: (name: string) => void;
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onShuffleParticipants: () => void;
  onSetWeight?: (id: string, weight: number) => void;
  isEditingLocked?: boolean;
  allowWeightEditing?: boolean;
}

export const NameEntryPanel: React.FC<NameEntryPanelProps> = ({
  participants,
  onAddParticipant,
  onUpdateParticipant,
  onRemoveParticipant,
  onClearParticipants,
  onShuffleParticipants,
  onSetWeight,
  isEditingLocked = false,
  allowWeightEditing = true,
}) => {
  const [singleInput, setSingleInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleAddSingle = () => {
    if (singleInput.trim()) {
      onAddParticipant(singleInput.trim());
      setSingleInput('');
    }
  };

  const handleBulkAdd = () => {
    const names = bulkInput
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    names.forEach((name) => {
      onAddParticipant(name);
    });

    setBulkInput('');
    setShowBulkInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddSingle();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Add Participants
      </h2>

      {!showBulkInput ? (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={singleInput}
            onChange={(e) => setSingleInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter name..."
            disabled={isEditingLocked}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleAddSingle}
            disabled={isEditingLocked}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setShowBulkInput(true)}
            disabled={isEditingLocked}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 transition-colors text-sm"
          >
            Bulk
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Paste names (one per line)..."
            disabled={isEditingLocked}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 h-24 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBulkAdd}
              disabled={isEditingLocked}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              Add All
            </button>
            <button
              onClick={() => {
                setShowBulkInput(false);
                setBulkInput('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Participants ({participants.length})
            </h3>
            <button
              onClick={onShuffleParticipants}
              disabled={isEditingLocked}
              className="text-sm px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
            >
              Shuffle
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                {/* Active toggle */}
                <input
                  type="checkbox"
                  checked={participant.active}
                  onChange={(e) =>
                    onUpdateParticipant(participant.id, { active: e.target.checked })
                  }
                  disabled={isEditingLocked}
                  className="w-4 h-4"
                />

                {/* Name */}
                <span className="flex-1 text-gray-800">{participant.name}</span>

                {/* Weight */}
                {allowWeightEditing && (
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Weight:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={participant.weight}
                      onChange={(e) => {
                        const weight = Math.max(1, parseInt(e.target.value) || 1);
                        onSetWeight?.(participant.id, weight);
                      }}
                      disabled={isEditingLocked}
                      className="w-12 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    />
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => onRemoveParticipant(participant.id)}
                  disabled={isEditingLocked}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:text-gray-400 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {!isEditingLocked && (
            <button
              onClick={onClearParticipants}
              className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};
