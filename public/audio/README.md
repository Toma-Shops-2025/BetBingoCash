# Audio Files for BetBingoCash

This folder should contain the following audio files for the game to work properly:

## Required Audio Files:

### Background Music
- `background-music.mp3` - **SOFT ROCK/CLASSICAL ROCK** for ambient background music
  - **Duration**: 3-5 minutes (will loop seamlessly)
  - **Volume**: Designed for soft background ambiance
  - **Style**: Soft rock, classic rock, or instrumental
  - **Loop**: Should loop seamlessly without gaps

### Sound Effects
- `countdown-beep.mp3` - Beep sound for countdown (3, 2, 1, GO!)
- `game-start.mp3` - Sound when game starts
- `bingo-celebration.mp3` - Celebration sound when BINGO is achieved
- `number-call.mp3` - Sound when a new number is called

## 🎵 Dynamic Music System:

### **Background Mode (Soft Volume):**
- **Volume**: 30% (soft ambient music)
- **When**: App loading, browsing, not playing games
- **Purpose**: Create atmosphere without being distracting

### **Game Mode (Louder Volume):**
- **Volume**: 60% (more prominent during gameplay)
- **When**: Active games, countdown, gameplay
- **Purpose**: Enhance gaming experience and excitement

### **Volume Balancing:**
- **Background**: 30% - Soft, ambient, non-intrusive
- **Game**: 60% - Louder, engaging, but not overwhelming
- **Sound Effects**: 60% - Clear and audible
- **Voice**: 80% - Crystal clear announcements

## Audio Specifications:
- **Format**: MP3 (recommended) or WAV
- **Quality**: 128kbps or higher for MP3
- **Duration**: 
  - Background music: 3-5 minutes (will loop seamlessly)
  - Sound effects: 0.5-2 seconds
- **Volume**: Normalized to -14dB LUFS for consistent levels
- **Loop**: Background music must loop seamlessly

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

## 🎯 **Background Music Requirements:**
- **Genre**: Soft rock, classic rock, or instrumental
- **Mood**: Upbeat but not aggressive
- **Tempo**: Medium (80-120 BPM)
- **Loop**: Must loop seamlessly
- **Volume**: Designed for background use
- **Length**: 3-5 minutes for variety

## File Naming:
Make sure to use the exact filenames listed above, as the game code references these specific names.

## Testing:
After adding audio files, test them in the game's Audio Settings modal to ensure they work correctly.

## 🎮 **How It Works:**
1. **App loads** → Background music starts at 30% volume
2. **Game starts** → Music increases to 60% volume
3. **Game ends** → Music returns to 30% volume
4. **Pause game** → Music returns to 30% volume
5. **Resume game** → Music increases to 60% volume 