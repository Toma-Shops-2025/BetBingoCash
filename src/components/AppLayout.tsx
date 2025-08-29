import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';

const AppLayout: React.FC = () => {
  const { user, balance, gems, isAuthenticated } = useAppContext();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  // Simple test render to see if this component works at all
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">BetBingoCash</h1>
      
      <div className="mb-4">
        <p>Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
        <p>User: {user ? user.email : 'No user'}</p>
        <p>Balance: ${(balance || 0).toFixed(2)}</p>
        <p>Gems: {gems || 0}</p>
      </div>

      <button
        onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4"
      >
        {showHamburgerMenu ? 'Hide' : 'Show'} Hamburger Menu
      </button>

      {showHamburgerMenu && (
        <div className="bg-purple-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Quick Navigation</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">Games</button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded">Tournaments</button>
            <button className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">Leaderboard</button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl mb-4">Game Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Speed Bingo</h3>
            <p className="text-gray-300 mb-2">Fast-paced 2-minute games</p>
            <p className="text-green-400 font-bold">Entry: $2.00</p>
            <p className="text-yellow-400 font-bold">Prize: $10.00</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Classic 75</h3>
            <p className="text-gray-300 mb-2">Traditional 75-ball BINGO</p>
            <p className="text-green-400 font-bold">Entry: $5.00</p>
            <p className="text-yellow-400 font-bold">Prize: $25.00</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Pattern Bingo</h3>
            <p className="text-gray-300 mb-2">Complete specific patterns</p>
            <p className="text-green-400 font-bold">Entry: $3.00</p>
            <p className="text-yellow-400 font-bold">Prize: $15.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;