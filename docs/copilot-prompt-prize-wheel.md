# Prize Wheel Copilot Prompt

This document helps AI assistants understand the prize wheel codebase and make consistent contributions.

## Project Overview

**Prize Wheel** is a React + TypeScript web application that lets event organizers create and spin an animated raffle wheel with:

- Weighted participant entries (custom odds)
- Single or multiple prizes
- Company branding
- Shareable URL state
- Admin mode controls
- Sound effects and confetti celebrations

**Technology Stack**: React 18, TypeScript, Vite, Tailwind CSS, SVG, localStorage, Docker + Nginx

---

## Codebase Architecture

### State Management (Hook-Based)

The app uses a single custom hook for all state:

**`src/hooks/usePrizeWheel.ts`**

- Returns `AppState` (master state object)
- Returns functions to modify state (addParticipant, spinWheel, etc.)
- Auto-syncs state to localStorage on every change
- Handles initialization from localStorage or URL query params

```typescript
const wheel = usePrizeWheel(initialState);
wheel.state.participants // [Participant...]
wheel.addParticipant(name) // void
wheel.spinWheel(callback?) // Animates wheel, calls callback on win
```

### Type System

**`src/types/index.ts`**

Core TypeScript types:

- `Participant`: { id, name, weight, active }
- `Prize`: { id, label, active, awardedToParticipantId, awardedAt }
- `AppState`: Master state object containing all app data
- `WheelSegment`: Calculated wedge data (startAngle, endAngle, color)
- `PrizeMode`: 'single' | 'queue'
- `PaletteOption`: 'vibrant' | 'pastel' | 'cool' | 'warm' | 'rainbow'
- `SpinDurationOption`: 'quick' | 'normal' | 'long'

Always import and use these types. Never use `any`.

### Utilities

Modular, pure functions organized by domain:

- **`wheelMath.ts`**: SVG calculations, easing, rotation math
  - Public: `calculateWheelSegments()`, `generateSegmentPath()`, `calculateLabelPosition()`, `calculateFinalRotation()`, `findPointedSegment()`
  - Math functions ensure visual wedges match selection probabilities

- **`weightedRandom.ts`**: Probability selection
  - `selectWeightedRandomWinner()` - Cumulative probability selection
  - Fair: Higher weights = larger wedges = higher selection odds

- **`randomWinner.ts`**: Winner selection from segments
  - `selectWinner()`, `selectRandomSegment()` - Calls weighted random logic

- **`colors.ts`**: Color palettes and helpers
  - `getPalette()`, `getColor()`, `getContrastTextColor()` - Color management

- **`localStorage.ts`**: Storage helpers
  - `saveState()`, `loadState()`, `saveValue()`, `loadValue()` - Persistence

- **`stateEncoding.ts`**: URL state encoding/decoding
  - `encodeStateToUrl()`, `decodeStateFromUrl()`, `createShareUrl()` - Shareable links
  - Uses Base64 encoding for compact URLs

- **`prizeQueue.ts`**: Prize queue operations
  - `getNextPrize()`, `advanceToNextPrize()`, `resetPrizes()` - Queue management

All utilities are **pure functions** (no side effects). Test inputs thoroughly.

### Components

Organized by responsibility:

**Core Wheel**

- `PrizeWheel.tsx` - **Main container**, connects all props and handlers
  - Wires up all child components
  - Manages winner display modal
  - Coordinates state updates with hook
  - This is the "view" that consumes state and dispatches actions

- `WheelCanvas.tsx` - SVG wheel rendering
  - Takes: participants, rotation angle, palette, spin state
  - Renders: SVG wheel with rotating segments, labels, hub, pointer
  - Pure component (no state mutations)

- `Pointer.tsx` - Fixed pointer at wheel top
  - Decorative; indicates currently-pointed segment

**Controls**

- `ControlButtons.tsx` - Spin & Reset buttons
- `WinnerDisplay.tsx` - Winner modal with confetti
  - Uses canvas-confetti library for celebration

**Management Panels**

- `NameEntryPanel.tsx` - Add/edit/remove/shuffle participants
  - Single entry + bulk paste
  - Weight assignment
  - Active toggle
  - Handles validation

- `PrizeQueuePanel.tsx` - Prize queue management (queue mode)
  - Add/remove prizes
  - Mark as awarded
  - Select active prize

- `SettingsPanel.tsx` - Global settings
  - Spin duration, color palette, prize mode
  - Sound, confetti, outer lights toggles
  - Weighted mode toggle

- `AdminPanel.tsx` - Event management
  - Admin mode toggle
  - Editing lock
  - Spin history view
  - Clear history

**Branding**

- `HeaderBrand.tsx` - Event title, subtitle, logo display
- `LogoUploader.tsx` - File upload for logo
  - Converts to Data URL (localStorage compatible)
  - Size validation (max 1MB)

**Utilities**

- `ShareControls.tsx` - Shareable URL button
- `SoundToggle.tsx` - Mute button
- `SoundEffects` - (hook) Web Audio API tone generation

---

## Key Behaviors

### Fair Weighted Selection

**Problem**: Visual wheel wedges must match selection odds.

**Solution**: Two-step process

1. **Segment Calculation** (`wheelMath.ts`):
   ```
   totalWeight = sum of all weights
   segment.angleDegrees = (participant.weight / totalWeight) * 360
   ```

2. **Winner Selection** (`weightedRandom.ts`):
   ```
   random = Math.random() * totalWeight
   cumulativeWeight = 0
   for participant:
     cumulativeWeight += participant.weight
     if random <= cumulativeWeight: return participant
   ```

   The cumulative probability distribution matches the visual distribution.

### Spin Animation

**In `usePrizeWheel.ts` -> `spinWheel()`**:

1. **Pre-select winner** (before animation)
   - Calls `selectRandomSegment()` to pick a target
   - Calculates final rotation angle to align target with pointer
   - Returns `finalRotation` value

2. **Animate wheel**
   - Uses `requestAnimationFrame` to smoothly rotate
   - Applies easing function (`easeOutCubic`) for realism
   - Updates `currentRotation` state frame-by-frame

3. **Post-animation**
   - Sets `selectedWinnerId` when complete
   - Triggers sound effects and confetti
   - Adds entry to history

**Fairness Guarantee**: Winner is chosen BEFORE animation starts, so animations are purely cosmetic.

### Shareable State

**Encoding** (`stateEncoding.ts`):

- Only essential fields included:
  - Participants (name, weight, active)
  - Prizes (label, active)
  - Settings (palette, spinDuration, prizeMode, etc.)
  - Branding text (title, subtitle)
  - **Not included**: Logo (too large), history

- Serialized to JSON → Base64 → URL-safe string

**Decoding**:

- Safely parses Base64 back to JSON
- Regenerates IDs for participants/prizes
- Validates numeric ranges (weights, colors)
- Handles malformed input gracefully

**Why Base64**: Compact, URL-safe, no external dependencies

### Admin Mode (Client-Only)

**Current Implementation**:

- `adminSettings` in state: `{ isAdminMode, isEditingLocked, ... }`
- When `isEditingLocked=true`, input fields are disabled
- History tracked in state; cleared on demand
- No authentication; anyone can toggle modes

**Security Note**: This is UX control, not security. For a production system with real events, add:

- Backend API for admin authentication
- Session tokens (JWT)
- Audit logging
- Secure passcode validation

---

## Development Workflow

### Adding a New Feature

**Example: Add spinner wheel direction (clockwise/counter-clockwise)**

1. **Add to Types** (`src/types/index.ts`):
   ```typescript
   type AppState = {
     wheelRotationDirection: 'cw' | 'ccw'; // Add this
     // ...
   }
   ```

2. **Initialize in Hook** (`src/hooks/usePrizeWheel.ts`):
   ```typescript
   const DEFAULT_STATE: AppState = {
     wheelRotationDirection: 'cw',
     // ...
   };
   
   const setWheelDirection = useCallback((direction) => {
     setState(prev => ({...prev, wheelRotationDirection: direction}));
   }, []);
   ```

3. **Use in Utility** (`src/utils/wheelMath.ts`):
   ```typescript
   export function calculateFinalRotation(..., direction) {
     const multiplier = direction === 'cw' ? 1 : -1;
     // Apply to rotation calc
   }
   ```

4. **Add UI Control** (`src/components/SettingsPanel.tsx`):
   ```jsx
   <select onChange={e => onSetWheelDirection(e.target.value)}>
     <option value="cw">Clockwise</option>
     <option value="ccw">Counter-Clockwise</option>
   </select>
   ```

5. **Wire in Main Component** (`src/components/PrizeWheel.tsx`):
   ```jsx
   onSetWheelDirection={wheelHook.setWheelDirection}
   ```

6. **Test**: Spin wheel both directions; verify animations work

### Modifying Wheel Math

**Guidelines**:

- All calculations in `wheelMath.ts` should be pure (no side effects)
- Comment complex logic (angles, transformations)
- Test edge cases: single participant, many participants, zero weights
- Validate that visual wedges match selection probabilities

Example test:

```typescript
const participants = [{weight: 1}, {weight: 2}, {weight: 1}];
const segments = calculateWheelSegments(participants);
// Verify: segment[0].endAngle - segment[0].startAngle = 90°
//         segment[1].endAngle - segment[1].startAngle = 180°
//         segment[2].endAngle - segment[2].startAngle = 90°
```

### Handling State Changes

Always go through the hook:

```typescript
// ❌ Wrong
state.participants.push(newParticipant);

// ✅ Right
const { addParticipant } = usePrizeWheel();
addParticipant(name);
```

This ensures:

- localStorage sync
- Proper component re-renders
- Consistent state shape
- History tracking

---

## Common Patterns

### Adding a Setting

1. Add to `WheelSettings` in types
2. Add to `DEFAULT_STATE` in hook
3. Add setter function in hook (returns new setState call)
4. Add UI control in `SettingsPanel.tsx`
5. Use state value in component (e.g., `WheelCanvas`)
6. Wire prop in `PrizeWheel.tsx`

### Adding a Participant Action

1. Add function to `usePrizeWheel()` hook
2. Call `setState()` with new state
3. Pass function to `PrizeWheel` as prop
4. Wire to `NameEntryPanel` button/handler
5. Test undo/redo (localStorage should restore)

### Component Responsibilities

- **Containers** (e.g., `PrizeWheel.tsx`): Wire props, coordinate state
- **Presenters** (e.g., `WheelCanvas.tsx`): Render UI, take pure props, no logic
- **Input Components** (e.g., `NameEntryPanel.tsx`): Capture user input, validate, callback
- **Displays** (e.g., `WinnerDisplay.tsx`): Show data, trigger effects, provide actions

---

## Debugging Tips

### State Not Updating

Check:

1. Is the state update happening in the hook?
2. Is localStorage save working? (Check DevTools → Application → localStorage)
3. Is the component re-rendering? (Add console.log in component)
4. Are you passing updated state to children? (Check props)

### Wheel Not Spinning Fairly

Check:

1. Are participant weights all positive integers?
2. Does `calculateWheelSegments()` produce correct angle sums (360°)?
3. Does `selectWeightedRandomWinner()` match visual wedge sizes?
4. Is `calculateFinalRotation()` landing on correct segment?

Verify with:

```typescript
const segments = calculateWheelSegments(participants);
console.log(segments.map(s => s.endAngle - s.startAngle)); // Should sum to 360
```

### URL Share Not Working

Check:

1. Is `encodeStateToUrl()` returning a string?
2. Can you decode it back? (Use `decodeStateFromUrl()`)
3. Are special characters URL-encoded? (Base64 should handle this)
4. Is the URL length reasonable? (Check browser URL length limits)

---

## Testing Checklist

Before deploying:

- [ ] Add 5+ participants with various weights
- [ ] Spin 20+ times; winner distribution matches weights
- [ ] Add single & multiple prizes; both modes work
- [ ] Share URL; open in new tab; state matches
- [ ] Upload logo; persists after refresh
- [ ] Toggle sound/confetti; effects work
- [ ] Lock editing; inputs disabled
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] Performance smooth (60 FPS during spin)

---

## Future-Proofing

### Adding Backend Auth

Replace admin mode with real authentication:

```typescript
// Future: Add auth service
const { authenticateAdmin, getAdminSession } = useAdminAuth();

const handleAdminLogin = async (passcode) => {
  const session = await authenticateAdmin(passcode);
  setAdminSession(session);
}
```

### Cloud State Persistence

Replace localStorage with cloud sync:

```typescript
// Future: Add cloud storage
const { syncStateToCloud, loadStateFromCloud } = useCloudSync();

useEffect(() => {
  syncStateToCloud(state); // Auto-save
}, [state]);
```

### Real-Time Multi-User

Add WebSocket for live collaboration:

```typescript
// Future: Real-time updates
const { broadcastState, subscribeToState } = useWebSocket();
subscribeToState(newState => {
  // Update when other users change state
});
```

---

## Questions?

Refer to:

1. **Code comments** - All complex logic documented
2. **README.md** - High-level architecture & usage
3. **Type definitions** - `src/types/index.ts` for data shape
4. **Hook functions** - `src/hooks/usePrizeWheel.ts` for state API

Good luck! Happy coding! 🎡✨
