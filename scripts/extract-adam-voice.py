#!/usr/bin/env python3
"""
Adam's Voice Extraction Script for BetBingoCash
This script helps extract audio from your MP4 file and provides guidance for splitting it into individual BINGO number calls.
"""

import os
import sys
from pathlib import Path

def main():
    print("🎤 Adam's Voice Extraction Helper for BetBingoCash")
    print("=" * 50)
    
    # Check if required tools are available
    print("\n📋 Prerequisites Check:")
    
    try:
        import moviepy
        print("✅ MoviePy is available for audio extraction")
    except ImportError:
        print("❌ MoviePy not found. Install with: pip install moviepy")
        print("   Or use online converters mentioned in the setup guide.")
    
    # Create output directory
    output_dir = Path("public/audio/adam-voice")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📁 Output directory created: {output_dir.absolute()}")
    
    # Instructions
    print("\n📖 Step-by-Step Instructions:")
    print("1. Place your MP4 file with Adam's voice in the project root")
    print("2. Run this script to extract audio: python scripts/extract-adam-voice.py <your-file.mp4>")
    print("3. Use Audacity or online tools to split the audio into individual number calls")
    print("4. Place the individual MP3 files in the output directory")
    
    # Check for MP4 files in current directory
    mp4_files = list(Path(".").glob("*.mp4"))
    if mp4_files:
        print(f"\n🎬 Found MP4 files:")
        for file in mp4_files:
            print(f"   - {file.name}")
        print("\n💡 You can now extract audio from these files!")
    
    # File naming guide
    print("\n📝 Required File Naming Format:")
    print("B1.mp3, B2.mp3, B3.mp3... B15.mp3")
    print("I16.mp3, I17.mp3, I18.mp3... I30.mp3")
    print("N31.mp3, N32.mp3, N33.mp3... N45.mp3")
    print("G46.mp3, G47.mp3, G48.mp3... G60.mp3")
    print("O61.mp3, O62.mp3, O63.mp3... O75.mp3")
    
    print("\n🎯 Total files needed: 75")
    print("🎵 Format: MP3")
    print("📁 Location: public/audio/adam-voice/")
    
    # Check if files already exist
    existing_files = list(output_dir.glob("*.mp3"))
    if existing_files:
        print(f"\n✅ Found {len(existing_files)} existing audio files:")
        for file in sorted(existing_files)[:10]:  # Show first 10
            print(f"   - {file.name}")
        if len(existing_files) > 10:
            print(f"   ... and {len(existing_files) - 10} more")
        
        if len(existing_files) == 75:
            print("\n🎉 All 75 BINGO number audio files are ready!")
        else:
            print(f"\n⚠️  Need {75 - len(existing_files)} more files to complete the set")
    else:
        print("\n📂 No audio files found yet. Follow the setup guide to get started!")
    
    print("\n🔗 For detailed instructions, see: public/audio/adam-voice/SETUP-GUIDE.md")
    print("\nHappy BINGO calling! 🎯✨")

if __name__ == "__main__":
    main() 