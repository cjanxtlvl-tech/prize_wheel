import React from 'react';
import { Prize } from '../types';
import { PrizeInput, PrizeDisplay } from './PrizeInput';

interface PrizeQueuePanelProps {
  prizes: Prize[];
  currentActivePrizeId: string | null;
  onAddPrize: (label: string) => void;
  onUpdatePrize?: (id: string, updates: Partial<Prize>) => void;
  onRemovePrize: (id: string) => void;
  onSetActivePrize: (prizeId: string | null) => void;
  isEditingLocked?: boolean;
}

export const PrizeQueuePanel: React.FC<PrizeQueuePanelProps> = ({
  prizes,
  currentActivePrizeId,
  onAddPrize,
  onUpdatePrize,
  onRemovePrize,
  onSetActivePrize,
  isEditingLocked = false,
}) => {
  const activePrizes = prizes.filter((p) => p.active);
  const awardedPrizes = prizes.filter((p) => p.awardedToParticipantId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Prize Queue</h2>

      {/* Add Prize */}
      <div className="mb-4">
        <PrizeInput
          onAddPrize={onAddPrize}
          isEditingLocked={isEditingLocked}
        />
      </div>

      {/* Active Prizes */}
      {activePrizes.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Available ({activePrizes.length}/{prizes.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activePrizes.map((prize) => (
              <div
                key={prize.id}
                onClick={() => !isEditingLocked && onSetActivePrize(prize.id)}
                className="cursor-pointer"
              >
                <PrizeDisplay
                  prize={prize}
                  isActive={prize.id === currentActivePrizeId}
                  onUpdate={(updates) =>
                    onUpdatePrize?.(prize.id, updates)
                  }
                  onRemove={() => onRemovePrize(prize.id)}
                  isEditingLocked={isEditingLocked}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded mb-4">
          <p className="text-sm text-yellow-800">
            No prizes added. Add prizes to get started.
          </p>
        </div>
      )}

      {/* Awarded Prizes */}
      {awardedPrizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Awarded ({awardedPrizes.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {awardedPrizes.map((prize) => (
              <div key={prize.id} className="p-2 bg-green-50 rounded text-sm">
                <div className="font-medium text-gray-800">
                  {prize.label}
                </div>
                <div className="text-xs text-green-700">✓ Won</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
