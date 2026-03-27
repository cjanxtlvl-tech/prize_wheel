// Core domain types
export type Participant = {
  id: string;
  name: string;
  weight: number;
  active: boolean;
};

export type Prize = {
  id: string;
  label: string;
  active: boolean;
  awardedToParticipantId?: string | null;
  awardedAt?: string | null;
};

export type PrizeMode = 'single' | 'queue';

export type SpinDurationOption = 'quick' | 'normal' | 'long';

export type PaletteOption = 'vibrant' | 'pastel' | 'cool' | 'warm' | 'rainbow';

export type BrandSettings = {
  title: string;
  subtitle: string;
  logoDataUrl: string | null;
  wheelBackgroundImageDataUrl: string | null;
};

export type SpinHistoryEntry = {
  id: string;
  participantId: string;
  participantName: string;
  prizeLabel?: string;
  timestamp: string;
  removedAfterWin: boolean;
};

export type AdminSettings = {
  isAdminMode: boolean;
  isEditingLocked: boolean;
  showAdvancedControls: boolean;
  allowPrizeEditingDuringSession: boolean;
  allowWeightEditing: boolean;
  passcodeEnabled: boolean;
  passcode?: string;
};

export type WheelSettings = {
  spinDuration: SpinDurationOption;
  spinRpm: number;
  palette: PaletteOption;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  showOuterLights: boolean;
  prizeMode: PrizeMode;
  weightedMode: boolean;
};

export type AppState = {
  participants: Participant[];
  prizes: Prize[];
  currentActivePrizeId: string | null;
  singlePrize: string;
  selectedWinnerId: string | null;
  currentRotation: number;
  isSpinning: boolean;
  wheelSettings: WheelSettings;
  brandSettings: BrandSettings;
  adminSettings: AdminSettings;
  history: SpinHistoryEntry[];
};

export type WheelSegment = {
  participantId: string;
  participantName: string;
  startAngle: number;
  endAngle: number;
  weight: number;
  color: string;
};
