import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Star, Shield, Target, Flame, Crown, Gift, Coins, DollarSign, Sparkles, Rocket } from 'lucide-react';

interface BonusSystemProps {
  onBonusActivated?: (bonusType: string) => void;
}

const BonusSystem: React.FC<BonusSystemProps> = ({ onBonusActivated }) => {
  const { gems, updateGems, balance, updateBalance } = useAppContext();
  const [activeBonuses, setActiveBonuses] = useState<string[]>([]);
  const [bonusCooldowns, setBonusCooldowns] = useState<{ [key: string]: number }>({});

  // Available Bonuses
  const availableBonuses = [
    {
      id: 'triple-daub',
      name: 'Triple Daub',
      description: 'Mark 3 numbers at once',
      icon: <Target className="w-6 h-6" />,
      cost: 50,
      duration: 30,
      color: 'from-red-400 to-pink-500',
      effect: 'triple_daub'
    },
    {
      id: 'lightning-speed',
      name: 'Lightning Speed',
      description: 'Numbers called 2x faster',
      icon: <Zap className="w-6 h-6" />,
      cost: 75,
      duration: 45,
      color: 'from-yellow-400 to-orange-500',
      effect: 'speed_boost'
    },
    {
      id: 'shield-protection',
      name: 'Shield Protection',
      description: 'Immune to negative effects',
      icon: <Shield className="w-6 h-6" />,
      cost: 100,
      duration: 60,
      color: 'from-blue-400 to-cyan-500',
      effect: 'protection'
    },
    {
      id: 'flame-burst',
      name: 'Flame Burst',
      description: 'Auto-mark surrounding numbers',
      icon: <Flame className="w-6 h-6" />,
      cost: 125,
      duration: 40,
      color: 'from-orange-400 to-red-500',
      effect: 'auto_mark'
    },
    {
      id: 'star-power',
      name: 'Star Power',
      description: 'Guaranteed BINGO line',
      icon: <Star className="w-6 h-6" />,
      cost: 200,
      duration: 20,
      color: 'from-purple-400 to-pink-500',
      effect: 'guaranteed_bingo'
    },
    {
      id: 'crown-multiplier',
      name: 'Crown Multiplier',
      description: '2x prize multiplier',
      icon: <Crown className="w-6 h-6" />,
      cost: 300,
      duration: 90,
      color: 'from-yellow-400 to-amber-500',
      effect: 'prize_multiplier'
    }
  ];

  // Daily Bonuses
  const dailyBonuses = [
    {
      id: 'daily-login',
      name: 'Daily Login Bonus',
      description: 'Free gems and cash every day',
      icon: <Gift className="w-6 h-6" />,
      reward: '50 gems + $5.00',
      color: 'from-green-400 to-emerald-500',
      available: true
    },
    {
      id: 'streak-bonus',
      name: '7-Day Streak',
      description: 'Play 7 days in a row',
      icon: <Sparkles className="w-6 h-6" />,
      reward: '100 gems + $10.00',
      color: 'from-purple-400 to-pink-500',
      available: true
    },
    {
      id: 'first-win',
      name: 'First Win of Day',
      description: 'Bonus for your first BINGO',
      icon: <Rocket className="w-6 h-6" />,
      reward: '25 gems + $2.50',
      color: 'from-blue-400 to-cyan-500',
      available: true
    }
  ];

  // Activate a bonus
  const activateBonus = (bonus: any) => {
    if (gems < bonus.cost) {
      alert(`You need ${bonus.cost} gems to activate ${bonus.name}!`);
      return;
    }

    updateGems(-bonus.cost);
    setActiveBonuses(prev => [...prev, bonus.id]);
    setBonusCooldowns(prev => ({ ...prev, [bonus.id]: bonus.duration }));

    if (onBonusActivated) {
      onBonusActivated(bonus.effect);
    }

    // Start cooldown timer
    const timer = setInterval(() => {
      setBonusCooldowns(prev => {
        const newCooldowns = { ...prev };
        if (newCooldowns[bonus.id] > 0) {
          newCooldowns[bonus.id]--;
        } else {
          clearInterval(timer);
          setActiveBonuses(prev => prev.filter(b => b !== bonus.id));
        }
        return newCooldowns;
      });
    }, 1000);
  };

  // Claim daily bonus
  const claimDailyBonus = (bonus: any) => {
    if (bonus.id === 'daily-login') {
      updateGems(50);
      updateBalance(5.00);
      alert('🎁 Daily Login Bonus claimed! +50 gems, +$5.00');
    } else if (bonus.id === 'streak-bonus') {
      updateGems(100);
      updateBalance(10.00);
      alert('🔥 7-Day Streak Bonus claimed! +100 gems, +$10.00');
    } else if (bonus.id === 'first-win') {
      updateGems(25);
      updateBalance(2.50);
      alert('🚀 First Win Bonus claimed! +25 gems, +$2.50');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4">
            ⚡ BONUS & POWER-UP SYSTEM ⚡
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock incredible bonuses, activate powerful abilities, and claim daily rewards! 
            Make your BINGO experience extraordinary!
          </p>
        </div>

        {/* Active Bonuses */}
        {activeBonuses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">🔥 Active Bonuses</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {activeBonuses.map(bonusId => {
                const bonus = availableBonuses.find(b => b.id === bonusId);
                const cooldown = bonusCooldowns[bonusId] || 0;
                
                return bonus ? (
                  <div
                    key={bonusId}
                    className={`bg-gradient-to-r ${bonus.color} p-4 rounded-xl border-2 border-white/30 relative overflow-hidden`}
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">{bonus.icon}</div>
                      <div className="font-bold text-sm">{bonus.name}</div>
                      <div className="text-xs opacity-90">{cooldown}s remaining</div>
                    </div>
                    
                    {/* Cooldown Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div 
                        className="h-full bg-white/80 transition-all duration-1000"
                        style={{ width: `${(cooldown / (bonus.duration || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Power-up Bonuses */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🎯 Power-up Bonuses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBonuses.map((bonus) => (
              <Card key={bonus.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${bonus.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                    {bonus.icon}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white text-center mb-2">{bonus.name}</h4>
                  <p className="text-gray-300 text-center text-sm mb-4">{bonus.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-yellow-400 font-bold">{bonus.cost} 💎</div>
                    <div className="text-blue-400 text-sm">{bonus.duration}s</div>
                  </div>
                  
                  <Button
                    onClick={() => activateBonus(bonus)}
                    disabled={activeBonuses.includes(bonus.id)}
                    className={`w-full ${
                      activeBonuses.includes(bonus.id)
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    }`}
                  >
                    {activeBonuses.includes(bonus.id) ? 'ACTIVE' : 'ACTIVATE'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Bonuses */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🎁 Daily Bonuses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyBonuses.map((bonus) => (
              <Card key={bonus.id} className="bg-gray-900 border-gray-700 hover:border-green-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${bonus.color} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                    {bonus.icon}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">{bonus.name}</h4>
                  <p className="text-gray-300 text-sm mb-4">{bonus.description}</p>
                  
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
                    <div className="text-green-400 font-bold">{bonus.reward}</div>
                  </div>
                  
                  <Button
                    onClick={() => claimDailyBonus(bonus)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    CLAIM NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bonus Info */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-800/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">💎 How to Get More Gems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="text-purple-400 font-bold mb-2">🎮 Gameplay</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Win BINGO games</li>
                  <li>• Complete daily challenges</li>
                  <li>• Achieve winning streaks</li>
                  <li>• Participate in tournaments</li>
                </ul>
              </div>
              <div>
                <div className="text-blue-400 font-bold mb-2">🛒 Purchase</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Buy gem packages</li>
                  <li>• Special offers and deals</li>
                  <li>• VIP memberships</li>
                  <li>• Bonus gem events</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusSystem; 