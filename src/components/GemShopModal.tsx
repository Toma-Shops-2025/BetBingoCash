import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { Zap, Crown, Star, Shield, Target, Gift, Coins } from 'lucide-react';

interface GemShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  gemCost: number;
  icon: React.ReactNode;
  category: 'powerups' | 'bonuses' | 'cosmetics' | 'conversion';
  effect: string;
}

const GemShopModal: React.FC<GemShopModalProps> = ({ isOpen, onClose }) => {
  const { gems, updateGems, updateBalance } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const shopItems: ShopItem[] = [
    // Power-ups
    {
      id: 'magic-ball',
      name: 'Magic Ball',
      description: 'Call 3 numbers at once',
      gemCost: 50,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      category: 'powerups',
      effect: 'Instantly calls 3 numbers in sequence'
    },
    {
      id: 'magic-dauber',
      name: 'Magic Dauber',
      description: 'Auto-mark numbers for 10 seconds',
      gemCost: 75,
      icon: <Target className="w-6 h-6 text-blue-400" />,
      category: 'powerups',
      effect: 'Automatically marks called numbers'
    },
    {
      id: 'triple-time',
      name: 'Triple Time',
      description: 'Triple your remaining time',
      gemCost: 100,
      icon: <Star className="w-6 h-6 text-green-400" />,
      category: 'powerups',
      effect: 'Extends game time by 3x'
    },
    {
      id: 'shield',
      name: 'Shield',
      description: 'Protect against time penalties',
      gemCost: 120,
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      category: 'powerups',
      effect: 'Prevents time deductions for 30 seconds'
    },
    
    // Bonuses
    {
      id: 'score-multiplier',
      name: 'Score Multiplier',
      description: '2x points for 60 seconds',
      gemCost: 150,
      icon: <Crown className="w-6 h-6 text-orange-400" />,
      category: 'bonuses',
      effect: 'Doubles all points earned'
    },
    {
      id: 'bingo-bonus',
      name: 'Bingo Bonus',
      description: 'Extra points for BINGO lines',
      gemCost: 200,
      icon: <Gift className="w-6 h-6 text-pink-400" />,
      category: 'bonuses',
      effect: '50% bonus on BINGO line points'
    },
    {
      id: 'lucky-numbers',
      name: 'Lucky Numbers',
      description: 'Higher chance of good numbers',
      gemCost: 180,
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      category: 'bonuses',
      effect: 'Increases probability of high-scoring numbers'
    },
    
    // Conversion
    {
      id: 'gem-to-cash',
      name: 'Convert Gems to Cash',
      description: 'Trade gems for real money',
      gemCost: 1000,
      icon: <Coins className="w-6 h-6 text-green-400" />,
      category: 'conversion',
      effect: 'Convert 1000 gems to $1.00'
    }
  ];

  const handlePurchase = (item: ShopItem) => {
    if (gems < item.gemCost) {
      toast({
        title: "Insufficient Gems",
        description: `You need ${item.gemCost} gems to buy ${item.name}.`,
        variant: "destructive",
      });
      return;
    }

    // Process purchase
    updateGems(-item.gemCost);
    
    if (item.category === 'conversion') {
      // Convert gems to cash
      const cashAmount = item.gemCost / 1000; // 1000 gems = $1.00
      updateBalance(cashAmount);
      toast({
        title: "💎 Gems Converted!",
        description: `${item.gemCost} gems converted to $${cashAmount.toFixed(2)}`,
      });
    } else {
      // Regular item purchase
      toast({
        title: "🎉 Item Purchased!",
        description: `${item.name} added to your inventory!`,
      });
    }
  };

  const getCategoryItems = (category: string) => {
    return shopItems.filter(item => item.category === category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-700" aria-describedby="gem-shop-description">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            💎 Gem Shop
          </DialogTitle>
        </DialogHeader>

        <div id="gem-shop-description" className="sr-only">
          Purchase power-ups, bonuses, and convert gems to cash
        </div>

        {/* Gem Balance Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-800 to-purple-800 rounded-full px-6 py-3">
            <div className="text-2xl">💎</div>
            <div className="text-white font-bold text-xl">{gems.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Gems Available</div>
          </div>
        </div>

        <Tabs defaultValue="powerups" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="powerups" className="text-white">Power-ups</TabsTrigger>
            <TabsTrigger value="bonuses" className="text-white">Bonuses</TabsTrigger>
            <TabsTrigger value="cosmetics" className="text-white">Cosmetics</TabsTrigger>
            <TabsTrigger value="conversion" className="text-white">Convert</TabsTrigger>
          </TabsList>

          {/* Power-ups Tab */}
          <TabsContent value="powerups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCategoryItems('powerups').map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{item.gemCost}</div>
                      <div className="text-gray-500 text-xs">💎</div>
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm mb-3">{item.effect}</p>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={gems < item.gemCost}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Purchase
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Bonuses Tab */}
          <TabsContent value="bonuses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCategoryItems('bonuses').map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{item.gemCost}</div>
                      <div className="text-gray-500 text-xs">💎</div>
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm mb-3">{item.effect}</p>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={gems < item.gemCost}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Purchase
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Cosmetics Tab */}
          <TabsContent value="cosmetics" className="space-y-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-white text-xl font-bold mb-2">Customization Coming Soon!</h3>
              <p className="text-gray-400">
                Personalize your bingo experience with custom themes, card designs, and more!
              </p>
            </div>
          </TabsContent>

          {/* Conversion Tab */}
          <TabsContent value="conversion" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {getCategoryItems('conversion').map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{item.gemCost}</div>
                      <div className="text-gray-500 text-xs">💎</div>
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm mb-3">{item.effect}</p>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={gems < item.gemCost}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Convert to Cash
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-white/60 mt-4">
          💡 Earn gems by playing games, completing achievements, and daily rewards!
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GemShopModal; 