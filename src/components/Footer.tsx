import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🎯</div>
              <div className="text-2xl font-black text-white">
                BET BINGO<span className="text-yellow-400">CASH</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The ultimate real money bingo experience. Play, win, and cash out instantly!
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">f</div>
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm">t</div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm">i</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">How to Play</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tournament Rules</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Daily Rewards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Power-ups Guide</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Withdrawal Help</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Account Issues</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Report Bug</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Responsible Gaming</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Age Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fair Play</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Bet Bingo Cash. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>18+ Only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Secure Gaming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Licensed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;