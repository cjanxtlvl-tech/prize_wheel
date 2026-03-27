import React from 'react';
import { SpinHistoryEntry } from '../types';

interface AdminPanelProps {
  isAdminMode: boolean;
  isEditingLocked: boolean;
  history: SpinHistoryEntry[];
  onToggleAdminMode: () => void;
  onToggleEditingLocked: () => void;
  onClearHistory: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdminMode,
  isEditingLocked,
  history,
  onToggleAdminMode,
  onToggleEditingLocked,
  onClearHistory,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Panel</h2>

      {/* Admin Mode Toggle */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAdminMode}
            onChange={onToggleAdminMode}
            className="w-5 h-5"
          />
          <div>
            <span className="text-sm font-semibold text-gray-800">
              Admin Mode
            </span>
            <p className="text-xs text-gray-600">
              Enable admin controls for event management
            </p>
          </div>
        </label>
      </div>

      {/* Editing Lock Toggle */}
      {isAdminMode && (
        <div className="mb-4 p-3 bg-yellow-50 rounded">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isEditingLocked}
              onChange={onToggleEditingLocked}
              className="w-5 h-5"
            />
            <div>
              <span className="text-sm font-semibold text-gray-800">
                Lock Editing
              </span>
              <p className="text-xs text-gray-600">
                Prevent changes during live event
              </p>
            </div>
          </label>
        </div>
      )}

      {/* History */}
      {isAdminMode && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              History ({history.length})
            </h3>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-sm px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">
                        {entry.participantName}
                      </span>
                      {entry.prizeLabel && (
                        <span className="text-gray-600 ml-2">
                          won {entry.prizeLabel}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      #{history.length - index}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                    {entry.removedAfterWin && ' (removed)'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded text-center">
              <p className="text-sm text-gray-600">No spins yet</p>
            </div>
          )}
        </div>
      )}

      {!isAdminMode && (
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            Enable Admin Mode to access advanced controls and history.
          </p>
        </div>
      )}
    </div>
  );
};
