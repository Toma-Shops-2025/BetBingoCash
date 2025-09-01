import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Wallet, 
  User, 
  Trophy, 
  Coins, 
  Settings, 
  LogOut, 
  Crown,
  TrendingUp,
  Gamepad2,
  DollarSign,
  Shield,
  Star
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, wallet, isAuthenticated, connectWallet, disconnectWallet, logout, deposit, withdraw } = useAuth();
  const { toast } = useToast();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositCurrency, setDepositCurrency] = useState('usdc');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('usdc');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
      toast({
        title: '✅ Wallet Connected!',
        description: 'Your crypto wallet is now connected to BetBingoCash',
      });
    } catch (error) {
      toast({
        title: '❌ Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast({
      title: '🔌 Wallet Disconnected',
      description: 'Your crypto wallet has been disconnected',
    });
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      await deposit(parseFloat(depositAmount), depositCurrency);
      toast({
        title: '✅ Deposit Successful!',
        description: `Successfully deposited ${depositAmount} ${depositCurrency.toUpperCase()}`,
      });
      setDepositAmount('');
    } catch (error) {
      toast({
        title: '❌ Deposit Failed',
        description: error instanceof Error ? error.message : 'Failed to process deposit',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      await withdraw(parseFloat(withdrawAmount), withdrawCurrency);
      toast({
        title: '✅ Withdrawal Successful!',
        description: `Successfully withdrew ${withdrawAmount} ${withdrawCurrency.toUpperCase()}`,
      });
      setWithdrawAmount('');
    } catch (error) {
      toast({
        title: '❌ Withdrawal Failed',
        description: error instanceof Error ? error.message : 'Failed to process withdrawal',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'btc' || currency === 'eth') {
      return `${amount.toFixed(6)} ${currency.toUpperCase()}`;
    }
    return `$${amount.toFixed(2)} ${currency.toUpperCase()}`;
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'usdc': return '💙';
      case 'usdt': return '💚';
      case 'btc': return '🟡';
      case 'eth': return '🔷';
      default: return '💰';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to BetBingoCash</h1>
            <p className="text-white/80 mb-6">
              Connect your crypto wallet to start playing BINGO and winning prizes!
            </p>
            
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : '🔗 Connect Crypto Wallet'}
            </button>
            
            <div className="mt-4 text-white/60 text-sm">
              <p>Supported: MetaMask, WalletConnect</p>
              <p>Cryptocurrencies: USDC, USDT, BTC, ETH</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">👋 Welcome back, {user?.username}!</h1>
            <p className="text-white/80">Manage your account, balance, and gaming stats</p>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.isVIP && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full flex items-center gap-2">
                <Crown className="w-5 h-5 text-white" />
                <span className="text-white font-bold">VIP</span>
              </div>
            )}
            
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Wallet Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Crypto Wallet</h3>
                <p className="text-white/60 text-sm">
                  {wallet?.isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white/60 text-sm">Wallet Address</p>
              <p className="text-white font-mono text-sm">
                {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Not connected'}
              </p>
            </div>
            
            <div className="flex gap-2">
              {wallet?.isConnected ? (
                <button
                  onClick={handleDisconnectWallet}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Balance & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Balance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">Total Balance</h4>
                <p className="text-white/60 text-sm">All currencies</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${(user?.balance.usdc || 0) + (user?.balance.usdt || 0) + ((user?.balance.btc || 0) * 50000) + ((user?.balance.eth || 0) * 3000)}
            </div>
          </div>

          {/* Games Played */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">Games Played</h4>
                <p className="text-white/60 text-sm">Total games</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{user?.totalGames || 0}</div>
          </div>

          {/* Total Winnings */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">Total Winnings</h4>
                <p className="text-white/60 text-sm">All time</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">${user?.totalWinnings || 0}</div>
          </div>

          {/* VIP Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">VIP Status</h4>
                <p className="text-white/60 text-sm">Membership</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {user?.isVIP ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Currency Balances */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-xl mb-4">💰 Currency Balances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(user?.balance || {}).map(([currency, amount]) => (
              <div key={currency} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getCurrencyIcon(currency)}</span>
                  <div>
                    <h4 className="text-white font-bold capitalize">{currency}</h4>
                    <p className="text-white/60 text-sm">Balance</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(amount, currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit & Withdraw */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Deposit */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Deposit Funds
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Currency</label>
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="usdc">USDC (Stablecoin)</option>
                  <option value="usdt">USDT (Stablecoin)</option>
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40"
                />
              </div>
              
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '💳 Deposit Funds'}
              </button>
            </div>
          </div>

          {/* Withdraw */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              Withdraw Funds
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Currency</label>
                <select
                  value={withdrawCurrency}
                  onChange={(e) => setWithdrawCurrency(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="usdc">USDC (Stablecoin)</option>
                  <option value="usdt">USDT (Stablecoin)</option>
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40"
                />
              </div>
              
              <button
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '💸 Withdraw Funds'}
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-bold mb-3">Profile Details</h4>
              <div className="space-y-2 text-white/80">
                <p><span className="text-white/60">Username:</span> {user?.username}</p>
                <p><span className="text-white/60">Email:</span> {user?.email}</p>
                <p><span className="text-white/60">Member Since:</span> {user?.joinDate.toLocaleDateString()}</p>
                <p><span className="text-white/60">Verification:</span> 
                  <span className={user?.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {user?.isVerified ? ' ✅ Verified' : ' ⏳ Pending'}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-3">Security & Status</h4>
              <div className="space-y-2 text-white/80">
                <p><span className="text-white/60">VIP Status:</span> 
                  <span className={user?.isVIP ? 'text-yellow-400' : 'text-gray-400'}>
                    {user?.isVIP ? ' 👑 VIP Member' : ' Standard Member'}
                  </span>
                </p>
                <p><span className="text-white/60">Wallet:</span> 
                  <span className={wallet?.isConnected ? 'text-green-400' : 'text-red-400'}>
                    {wallet?.isConnected ? ' 🔗 Connected' : ' ❌ Disconnected'}
                  </span>
                </p>
                <p><span className="text-white/60">Account ID:</span> {user?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 