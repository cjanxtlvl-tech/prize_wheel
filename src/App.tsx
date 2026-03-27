import { PrizeWheel } from './components/PrizeWheel';
import { usePrizeWheel } from './hooks/usePrizeWheel';
import { getStateFromQueryParams } from './utils/stateEncoding';

function App() {
  const wheelHook = usePrizeWheel(getStateFromQueryParams() || undefined);

  return (
    <PrizeWheel
      state={wheelHook.state}
      onSpinWheel={wheelHook.spinWheel}
      onAddParticipant={wheelHook.addParticipant}
      onUpdateParticipant={wheelHook.updateParticipant}
      onRemoveParticipant={wheelHook.removeParticipant}
      onClearParticipants={wheelHook.clearParticipants}
      onShuffleParticipants={wheelHook.shuffleParticipants}
      onSetParticipantWeight={wheelHook.setParticipantWeight}
      onAddPrize={wheelHook.addPrize}
      onUpdatePrize={wheelHook.updatePrize}
      onRemovePrize={wheelHook.removePrize}
      onSetActivePrize={wheelHook.setActivePrize}
      onAdvancePrizeQueue={wheelHook.advancePrizeQueue}
      onSetLogo={wheelHook.setLogo}
      onSetSinglePrize={wheelHook.setSinglePrize}
      onClearLogo={wheelHook.clearLogo}
      onSetBrandTitle={wheelHook.setBrandTitle}
      onSetBrandSubtitle={wheelHook.setBrandSubtitle}
      onRemoveWinnerAndContinue={wheelHook.removeWinnerAndContinue}
      onKeepWinnerAndContinue={wheelHook.keepWinnerAndContinue}
      onResetWheel={wheelHook.resetWheel}
      onToggleAdminMode={wheelHook.toggleAdminMode}
      onSetEditingLocked={wheelHook.setEditingLocked}
      onSetSoundEnabled={wheelHook.setSoundEnabled}
      onSetConfettiEnabled={wheelHook.setConfettiEnabled}
      onSetSpinDuration={wheelHook.setSpinDuration}
      onSetSpinRpm={wheelHook.setSpinRpm}
      onSetPalette={wheelHook.setPalette}
      onSetPrizeMode={wheelHook.setPrizeMode}
      onSetWeightedMode={wheelHook.setWeightedMode}
      onSetBackgroundImage={wheelHook.setBackgroundImage}
      onClearHistory={wheelHook.clearHistory}
    />
  );
}

export default App;
