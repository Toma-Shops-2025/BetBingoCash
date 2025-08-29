import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-96 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68afa3c8dc48a02afdc596ca_1756342025250_19f37243.webp)'
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="animate-bounce absolute top-10 left-10 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">I</div>
        <div className="animate-pulse absolute top-20 right-20 w-8 h-8 bg-green-400 rounded-full"></div>
        <div className="animate-bounce absolute bottom-20 left-20 w-10 h-10 bg-orange-400 rounded-full delay-300"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <img 
          src="/logo.png" 
          alt="BetBingoCash Logo" 
          className="h-20 w-auto mb-6 drop-shadow-lg"
        />
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
          BET{' '}
          <span className="inline-flex items-center">
            <span>B</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
            <span className="inline-block animate-bounce w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">$</span>
          </span>
          <span className="block text-yellow-400">
            CASH
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          Play Real Money Bingo • Win Cash Prizes • Compete with Players Worldwide
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            🎯 PLAY NOW - WIN CASH!
          </button>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            💎 GET FREE BONUS
          </button>
        </div>
        
        <div className="mt-8 flex items-center gap-6 text-white/80">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">$50K+</div>
            <div className="text-sm">Daily Prizes</div>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-sm">Live Games</div>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">100K+</div>
            <div className="text-sm">Players</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;