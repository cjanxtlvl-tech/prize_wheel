# 🎡 Prize Wheel

A polished, production-ready digital raffle prize wheel web application built with React, TypeScript, and Vite. Perfect for game shows, corporate giveaways, raffles, and live events.

## Features

✨ **Core Features**

- **Weighted Participant Entries**: Assign custom odds to participants; higher weights increase selection probability
- **Single or Multiple Prizes**: Support both single-prize mode and a managed prize queue
- **Company Branding**: Upload and display custom logos, event titles, and subtitles
- **Beautiful Animations**: Smooth spin animations with configurable duration (quick/normal/long)
- **Sound Effects**: Game-show style sound effects (tick during spin, celebration on win)
- **Confetti Celebrations**: Automatic confetti animation when a winner is selected
- **Responsive Wheel**: SVG-based wheel rendering with color palettes and participant names
- **Shareable URLs**: Encode and share wheel configurations via URL
- **Admin Mode**: Lock editing, view history, and manage event state during live runs
- **localStorage Persistence**: All state automatically saved and restored
- **Mobile Friendly**: Responsive design works on desktop and tablets

## Project Structure

```
prize-wheel/
├── src/
│   ├── components/           # React components
│   │   ├── PrizeWheel.tsx    # Main container component
│   │   ├── WheelCanvas.tsx   # SVG wheel rendering
│   │   ├── Pointer.tsx       # Top pointer indicator
│   │   ├── WinnerDisplay.tsx # Winner modal
│   │   ├── NameEntryPanel.tsx # Participant management
│   │   ├── PrizeInput.tsx    # Prize management
│   │   ├── PrizeQueuePanel.tsx # Prize queue UI
│   │   ├── ControlButtons.tsx # Spin/Reset controls
│   │   ├── SettingsPanel.tsx # Wheel settings
│   │   ├── AdminPanel.tsx    # Admin controls
│   │   ├── HeaderBrand.tsx   # Branding header
│   │   ├── LogoUploader.tsx  # Logo upload
│   │   ├── ShareControls.tsx # URL sharing
│   │   └── SoundToggle.tsx   # Sound mute button
│   ├── hooks/                # Custom React hooks
│   │   ├── usePrizeWheel.ts  # Main state management
│   │   ├── useLocalStorage.ts # localStorage integration
│   │   ├── useShareableState.ts # URL state encoding
│   │   └── useSoundEffects.ts # Sound management
│   ├── utils/                # Utility functions
│   │   ├── wheelMath.ts      # Wheel calculations
│   │   ├── weightedRandom.ts # Weighted selection
│   │   ├── randomWinner.ts   # Winner selection
│   │   ├── colors.ts         # Color palettes
│   │   ├── localStorage.ts   # Storage helpers
│   │   ├── stateEncoding.ts  # URL state encoding
│   │   └── prizeQueue.ts     # Prize queue logic
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind styles
├── public/                   # Static assets
├── index.html                # HTML template
├── Dockerfile                # Docker build configuration
├── docker-compose.yml        # Docker compose setup
├── nginx.conf                # Nginx SPA configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast, modern bundler)
- **Styling**: Tailwind CSS (utility-first CSS)
- **State Management**: React Hooks (no Redux needed)
- **Storage**: localStorage (client-side, no backend)
- **Animation**: CSS + SVG transforms + canvas-confetti
- **Sound**: Web Audio API (dynamic tone generation)
- **Deployment**: Docker + Nginx

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for deployment)

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Opens http://localhost:5173 in your browser

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

### Quick Start Guide

1. **Add Participants**
   - Enter names one at a time, or paste multiple names separated by line breaks
   - Optionally set custom weights (default: 1)
   - Use "Shuffle" to randomize order

2. **Set Up Prize(s)**
   - **Single Prize Mode**: Enter one prize that will be awarded
   - **Queue Mode**: Add multiple prizes; the next available prize is awarded with each spin

3. **Customize Appearance**
   - Edit brandingtitle, subtitle
   - Upload a company logo
   - Choose a color palette (Vibrant, Pastel, Cool, Warm, Rainbow)

4. **Configure Settings**
   - **Spin Duration**: Quick (6s), Normal (11s), or Long (19s)
   - **Sound**: Enable/disable sound effects
   - **Confetti**: Enable/disable celebration animation
   - **Weighted Mode**: Toggle to enable/disable weighted odds display

5. **Admin Mode** (for live events)
   - Enable "Admin Mode" to access event controls
   - Toggle "Lock Editing" to prevent accidental changes during the event
   - View spin history and clear history as needed

6. **Spin the Wheel**
   - Click "SPIN" to animate the wheel
   - Winner is selected fairly before animation starts
   - Winner modal appears with celebration effects

7. **Handle Winners**
   - **Keep & Continue**: Keep winner in the pool for future spins
   - **Remove & Continue**: Remove winner from participant list
   - **Next Prize** (Queue Mode): Advance to next prize in queue

## Weighted Entries Explained

Each participant has a **weight** value (default: 1). The wheel distributes wedges proportionally to weights:

- Participant A: weight 1 → 25% of wheel
- Participant B: weight 2 → 50% of wheel
- Participant C: weight 1 → 25% of wheel

When spinning, the selection algorithm uses cumulative probabilities to ensure the visual wedge size matches selection probability. **This provides fair yet flexible odds adjustment.**

### Example: VIP Participant

If you want one participant to have double the odds, set their weight to 2 while others remain at 1.

## Shareable URLs

Click "Copy Share Link" to create a URL that encodes the current state:

- Participants, weights, and names
- Single prize or prize queue
- Color palette
- Spin duration
- Branding text

**Example Share Link:**
```
https://yourserver.com/prizne-wheel/?state=eyJwYXJ0aWNpcGFudHMi...
```

When someone opens the link, the wheel reconstructs with your shared configuration.

**Note**: Uploaded logos are not included in the URL (too large). They are restored from localStorage if the user has previously visited.

## URL State Encoding

The `stateEncoding.ts` utility provides:

- `encodeStateToUrl()` - Converts app state to compact Base64 string
- `decodeStateFromUrl()` - Safely decodes and validates URL state
- `createShareUrl()` - Builds shareable link
- `updateUrlWithState()` - Updates browser URL without page reload

The encoding is explicitly safe:
- No sensitive data in URLs
- Malformed input is handled gracefully
- Binary data (logos) excluded

## Admin Mode (Non-Secure)

⚠️ **Important**: Admin mode is **client-side only** and not cryptographically secure.

**For Version 1**, admin features include:

- Lock editing during live events (prevents accidental changes)
- View recent spin history
- Clear history
- Toggle advanced controls

**For Production Backends** (future):

To add real authentication, implement:

1. Passcode validation on server
2. Session tokens for admin access
3. Audit logging on backend
4. Protected API endpoints for sensitive operations

Current implementation serves event operators who need UX controls, not security boundaries.

## API Reference

### Hook: usePrizeWheel()

Returns all state and functions to manage the wheel:

```typescript
const wheel = usePrizeWheel();

// State
wheel.state.participants
wheel.state.prizes
wheel.state.selectedWinnerId
wheel.state.isSpinning
// ...more

// Functions
wheel.addParticipant(name)
wheel.removeParticipant(id)
wheel.setParticipantWeight(id, weight)
wheel.addPrize(label)
wheel.removePrize(id)
wheel.spinWheel(onComplete)
wheel.removeWinnerAndContinue()
wheel.toggleAdminMode()
// ...more
```

### Utility: wheelMath.ts

Core wheel calculations:

- `calculateWheelSegments()` - Generate segments from participants
- `generateSegmentPath()` - SVG path for a wedge
- `calculateLabelPosition()` - Text placement inside wedges
- `calculateFinalRotation()` - Final angle for target segment
- `findPointedSegment()` - Determine winner from rotation angle

### Utility: weightedRandom.ts

Fair selection with weights:

- `selectWeightedRandomWinner()` - Pick winner using cumulative probability
- `calculateWinProbability()` - Get participant's odds percentage
- `validateWeights()` - Check weights are valid/reasonable

## Server Deployment

### Docker Build & Run

```bash
# Build image
docker build -t prize-wheel .

# Run container
docker run -p 8080:80 prize-wheel

# Open http://localhost:8080
```

### Docker Compose

```bash
# Start service
docker compose up --build

# Open http://localhost:8080

# Stop service
docker compose down
```

### Manual Nginx Deployment

```bash
# Build app
npm run build

# Copy dist/ to web server root
cp -r dist/* /var/www/html/

# Use nginx.conf as base (adjust server name, paths)
```

The included `nginx.conf`:

- Serves static files with caching headers
- Falls back to `index.html` for SPA routing
- Enables gzip compression
- Sets security headers
- Includes health check endpoint

## Configuration

### Environment Variables

Currently, the app is client-side only. For future backend integration:

```bash
VITE_API_URL=https://api.example.com
VITE_ENABLE_AUTH=true
```

Add these to `.env` and access via `import.meta.env.VITE_*`.

## Customization

### Color Palettes

Defined in `src/utils/colors.ts`. Add custom palettes:

```typescript
const PALETTES: Record<PaletteOption, string[]> = {
  myPalette: ['#FF5733', '#33FF57', '#3357FF', /* ... */],
};
```

### Wheel Size

Adjust in `WheelCanvas.tsx`:

```typescript
<WheelCanvas ... size={600} />  // Default 500
```

### Spin Duration

Add custom durations in `wheelMath.ts`:

```typescript
export function getSpinDurationMs(duration) {
  // Add 'superlong'
}
```

### Sound Effects

Customize in `useSoundEffects.ts`:

- `playTick()` - Wheel tick sound
- `playCelebration()` - Winner celebration
- `playError()` - Error beep

Currently uses Web Audio API for dynamic tone generation. Can replace with sound file URLs.

## Performance

- **Small bundle**: ~200KB gzipped (Vite optimization)
- **Fast startup**: < 1s cold load, < 100ms hot reload
- **Smooth animations**: 60 FPS spin animations using requestAnimationFrame
- **Efficient rendering**: SVG + CSS transforms avoid layout thrashing

### Lighthouse Metrics

Target scores when built & deployed:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 12+, Android Chrome 80+

## Known Limitations

1. **Logo Persistence**: Uploaded logos are NOT encoded in share URLs (too large). Users must re-upload after opening a shared link.
2. **Admin Authentication**: No backend auth; admin mode is UI-level only.
3. **Prize History**: History is client-side only; clearing browser data removes it.
4. **Concurrent Users**: No real-time sync; each user has independent state.

## Future Enhancements

### Short Term

- [ ] CSV import/export for participants
- [ ] Multiple theme presets
- [ ] Customizable sound files
- [ ] Touch gesture support (swipe to spin)

### Medium Term

- [ ] Backend API for state persistence
- [ ] Real admin authentication (JWT tokens)
- [ ] Multi-user live events with WebSocket sync
- [ ] Participant photos/avatars
- [ ] Broadcast mode (display-only for audience)

### Long Term

- [ ] OBS/Streamlabs integration
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Scheduled events
- [ ] Team/organization management

## Contributing

This is an open-source project. Contributions welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Formatting**: Consistent indentation, clear variable names
- **Comments**: Explain complex logic (wheel math, weighted random)
- **Tests**: Add tests for new utilities and hooks

## License

MIT License - free to use, modify, and distribute.

## Troubleshooting

### Wheel won't spin

- **Cause**: No active participants
- **Fix**: Add at least one participant and ensure "active" checkbox is checked

### Sound not working

- **Cause**: Browser autoplay policy, or sound disabled
- **Fix**: Enable sound toggle, ensure speaker is on, check browser permissions

### Share link doesn't work

- **Cause**: Encoding error or URL is too long
- **Fix**: Reduce number of participants or rename to shorter strings

### Confetti not showing

- **Cause**: canvas-confetti library not loaded, or disabled
- **Fix**: Check browser console for errors, enable confetti toggle in settings

### Performance lag on mobile

- **Cause**: Large number of participants (50+) or older device
- **Fix**: Reduce participant count, use smaller wheel size, disable outer lights

## Support

For bugs or feature requests, open an issue on GitHub.

For questions, refer to this README or code comments.

## Credits

Built with:

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **canvas-confetti** - Celebration effects
- **nginx** - Web server

---

**Made with ❤️ for event organizers worldwide**

Happy spinning! 🎡✨
