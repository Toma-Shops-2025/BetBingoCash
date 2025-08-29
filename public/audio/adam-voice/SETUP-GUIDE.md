# Adam's Voice Setup Guide for BetBingoCash 🎤

## Overview
This guide will help you extract Adam's voice from your MP4 file and set up the BINGO number calling system.

## What You Need
- Your MP4 file with Adam's voice calling BINGO numbers B1 through O75
- Audio editing software (free options provided below)
- Basic understanding of file management

## Step 1: Extract Audio from MP4
### Option A: Online Converter (Easiest)
1. Go to [Online Audio Converter](https://online-audio-converter.com/)
2. Upload your MP4 file
3. Convert to MP3 format
4. Download the MP3 file

### Option B: Desktop Software (Better Quality)
- **Windows**: Use [Audacity](https://www.audacityteam.org/) (Free)
- **Mac**: Use [GarageBand](https://www.apple.com/mac/garageband/) (Free)
- **Linux**: Use [Audacity](https://www.audacityteam.org/) (Free)

## Step 2: Split Audio into Individual Number Calls
### Using Audacity (Recommended)
1. Open Audacity
2. Import your MP3 file
3. Listen to the audio and identify where each number starts
4. Use the Selection Tool to highlight each number call
5. Export Selection as MP3 with the filename format:
   - B1.mp3, B2.mp3, B3.mp3... B15.mp3
   - I16.mp3, I17.mp3, I18.mp3... I30.mp3
   - N31.mp3, N32.mp3, N33.mp3... N45.mp3
   - G46.mp3, G47.mp3, G48.mp3... G60.mp3
   - O61.mp3, O62.mp3, O63.mp3... O75.mp3

### Alternative: Use Online Audio Splitter
1. Go to [Audio Trimmer](https://audiotrimmer.com/)
2. Upload your MP3
3. Split into 75 individual files
4. Rename each file according to the format above

## Step 3: Place Audio Files
1. Put all 75 MP3 files in the `public/audio/adam-voice/` folder
2. Ensure the filenames match exactly: B1.mp3, I19.mp3, N31.mp3, etc.
3. Verify all files are MP3 format

## Step 4: Test the System
1. Start a BINGO game
2. Listen for Adam's voice calling numbers
3. Each number should play Adam's voice saying "B1", "I19", "N31", etc.

## File Structure
```
public/audio/adam-voice/
├── B1.mp3
├── B2.mp3
├── B3.mp3
├── ...
├── I16.mp3
├── I17.mp3
├── ...
├── N31.mp3
├── N32.mp3
├── ...
├── G46.mp3
├── G47.mp3
├── ...
├── O61.mp3
├── O62.mp3
├── ...
└── O75.mp3
```

## Troubleshooting
### No Sound
- Check that audio files are in the correct folder
- Verify filenames match exactly (case-sensitive)
- Ensure files are MP3 format
- Check browser console for errors

### Wrong Numbers Playing
- Verify filename format: Letter + Number + .mp3
- Check that B1.mp3 contains Adam saying "B1"
- Ensure no extra spaces in filenames

### Fallback to TTS
- If Adam's voice fails, the system automatically uses text-to-speech
- This ensures the game continues working even if some audio files are missing

## Audio Quality Tips
- Keep individual files under 2 seconds each
- Use consistent volume levels across all files
- Ensure clear pronunciation of each number
- Test on different devices and browsers

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify all 75 audio files are present
3. Test with a few files first before processing all 75
4. Ensure MP3 files are not corrupted

## Expected Result
Once set up correctly, players will hear Adam's professional voice calling out each BINGO number, creating an engaging and authentic gaming experience! 🎯✨ 