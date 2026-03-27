import React from 'react';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  isMuted,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-all ${
        isMuted
          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      title={isMuted ? 'Sound Muted' : 'Sound Enabled'}
    >
      {isMuted ? (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.707a1 1 0 00-1.414 1.414L9 9.586V12a1 1 0 102 0V9.586l.293.293a1 1 0 001.414-1.414l-2-2a1 1 0 00-1.414 0l-2 2z" />
        </svg>
      )}
    </button>
  );
};
