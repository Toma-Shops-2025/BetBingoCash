import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX, Music, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MusicPlayer: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    playBackgroundMusic, 
    stopBackgroundMusic,
    setGameMusicMode 
  } = useAudio();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Start background music when component mounts
  useEffect(() => {
    if (settings.musicEnabled) {
      // Small delay to ensure audio context is ready
      const timer = setTimeout(() => {
        playBackgroundMusic();
        setIsPlaying(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [settings.musicEnabled, playBackgroundMusic]);

  const toggleMusic = () => {
    if (isPlaying) {
      stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      playBackgroundMusic();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled });
    if (settings.musicEnabled) {
      stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      playBackgroundMusic();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (volume: number) => {
    updateSettings({ backgroundMusicVolume: volume });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Music Button */}
      <Button
        onClick={() => setShowControls(!showControls)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-14 h-14 shadow-2xl border-2 border-white/20 backdrop-blur-sm"
        title="Music Controls"
      >
        <Music className="w-6 h-6" />
      </Button>

      {/* Extended Controls Panel */}
      {showControls && (
        <div className="absolute bottom-16 right-0 bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 shadow-2xl min-w-64">
          <div className="text-white font-bold text-center mb-4">🎵 Background Music</div>
          
          {/* Play/Pause Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={toggleMusic}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full w-12 h-12"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mute Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={toggleMute}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white rounded-full w-12 h-12"
            >
              {settings.musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>

          {/* Volume Slider */}
          <div className="mb-4">
            <div className="text-white text-sm mb-2 text-center">Volume</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.backgroundMusicVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center text-white/60 text-xs mt-1">
              {Math.round(settings.backgroundMusicVolume * 100)}%
            </div>
          </div>

          {/* Music Options */}
          <div className="mb-4">
            <div className="text-white text-sm mb-2 text-center">Music Type</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => updateSettings({ backgroundMusicVolume: 0.3 })}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
              >
                Ambient
              </button>
              <button
                onClick={() => updateSettings({ backgroundMusicVolume: 0.1 })}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                Soft
              </button>
              <button
                onClick={() => updateSettings({ backgroundMusicVolume: 0 })}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-lg transition-colors"
              >
                Off
              </button>
            </div>
          </div>

          {/* Test Audio Button */}
          <div className="mb-4">
            <div className="text-white text-sm mb-2 text-center">Test Audio</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  // Force recreate the fallback music
                  stopBackgroundMusic();
                  setIsPlaying(false);
                  setTimeout(() => {
                    if (settings.musicEnabled) {
                      playBackgroundMusic();
                      setIsPlaying(true);
                    }
                  }, 200);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                🔄 Restart Music
              </button>
              <button
                onClick={() => {
                  // Play a test tone
                  try {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A note
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
                    
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 1);
                    
                    console.log('Test tone played');
                  } catch (error) {
                    console.warn('Could not play test tone:', error);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                🔊 Test Tone
              </button>
            </div>
          </div>

          {/* Music Status */}
          <div className="text-center">
            <div className={`text-sm font-medium ${
              isPlaying ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPlaying ? '🎵 Music Playing' : '🔇 Music Stopped'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {settings.musicEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowControls(false)}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer; 