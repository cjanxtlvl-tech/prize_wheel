import React, { useEffect, useState } from 'react';
import { AppState, Participant } from '../types';
import { WheelCanvas } from './WheelCanvas';
import { ControlButtons } from './ControlButtons';
import { NameEntryPanel } from './NameEntryPanel';
import { PrizeQueuePanel } from './PrizeQueuePanel';
import { WinnerDisplay } from './WinnerDisplay';
import { SettingsPanel } from './SettingsPanel';
import { AdminPanel } from './AdminPanel';
import { ShareControls } from './ShareControls';
import { HeaderBrand } from './HeaderBrand';
import { LogoUploader } from './LogoUploader';
import { SoundToggle } from './SoundToggle';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useShareableState } from '../hooks/useShareableState';


interface PrizeWheelProps {
  state: AppState;
  onSpinWheel: (callback?: (winnerId: string, segment: any) => void) => void;
  onAddParticipant: (name: string) => void;
  onUpdateParticipant: (
    id: string,
    updates: Partial<Participant>
  ) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onShuffleParticipants: () => void;
  onSetParticipantWeight: (id: string, weight: number) => void;
  onAddPrize: (label: string) => void;
  onUpdatePrize: (id: string, updates: any) => void;
  onRemovePrize: (id: string) => void;
  onSetActivePrize: (prizeId: string | null) => void;
  onAdvancePrizeQueue: () => void;
  onSetSinglePrize: (prize: string) => void;
  onSetLogo: (dataUrl: string) => void;
  onClearLogo: () => void;
  onSetBrandTitle: (title: string) => void;
  onSetBrandSubtitle: (subtitle: string) => void;
  onRemoveWinnerAndContinue: () => void;
  onKeepWinnerAndContinue: () => void;
  onResetWheel: () => void;
  onToggleAdminMode: () => void;
  onSetEditingLocked: (locked: boolean) => void;
  onSetSoundEnabled: (enabled: boolean) => void;
  onSetConfettiEnabled: (enabled: boolean) => void;
  onSetSpinDuration: (duration: any) => void;
  onSetSpinRpm: (rpm: number) => void;
  onSetPalette: (palette: any) => void;
  onSetPrizeMode: (mode: any) => void;
  onSetWeightedMode: (enabled: boolean) => void;
  onSetBackgroundImage: (dataUrl: string | null) => void;
  onClearHistory: () => void;
}

export const PrizeWheel: React.FC<PrizeWheelProps> = ({
  state,
  onSpinWheel,
  onAddParticipant,
  onUpdateParticipant,
  onRemoveParticipant,
  onClearParticipants,
  onShuffleParticipants,
  onSetParticipantWeight,
  onAddPrize,
  onUpdatePrize,
  onRemovePrize,
  onSetActivePrize,
  onAdvancePrizeQueue,
  onSetSinglePrize,
  onSetLogo,
  onClearLogo,
  onSetBrandTitle,
  onSetBrandSubtitle,
  onRemoveWinnerAndContinue,
  onKeepWinnerAndContinue,
  onResetWheel,
  onToggleAdminMode,
  onSetEditingLocked,
  onSetSoundEnabled,
  onSetConfettiEnabled,
  onSetSpinDuration,
  onSetSpinRpm,
  onSetPalette,
  onSetPrizeMode,
  onSetWeightedMode,
  onSetBackgroundImage,
  onClearHistory,
}) => {
  const [editingBranding, setEditingBranding] = useState(false);
  const { isMuted, toggleMute, playCelebration, playSpinTicks } =
    useSoundEffects(state.wheelSettings.soundEnabled);
  const shareState = useShareableState(state);

  // Get current winner (participant)
  const winner = state.participants.find(
    (p) => p.id === state.selectedWinnerId
  ) || null;

  // Get current prize
  const currentPrize =
    state.wheelSettings.prizeMode === 'single'
      ? state.singlePrize
      : state.prizes.find((p) => p.id === state.currentActivePrizeId)
          ?.label;

  // Handle spin
  const handleSpin = () => {
    if (state.isSpinning || state.participants.filter((p) => p.active).length === 0) {
      return;
    }

    // Play sounds
    playSpinTicks();

    // Perform spin
    onSpinWheel(() => {
      // On spin complete
      setTimeout(() => {
        playCelebration();
      }, 500);
    });
  };

  // Update URL when state changes
  useEffect(() => {
    shareState.updateUrl();
  }, [state]);

  // Handle URL state import
  useEffect(() => {
    const handleLoadStateFromUrl = (event: any) => {
      const urlState = event.detail;
      // Parse and apply URL state
      // This would need to be implemented in the parent component
      console.log('URL state loaded:', urlState);
    };

    window.addEventListener('loadStateFromUrl', handleLoadStateFromUrl);
    return () => {
      window.removeEventListener('loadStateFromUrl', handleLoadStateFromUrl);
    };
  }, []);

  const activeParticipantsCount = state.participants.filter(
    (p) => p.active
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            🎡 Prize Wheel
          </h1>
          <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Header/Branding */}
          <div>
            {!editingBranding ? (
              <HeaderBrand
                title={state.brandSettings.title}
                subtitle={state.brandSettings.subtitle}
                logoDataUrl={state.brandSettings.logoDataUrl}
                onEditClick={() => setEditingBranding(true)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <input
                  type="text"
                  value={state.brandSettings.title}
                  onChange={(e) => onSetBrandTitle(e.target.value)}
                  placeholder="Event Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={state.brandSettings.subtitle}
                  onChange={(e) => onSetBrandSubtitle(e.target.value)}
                  placeholder="Subtitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <LogoUploader
                  onLogoUpload={onSetLogo}
                  onLogoClear={onClearLogo}
                  hasLogo={!!state.brandSettings.logoDataUrl}
                />
                <button
                  onClick={() => setEditingBranding(false)}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Participants */}
          <NameEntryPanel
            participants={state.participants}
            onAddParticipant={onAddParticipant}
            onUpdateParticipant={onUpdateParticipant}
            onRemoveParticipant={onRemoveParticipant}
            onClearParticipants={onClearParticipants}
            onShuffleParticipants={onShuffleParticipants}
            onSetWeight={onSetParticipantWeight}
            isEditingLocked={state.adminSettings.isEditingLocked}
            allowWeightEditing={state.adminSettings.allowWeightEditing}
          />

          {/* Prizes */}
          {state.wheelSettings.prizeMode === 'queue' ? (
            <PrizeQueuePanel
              prizes={state.prizes}
              currentActivePrizeId={state.currentActivePrizeId}
              onAddPrize={onAddPrize}
              onUpdatePrize={onUpdatePrize}
              onRemovePrize={onRemovePrize}
              onSetActivePrize={onSetActivePrize}
              isEditingLocked={state.adminSettings.isEditingLocked}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Prize</h2>
              <input
                type="text"
                value={state.singlePrize}
                onChange={(e) => onSetSinglePrize(e.target.value)}
                placeholder="Enter prize..."
                disabled={state.adminSettings.isEditingLocked}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 mb-2"
              />
              <p className="text-sm text-gray-600">
                {state.singlePrize || 'No prize set'}
              </p>
            </div>
          )}

          {/* Settings */}
          <SettingsPanel
            spinDuration={state.wheelSettings.spinDuration}
            spinRpm={state.wheelSettings.spinRpm}
            palette={state.wheelSettings.palette}
            soundEnabled={state.wheelSettings.soundEnabled}
            confettiEnabled={state.wheelSettings.confettiEnabled}
            showOuterLights={state.wheelSettings.showOuterLights}
            prizeMode={state.wheelSettings.prizeMode}
            weightedMode={state.wheelSettings.weightedMode}
            onSpinDurationChange={onSetSpinDuration}
            onSpinRpmChange={onSetSpinRpm}
            onPaletteChange={onSetPalette}
            onSoundToggle={onSetSoundEnabled}
            onConfettiToggle={onSetConfettiEnabled}
            onPrizeModeChange={onSetPrizeMode}
            onWeightedModeChange={onSetWeightedMode}
            onBackgroundUpload={onSetBackgroundImage}
            onBackgroundClear={() => onSetBackgroundImage(null)}
            hasBackgroundImage={!!state.brandSettings.wheelBackgroundImageDataUrl}
            isEditingLocked={state.adminSettings.isEditingLocked}
          />

          {/* Share */}
          <ShareControls
            onCopyShareLink={shareState.copyShareLink}
            isDisabled={state.isSpinning}
          />

          {/* Admin */}
          <AdminPanel
            isAdminMode={state.adminSettings.isAdminMode}
            isEditingLocked={state.adminSettings.isEditingLocked}
            history={state.history}
            onToggleAdminMode={onToggleAdminMode}
            onToggleEditingLocked={() =>
              onSetEditingLocked(
                !state.adminSettings.isEditingLocked
              )
            }
            onClearHistory={onClearHistory}
          />
        </div>

        {/* Right Panel - Wheel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Prize Display */}
          {currentPrize && (
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Current Prize</p>
              <p className="text-2xl font-bold text-yellow-600">
                {currentPrize}
              </p>
            </div>
          )}

          {/* Wheel */}
          <div className="bg-white rounded-lg shadow p-6 flex justify-center relative overflow-hidden">
            {state.brandSettings.wheelBackgroundImageDataUrl && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${state.brandSettings.wheelBackgroundImageDataUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.35,
                }}
                aria-hidden="true"
              />
            )}
            <div className="relative z-10">
              <WheelCanvas
                participants={state.participants}
                palette={state.wheelSettings.palette}
                rotation={state.currentRotation}
                isSpinning={state.isSpinning}
                size={500}
                showOuterLights={state.wheelSettings.showOuterLights}
              />
            </div>
          </div>

          {/* Controls */}
          <ControlButtons
            onSpin={handleSpin}
            onReset={onResetWheel}
            isSpinning={state.isSpinning}
            isDisabled={
              activeParticipantsCount === 0 ||
              state.adminSettings.isEditingLocked
            }
          />

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm">Participants</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeParticipantsCount}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Spins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {state.history.length}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-lg font-bold text-green-600">
                  {state.isSpinning ? 'Spinning...' : 'Ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {winner && (
        <WinnerDisplay
          winner={winner}
          prize={currentPrize}
          onRemoveWinner={onRemoveWinnerAndContinue}
          onKeepWinner={onKeepWinnerAndContinue}
          onAdvancePrize={
            state.wheelSettings.prizeMode === 'queue'
              ? onAdvancePrizeQueue
              : undefined
          }
          confettiEnabled={state.wheelSettings.confettiEnabled}
        />
      )}
    </div>
  );
};
