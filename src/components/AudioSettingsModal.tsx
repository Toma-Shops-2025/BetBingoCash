import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX, Music, Mic, Zap } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, playSoundEffect } = useAudio();

  const handleToggle = (key: keyof typeof settings) => {
    if (key.includes('Enabled')) {
      updateSettings({ [key]: !settings[key] });
      
      // Play test sound if enabling
      if (!settings[key] && key === 'soundEffectsEnabled') {
        setTimeout(() => playSoundEffect('countdown-beep'), 100);
      }
    }
  };

  const handleVolumeChange = (key: keyof typeof settings, value: number[]) => {
    updateSettings({ [key]: value[0] / 100 });
  };

  const testSound = () => {
    playSoundEffect('countdown-beep');
  };

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Testing voice announcement');
      utterance.volume = settings.voiceVolume;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700" aria-describedby="audio-settings-description">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            🔊 Audio Settings
          </DialogTitle>
        </DialogHeader>

        <div id="audio-settings-description" className="sr-only">
          Configure audio settings for music, voice announcements, and sound effects
        </div>

        <div className="space-y-6">
          {/* Background Music */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-6 h-6 text-purple-400" />
                <Label className="text-white font-semibold">Background Music</Label>
              </div>
              <Switch
                checked={settings.musicEnabled}
                onCheckedChange={() => handleToggle('musicEnabled')}
              />
            </div>
            
            {settings.musicEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>Volume</span>
                  <span>{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <Slider
                  value={[settings.musicVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('musicVolume', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Voice Announcements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-6 h-6 text-blue-400" />
                <Label className="text-white font-semibold">Voice Announcements</Label>
              </div>
              <Switch
                checked={settings.voiceEnabled}
                onCheckedChange={() => handleToggle('voiceEnabled')}
              />
            </div>
            
            {settings.voiceEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>Volume</span>
                  <span>{Math.round(settings.voiceVolume * 100)}%</span>
                </div>
                <Slider
                  value={[settings.voiceVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('voiceVolume', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <Button
                  onClick={testVoice}
                  variant="outline"
                  size="sm"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  Test Voice
                </Button>
              </div>
            )}
          </div>

          {/* Sound Effects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <Label className="text-white font-semibold">Sound Effects</Label>
              </div>
              <Switch
                checked={settings.soundEffectsEnabled}
                onCheckedChange={() => handleToggle('soundEffectsEnabled')}
              />
            </div>
            
            {settings.soundEffectsEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>Volume</span>
                  <span>{Math.round(settings.soundEffectsVolume * 100)}%</span>
                </div>
                <Slider
                  value={[settings.soundEffectsVolume * 100]}
                  onValueChange={(value) => handleVolumeChange('soundEffectsVolume', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <Button
                  onClick={testSound}
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                >
                  Test Sound
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  updateSettings({
                    musicEnabled: true,
                    voiceEnabled: true,
                    soundEffectsEnabled: true,
                    musicVolume: 0.7,
                    voiceVolume: 0.8,
                    soundEffectsVolume: 0.6,
                  });
                }}
                variant="outline"
                className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
              >
                Reset to Default
              </Button>
              <Button
                onClick={() => {
                  updateSettings({
                    musicEnabled: false,
                    voiceEnabled: false,
                    soundEffectsEnabled: false,
                  });
                }}
                variant="outline"
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                Mute All
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioSettingsModal; 