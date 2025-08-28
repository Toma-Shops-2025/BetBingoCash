import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAudio } from '@/contexts/AudioContext';
import { Settings, Volume2, VolumeX, Play, Home } from 'lucide-react';

interface GamePauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  onQuit: () => void;
  onAudioSettings: () => void;
  isPaused: boolean;
}

const GamePauseModal: React.FC<GamePauseModalProps> = ({ 
  isOpen, 
  onClose, 
  onResume, 
  onQuit, 
  onAudioSettings,
  isPaused 
}) => {
  const { settings } = useAudio();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-gray-900 border-gray-700" aria-describedby="pause-description">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            {isPaused ? '⏸️ Game Paused' : '🎮 Game Menu'}
          </DialogTitle>
        </DialogHeader>

        <div id="pause-description" className="sr-only">
          Game pause menu with options to resume, quit, or adjust settings
        </div>

        <div className="space-y-4">
          {/* Resume Button */}
          <Button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume Game
          </Button>

          {/* Audio Settings */}
          <Button
            onClick={onAudioSettings}
            variant="outline"
            className="w-full text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white font-bold py-3"
          >
            <Settings className="w-5 h-5 mr-2" />
            Audio Settings
          </Button>

          {/* Audio Status */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="text-white/80 text-sm font-semibold">Audio Status:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                {settings.musicEnabled ? (
                  <Volume2 className="w-3 h-3 text-green-400" />
                ) : (
                  <VolumeX className="w-3 h-3 text-red-400" />
                )}
                <span className={settings.musicEnabled ? 'text-green-400' : 'text-red-400'}>
                  Music
                </span>
              </div>
              <div className="flex items-center gap-1">
                {settings.voiceEnabled ? (
                  <Volume2 className="w-3 h-3 text-green-400" />
                ) : (
                  <VolumeX className="w-3 h-3 text-red-400" />
                )}
                <span className={settings.voiceEnabled ? 'text-green-400' : 'text-red-400'}>
                  Voice
                </span>
              </div>
              <div className="flex items-center gap-1">
                {settings.soundEffectsEnabled ? (
                  <Volume2 className="w-3 h-3 text-green-400" />
                ) : (
                  <VolumeX className="w-3 h-3 text-red-400" />
                )}
                <span className={settings.soundEffectsEnabled ? 'text-green-400' : 'text-red-400'}>
                  Effects
                </span>
              </div>
            </div>
          </div>

          {/* Quit Game */}
          <Button
            onClick={onQuit}
            variant="outline"
            className="w-full text-red-400 border-red-400 hover:bg-red-400 hover:text-white font-bold py-3"
          >
            <Home className="w-5 h-5 mr-2" />
            Quit to Menu
          </Button>
        </div>

        <div className="text-center text-xs text-white/60 pt-2">
          Press ESC to pause/resume the game
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GamePauseModal; 