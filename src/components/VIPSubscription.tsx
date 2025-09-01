import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Crown, 
  Star, 
  Gift, 
  Zap, 
  Shield, 
  Users, 
  Trophy,
  CheckCircle,
  Lock,
  Sparkles
} from 'lucide-react';

interface VIPTier {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  color: string;
  icon: string;
  benefits: string[];
  exclusiveFeatures: string[];
  bonusMultiplier: number;
  prioritySupport: boolean;
  customUsername: boolean;
  exclusiveTournaments: boolean;
  noAds: boolean;
  earlyAccess: boolean;
}

const VIPSubscription: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const vipTiers: VIPTier[] = [
    {
      id: 'bronze',
      name: 'Bronze VIP',
      price: 9.99,
      period: 'monthly',
      color: 'from-amber-600 to-orange-600',
      icon: '🥉',
      benefits: [
        '10% bonus on all winnings',
        'Priority customer support',
        'Exclusive monthly tournaments',
        'No waiting in game queues',
        'Custom profile badge'
      ],
      exclusiveFeatures: [
        'Early access to new features',
        'Monthly VIP rewards'
      ],
      bonusMultiplier: 1.1,
      prioritySupport: true,
      customUsername: false,
      exclusiveTournaments: true,
      noAds: false,
      earlyAccess: true
    },
    {
      id: 'silver',
      name: 'Silver VIP',
      price: 19.99,
      period: 'monthly',
      color: 'from-gray-400 to-gray-600',
      icon: '🥈',
      benefits: [
        '25% bonus on all winnings',
        'Priority customer support',
        'Exclusive monthly tournaments',
        'No waiting in game queues',
        'Custom profile badge',
        'Ad-free experience',
        'Custom username colors'
      ],
      exclusiveFeatures: [
        'Early access to new features',
        'Monthly VIP rewards',
        'Exclusive chat channels',
        'Weekly bonus spins'
      ],
      bonusMultiplier: 1.25,
      prioritySupport: true,
      customUsername: true,
      exclusiveTournaments: true,
      noAds: true,
      earlyAccess: true
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      price: 39.99,
      period: 'monthly',
      color: 'from-yellow-500 to-yellow-700',
      icon: '🥇',
      benefits: [
        '50% bonus on all winnings',
        'Priority customer support',
        'Exclusive monthly tournaments',
        'No waiting in game queues',
        'Custom profile badge',
        'Ad-free experience',
        'Custom username colors',
        'Exclusive game modes',
        'Personal account manager'
      ],
      exclusiveFeatures: [
        'Early access to new features',
        'Monthly VIP rewards',
        'Exclusive chat channels',
        'Weekly bonus spins',
        'Custom tournament creation',
        'Priority withdrawal processing'
      ],
      bonusMultiplier: 1.5,
      prioritySupport: true,
      customUsername: true,
      exclusiveTournaments: true,
      noAds: true,
      earlyAccess: true
    },
    {
      id: 'diamond',
      name: 'Diamond VIP',
      price: 99.99,
      period: 'monthly',
      color: 'from-blue-400 to-purple-600',
      icon: '💎',
      benefits: [
        '100% bonus on all winnings',
        'Priority customer support',
        'Exclusive monthly tournaments',
        'No waiting in game queues',
        'Custom profile badge',
        'Ad-free experience',
        'Custom username colors',
        'Exclusive game modes',
        'Personal account manager',
        'Custom platform features',
        'Revenue sharing program'
      ],
      exclusiveFeatures: [
        'Early access to new features',
        'Monthly VIP rewards',
        'Exclusive chat channels',
        'Weekly bonus spins',
        'Custom tournament creation',
        'Priority withdrawal processing',
        'Platform feature requests',
        'Exclusive networking events'
      ],
      bonusMultiplier: 2.0,
      prioritySupport: true,
      customUsername: true,
      exclusiveTournaments: true,
      noAds: true,
      earlyAccess: true
    }
  ];

  const handleSubscribe = async (tier: VIPTier) => {
    if (!user) {
      toast({
        title: '❌ Not Authenticated',
        description: 'Please log in to subscribe to VIP',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Calculate price based on billing period
      const price = billingPeriod === 'yearly' ? tier.price * 10 : tier.price; // 2 months free for yearly
      
      // Check if user has enough balance
      const userBalance = user.balance.usdc + user.balance.usdt;
      if (userBalance < price) {
        toast({
          title: '❌ Insufficient Balance',
          description: `You need $${price.toFixed(2)} to subscribe. Please deposit more funds.`,
          variant: 'destructive'
        });
        return;
      }

      // Simulate subscription processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Deduct subscription fee
      updateBalance(-price, 'usdc');
      
      toast({
        title: '🎉 VIP Subscription Active!',
        description: `Welcome to ${tier.name}! Your benefits are now active.`,
      });
      
      // In production, this would update the user's VIP status in the database
      console.log(`User ${user.username} subscribed to ${tier.name} for $${price}`);
      
    } catch (error) {
      toast({
        title: '❌ Subscription Failed',
        description: 'Failed to process subscription. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discountedPrice = monthlyPrice * 10; // 2 months free
    return yearlyPrice - discountedPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-5xl font-bold text-white mb-4">VIP Membership</h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Unlock exclusive benefits, higher winnings, and premium features. 
            Join the elite BetBingoCash VIP community and dominate the competition!
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-2xl p-1 border border-white/20">
            <div className="flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                  billingPeriod === 'yearly'
                    ? 'bg-green-600 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Yearly Billing
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* VIP Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {vipTiers.map((tier) => {
            const yearlyPrice = tier.price * 10; // 2 months free
            const monthlyPrice = billingPeriod === 'yearly' ? yearlyPrice / 12 : tier.price;
            const savings = billingPeriod === 'yearly' ? getYearlySavings(tier.price) : 0;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTier === tier.id
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/25'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {/* Popular Badge */}
                {tier.id === 'gold' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{tier.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-white/60 text-sm">Premium Gaming Experience</div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-1">
                    ${monthlyPrice.toFixed(2)}
                  </div>
                  <div className="text-white/60 text-sm">
                    {billingPeriod === 'yearly' ? 'per month' : 'per month'}
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="text-green-400 text-sm font-bold mt-1">
                      Save ${savings.toFixed(2)} yearly!
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-bold text-lg mb-3">✨ Key Benefits</h4>
                  {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Exclusive Features */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-bold text-lg mb-3">🚀 Exclusive Features</h4>
                  {tier.exclusiveFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Winnings Multiplier */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
                  <div className="text-white/60 text-sm mb-1">Winnings Multiplier</div>
                  <div className="text-2xl font-bold text-green-400">
                    {tier.bonusMultiplier}x
                  </div>
                  <div className="text-white/60 text-xs">
                    All your winnings are multiplied by this factor!
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 ${
                    tier.id === 'gold'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                      : `bg-gradient-to-r ${tier.color} hover:opacity-90`
                  } disabled:opacity-50`}
                >
                  {isProcessing ? 'Processing...' : `Subscribe Now`}
                </button>
              </div>
            );
          })}
        </div>

        {/* VIP Benefits Showcase */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">🎯 Why Choose VIP?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Higher Winnings</h3>
              <p className="text-white/60 text-sm">
                Get up to 100% bonus on all your BINGO winnings with Diamond VIP
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Priority Access</h3>
              <p className="text-white/60 text-sm">
                Skip queues, get early access to features, and join exclusive tournaments
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Premium Support</h3>
              <p className="text-white/60 text-sm">
                Get priority customer support and personal account management
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Elite Community</h3>
              <p className="text-white/60 text-sm">
                Join exclusive VIP chat channels and networking events
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">How do VIP bonuses work?</h3>
              <p className="text-white/60">
                VIP bonuses are automatically applied to all your winnings. For example, with Gold VIP (1.5x), 
                if you win $100, you'll actually receive $150!
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Can I cancel my VIP subscription?</h3>
              <p className="text-white/60">
                Yes! You can cancel your VIP subscription at any time. Your benefits will remain active 
                until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">What happens if I lose my VIP status?</h3>
              <p className="text-white/60">
                If your VIP subscription expires, you'll lose access to VIP benefits but keep all your 
                winnings and account balance. You can resubscribe anytime!
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Are there any hidden fees?</h3>
              <p className="text-white/60">
                No hidden fees! The price you see is exactly what you pay. Yearly subscriptions 
                give you 2 months free, making it the best value.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Dominate?</h2>
          <p className="text-white/80 text-lg mb-6">
            Join thousands of VIP players who are already winning more and playing better!
          </p>
          <button
            onClick={() => document.getElementById('vip-tiers')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            🚀 Choose Your VIP Tier Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VIPSubscription; 