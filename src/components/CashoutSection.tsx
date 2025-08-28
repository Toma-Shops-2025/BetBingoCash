import React, { useState } from 'react';

const CashoutSection: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [bonusCash] = useState<number>(0.40);
  const [availableCash] = useState<number>(111.60);

  return (
    <div className="py-12 bg-gradient-to-br from-green-800 via-emerald-900 to-teal-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-4">
            💰 CASH OUT YOUR WINNINGS
          </h2>
          <p className="text-xl text-green-200">
            Withdraw your earnings instantly to PayPal or bank account
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">💳 Withdraw Funds</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-green-200 text-sm font-bold mb-2">
                  Bonus Cash
                </label>
                <div className="bg-gray-800 rounded-lg p-3 text-green-400 font-bold">
                  ${bonusCash.toFixed(2)}
                </div>
              </div>
              
              <div>
                <label className="block text-green-200 text-sm font-bold mb-2">
                  Available to Withdraw
                </label>
                <div className="bg-gray-800 rounded-lg p-3 text-green-400 font-bold text-xl">
                  ${availableCash.toFixed(2)}
                </div>
              </div>
              
              <div>
                <label className="block text-green-200 text-sm font-bold mb-2">
                  Withdraw Amount
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200">
              💸 Submit Withdrawal
            </button>
          </div>
          
          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
              
              <div className="space-y-3">
                <div className="bg-blue-600 rounded-lg p-4 flex items-center gap-4">
                  <div className="text-2xl">💳</div>
                  <div>
                    <div className="text-white font-bold">PayPal</div>
                    <div className="text-blue-200 text-sm">Instant transfer</div>
                  </div>
                  <div className="ml-auto text-green-400 font-bold">✓</div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                  <div className="text-2xl">🏦</div>
                  <div>
                    <div className="text-white font-bold">Bank Transfer</div>
                    <div className="text-gray-300 text-sm">1-3 business days</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Recent Withdrawals</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <div>
                    <div className="text-white font-medium">$111.60</div>
                    <div className="text-gray-400 text-sm">PayPal</div>
                  </div>
                  <div className="text-green-400 text-sm">Completed</div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <div>
                    <div className="text-white font-medium">$75.30</div>
                    <div className="text-gray-400 text-sm">PayPal</div>
                  </div>
                  <div className="text-green-400 text-sm">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-200 text-sm">
              ⚠️ Minimum withdrawal amount is $10.00. Processing time: Instant for PayPal, 1-3 business days for bank transfers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashoutSection;