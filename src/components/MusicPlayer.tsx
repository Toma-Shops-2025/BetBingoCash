import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  genre: string;
}

const MusicPlayer: React.FC = () => {
  const { settings, updateSettings, playBackgroundMusic, stopBackgroundMusic } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const tracks: Track[] = [
    {
      id: '1',
      title: 'Soft Rock Vibes',
      artist: 'BetBingo',
      src: '/audio/background-music.mp3',
      genre: 'Soft Rock'
    },
    {
      id: '2',
      title: 'Classical Rock Mix',
      artist: 'BetBingo',
      src: '/audio/background-music.mp3',
      genre: 'Classical Rock'
    },
    {
      id: '3',
      title: 'Gaming Atmosphere',
      artist: 'BetBingo',
      src: '/audio/background-music.mp3',
      genre: 'Gaming'
    }
  ];

  const togglePlayPause = () => {
    if (isPlaying) {
      stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      playBackgroundMusic();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleMute = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updateSettings({ backgroundMusicVolume: volume });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Main Music Player */}
      <div className="bg-gradient-to-r from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-3 border border-purple-400/30 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Album Art */}
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">
              {tracks[currentTrack].title}
            </div>
            <div className="text-white/70 text-xs truncate">
              {tracks[currentTrack].artist}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={previousTrack}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title={settings.musicEnabled ? 'Mute' : 'Unmute'}
            >
              {settings.musicEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.backgroundMusicVolume}
              onChange={handleVolumeChange}
              className="w-16 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              title="Volume"
            />
          </div>

          {/* Playlist Toggle */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title="Show Playlist"
          >
            <div className="w-4 h-4 flex flex-col gap-1">
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="mt-3 bg-gradient-to-r from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-3 border border-purple-400/30 shadow-2xl">
          <div className="text-white font-bold text-sm mb-3">Playlist</div>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrack(index)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  index === currentTrack
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-sm">{track.title}</div>
                <div className="text-xs opacity-70">{track.artist} • {track.genre}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer; 