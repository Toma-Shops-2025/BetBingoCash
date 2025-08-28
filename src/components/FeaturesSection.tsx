import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "🔒",
      title: "Secure & Licensed",
      description: "SSL encrypted transactions with licensed gaming authority oversight"
    },
    {
      icon: "⚡",
      title: "Instant Payouts",
      description: "Cash out winnings immediately to your bank account or digital wallet"
    },
    {
      icon: "🎯",
      title: "Fair Play Guaranteed",
      description: "Certified random number generators ensure every game is completely fair"
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Play seamlessly on any device - desktop, tablet, or smartphone"
    },
    {
      icon: "🏆",
      title: "VIP Rewards",
      description: "Exclusive bonuses, cashback, and special tournaments for loyal players"
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Join players from around the world in exciting multiplayer bingo rooms"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Why Choose BetBingoCash?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the most trusted and exciting online bingo platform with industry-leading features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 inline-block">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-green-400 mb-2">$2.5M+</div>
                <div className="text-gray-300">Total Paid Out</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">500K+</div>
                <div className="text-gray-300">Happy Players</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">99.9%</div>
                <div className="text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;