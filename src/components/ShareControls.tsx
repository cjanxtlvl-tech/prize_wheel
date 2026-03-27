import React, { useState } from 'react';

interface ShareControlsProps {
  onCopyShareLink: () => Promise<boolean>;
  isDisabled?: boolean;
}

export const ShareControls: React.FC<ShareControlsProps> = ({
  onCopyShareLink,
  isDisabled = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopyShareLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Share Wheel</h2>

      <p className="text-sm text-gray-600 mb-4">
        Copy the share link to send the current wheel configuration to others.
      </p>

      <button
        onClick={handleCopy}
        disabled={isDisabled}
        className={`w-full px-4 py-3 rounded font-semibold transition-all ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:bg-gray-400`}
      >
        {copied ? '✓ Copied!' : '📋 Copy Share Link'}
      </button>

      <p className="text-xs text-gray-500 mt-3">
        The share link includes participants, prizes, and settings.
        <br />
        Uploaded logos can be saved locally after opening the link.
      </p>
    </div>
  );
};
