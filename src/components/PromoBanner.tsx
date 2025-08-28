import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-2xl animate-spin">🎁</span>
            <span className="text-white font-bold">LIMITED TIME OFFER</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
            GET $50 FREE
          </h2>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-2 font-bold">
            + 100% Match Bonus
          </p>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Sign up now and get $50 free to play plus we'll double your first deposit up to $500!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-white text-orange-600 font-black py-4 px-8 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-200 hover:shadow-3xl">
              🎯 CLAIM $50 FREE NOW!
            </button>
            <div className="text-white/80 text-sm">
              ⏰ Offer expires in: <span className="font-bold text-yellow-200">23:45:12</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-white font-bold text-lg mb-2">No Deposit Required</h3>
              <p className="text-white/80 text-sm">Start playing immediately with your free $50 bonus</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="text-white font-bold text-lg mb-2">Instant Activation</h3>
              <p className="text-white/80 text-sm">Your bonus is credited automatically upon signup</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="text-white font-bold text-lg mb-2">Keep Your Winnings</h3>
              <p className="text-white/80 text-sm">Cash out your winnings with low wagering requirements</p>
            </div>
          </div>
          
          <div className="mt-8 text-white/70 text-sm">
            * Terms and conditions apply. Must be 18+. Wagering requirements: 30x bonus amount.
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;