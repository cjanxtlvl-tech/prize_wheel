import React from 'react';
import { SpinDurationOption, PaletteOption, PrizeMode } from '../types';
import { getAllPaletteOptions, getPaletteName } from '../utils/colors';
import { BackgroundUploader } from './BackgroundUploader';

interface SettingsPanelProps {
  spinDuration: SpinDurationOption;
  spinRpm: number;
  palette: PaletteOption;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  showOuterLights: boolean;
  prizeMode: PrizeMode;
  weightedMode: boolean;
  onSpinDurationChange: (duration: SpinDurationOption) => void;
  onSpinRpmChange: (rpm: number) => void;
  onPaletteChange: (palette: PaletteOption) => void;
  onSoundToggle: (enabled: boolean) => void;
  onConfettiToggle: (enabled: boolean) => void;
  onOuterLightsToggle?: (enabled: boolean) => void;
  onPrizeModeChange: (mode: PrizeMode) => void;
  onWeightedModeChange?: (enabled: boolean) => void;
  onBackgroundUpload: (dataUrl: string) => void;
  onBackgroundClear: () => void;
  hasBackgroundImage: boolean;
  isEditingLocked?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  spinDuration,
  spinRpm,
  palette,
  soundEnabled,
  confettiEnabled,
  showOuterLights,
  prizeMode,
  weightedMode,
  onSpinDurationChange,
  onSpinRpmChange,
  onPaletteChange,
  onSoundToggle,
  onConfettiToggle,
  onOuterLightsToggle,
  onPrizeModeChange,
  onWeightedModeChange,
  onBackgroundUpload,
  onBackgroundClear,
  hasBackgroundImage,
  isEditingLocked = false,
}) => {
  const paletteOptions = getAllPaletteOptions();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>

      <div className="space-y-4">
        {/* Spin Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spin Duration
          </label>
          <div className="flex gap-2">
            {(['quick', 'normal', 'long'] as SpinDurationOption[]).map(
              (duration) => (
                <button
                  key={duration}
                  onClick={() => onSpinDurationChange(duration)}
                  disabled={isEditingLocked}
                  className={`flex-1 px-3 py-2 rounded transition-colors text-sm font-medium ${
                    spinDuration === duration
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {duration.charAt(0).toUpperCase() + duration.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Spin Speed (RPM) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Spin Speed
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {spinRpm} RPM
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={120}
            step={1}
            value={spinRpm}
            onChange={(e) => onSpinRpmChange(Number(e.target.value))}
            disabled={isEditingLocked}
            className="w-full accent-blue-600 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lower RPM = slower spin. Higher RPM = faster spin.
          </p>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Palette
          </label>
          <select
            value={palette}
            onChange={(e) => onPaletteChange(e.target.value as PaletteOption)}
            disabled={isEditingLocked}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {paletteOptions.map((opt) => (
              <option key={opt} value={opt}>
                {getPaletteName(opt)}
              </option>
            ))}
          </select>
        </div>

        {/* Prize Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prize Mode
          </label>
          <div className="flex gap-2">
            {(['single', 'queue'] as PrizeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onPrizeModeChange(mode)}
                disabled={isEditingLocked}
                className={`flex-1 px-3 py-2 rounded transition-colors text-sm font-medium ${
                  prizeMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50`}
              >
                {mode === 'single' ? 'Single Prize' : 'Prize Queue'}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => onSoundToggle(e.target.checked)}
            disabled={isEditingLocked}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Enable Sound Effects</span>
        </label>

        {/* Confetti Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confettiEnabled}
            onChange={(e) => onConfettiToggle(e.target.checked)}
            disabled={isEditingLocked}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Enable Confetti</span>
        </label>

        {/* Outer Lights Toggle */}
        {onOuterLightsToggle && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showOuterLights}
              onChange={(e) => onOuterLightsToggle(e.target.checked)}
              disabled={isEditingLocked}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show Wheel Lights</span>
          </label>
        )}

        {/* Weighted Mode Toggle */}
        {onWeightedModeChange && (
          <div className="pt-2 border-t">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weightedMode}
                onChange={(e) => onWeightedModeChange(e.target.checked)}
                disabled={isEditingLocked}
                className="w-4 h-4"
              />
              <div>
                <span className="text-sm text-gray-700 block">
                  Weighted Mode
                </span>
                <span className="text-xs text-gray-500">
                  Participant odds match wheel size
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Wheel Background */}
        <div className="pt-2 border-t">
          <BackgroundUploader
            onBackgroundUpload={onBackgroundUpload}
            onBackgroundClear={onBackgroundClear}
            hasBackground={hasBackgroundImage}
          />
        </div>
      </div>
    </div>
  );
};
