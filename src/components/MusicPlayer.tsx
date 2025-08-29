import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack, ExternalLink, Radio, Headphones } from 'lucide-react';

interface StreamingService {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
  description: string;
  hasIntegration: boolean;
}

const MusicPlayer: React.FC = () => {
  const { settings, updateSettings, playBackgroundMusic, stopBackgroundMusic } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentService, setCurrentService] = useState<string>('spotify');
  const [showServices, setShowServices] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  // Spotify Web Playback SDK integration
  useEffect(() => {
    // Check if Spotify is available
    if (window.Spotify) {
      setSpotifyConnected(true);
    }
  }, []);

  const connectSpotify = () => {
    const clientId = 'your-spotify-client-id'; // You'll need to register your app with Spotify
    const redirectUri = `${window.location.origin}/spotify-callback`;
    const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.open(authUrl, '_blank');
  };

  const streamingServices: StreamingService[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      icon: '🎵',
      color: 'from-green-500 to-green-600',
      url: 'https://open.spotify.com',
      description: 'Stream your favorite playlists and discover new music',
      hasIntegration: true
    },
    {
      id: 'pandora',
      name: 'Pandora',
      icon: '📻',
      color: 'from-blue-500 to-blue-600',
      url: 'https://www.pandora.com',
      description: 'Personalized radio stations based on your taste',
      hasIntegration: false
    },
    {
      id: 'apple-music',
      name: 'Apple Music',
      icon: '🍎',
      color: 'from-pink-500 to-pink-600',
      url: 'https://music.apple.com',
      description: 'Stream millions of songs and curated playlists',
      hasIntegration: false
    },
    {
      id: 'youtube-music',
      name: 'YouTube Music',
      icon: '📺',
      color: 'from-red-500 to-red-600',
      url: 'https://music.youtube.com',
      description: 'Music videos and audio from YouTube',
      hasIntegration: false
    },
    {
      id: 'amazon-music',
      name: 'Amazon Music',
      icon: '📦',
      color: 'from-orange-500 to-orange-600',
      url: 'https://music.amazon.com',
      description: 'Stream music with Amazon Prime benefits',
      hasIntegration: false
    },
    {
      id: 'tidal',
      name: 'Tidal',
      icon: '🌊',
      color: 'from-cyan-500 to-cyan-600',
      url: 'https://tidal.com',
      description: 'High-fidelity music streaming service',
      hasIntegration: false
    }
  ];

  const currentServiceData = streamingServices.find(s => s.id === currentService);

  const openStreamingService = () => {
    if (currentServiceData) {
      window.open(currentServiceData.url, '_blank');
    }
  };

  const togglePlayPause = () => {
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
          {/* Service Icon */}
          <div className={`w-12 h-12 bg-gradient-to-r ${currentServiceData?.color} rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`} onClick={openStreamingService}>
            <span className="text-2xl">{currentServiceData?.icon}</span>
          </div>

          {/* Service Info */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">
              {currentServiceData?.name}
            </div>
            <div className="text-white/70 text-xs truncate">
              {currentServiceData?.description}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
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
              onClick={openStreamingService}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
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

          {/* Services Toggle */}
          <button
            onClick={() => setShowServices(!showServices)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title="Choose Music Service"
          >
            <Radio className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Streaming Services Selection */}
      {showServices && (
        <div className="mt-3 bg-gradient-to-r from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-3 border border-purple-400/30 shadow-2xl">
          <div className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Choose Your Music Service
          </div>
          <div className="grid grid-cols-2 gap-2">
            {streamingServices.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setCurrentService(service.id);
                  setShowServices(false);
                }}
                className={`p-3 rounded-lg transition-all duration-200 text-left ${
                  service.id === currentService
                    ? 'bg-white/20 text-white border-2 border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{service.icon}</span>
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <div className="text-xs opacity-70 leading-tight">{service.description}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={openStreamingService}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200"
            >
              🚀 Open {currentServiceData?.name}
            </button>
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