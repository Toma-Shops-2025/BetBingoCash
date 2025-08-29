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
  const [showServices, setShowServices] = useState(true); // Show services by default
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  // Spotify Web Playback SDK integration
  useEffect(() => {
    // Check if Spotify is available
    if (typeof window !== 'undefined' && (window as any).Spotify) {
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
      <div className="bg-gradient-to-r from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Service Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${currentServiceData?.color} rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`} onClick={openStreamingService}>
            <span className="text-3xl">{currentServiceData?.icon}</span>
          </div>

          {/* Service Info */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-lg truncate">
              {currentServiceData?.name}
            </div>
            <div className="text-white/70 text-sm truncate">
              {currentServiceData?.description}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={openStreamingService}
              className="p-3 text-white/70 hover:text-white transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowServices(!showServices)}
              className="p-3 text-white/70 hover:text-white transition-colors"
              title={showServices ? 'Hide Services' : 'Show Services'}
            >
              <Radio className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-3 text-white/70 hover:text-white transition-colors"
              title={settings.musicEnabled ? 'Mute' : 'Unmute'}
            >
              {settings.musicEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.backgroundMusicVolume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              title="Volume"
            />
          </div>
        </div>
      </div>

      {/* Streaming Services Selection */}
      {showServices && (
        <div className="mt-3 bg-gradient-to-r from-purple-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 shadow-2xl">
          <div className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            🎵 Music Ready
          </div>
          <p className="text-white/80 text-sm mb-4">
            Connect your favorite music platform to enjoy music while playing BetBingo, just like Google Maps!
          </p>
          <div className="space-y-3">
            {streamingServices.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setCurrentService(service.id);
                  openStreamingService();
                }}
                className={`w-full p-4 rounded-xl transition-all duration-200 text-left border-2 ${
                  service.id === currentService
                    ? 'bg-white/20 text-white border-purple-400'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <div className="font-bold text-white">{service.name}</div>
                      <div className="text-sm opacity-70">{service.description}</div>
                    </div>
                  </div>
                  <div className="text-white/60">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowServices(false)}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Hide Services
            </button>
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style>{`
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