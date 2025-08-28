# Audio Files for BetBingoCash

This folder should contain the following audio files for the game to work properly:

## Required Audio Files:

### Background Music
- `background-music.mp3` - Looping background music for games

### Sound Effects
- `countdown-beep.mp3` - Beep sound for countdown (3, 2, 1, GO!)
- `game-start.mp3` - Sound when game starts
- `bingo-celebration.mp3` - Celebration sound when BINGO is achieved
- `number-call.mp3` - Sound when a new number is called

## Audio Specifications:
- **Format**: MP3 (recommended) or WAV
- **Quality**: 128kbps or higher for MP3
- **Duration**: 
  - Background music: 2-3 minutes (will loop)
  - Sound effects: 0.5-2 seconds
- **Volume**: Normalized to -14dB LUFS for consistent levels

## Voice Announcements:
The game uses the Web Speech API for voice announcements, so no audio files are needed for:
- Number announcements ("Number 42")
- Game instructions
- BINGO celebrations

## Getting Audio Files:
1. **Free Resources**: 
   - Freesound.org
   - Pixabay Music
   - Zapsplat
2. **Paid Resources**:
   - AudioJungle
   - Pond5
   - PremiumBeat

## File Naming:
Make sure to use the exact filenames listed above, as the game code references these specific names.

## Testing:
After adding audio files, test them in the game's Audio Settings modal to ensure they work correctly. 