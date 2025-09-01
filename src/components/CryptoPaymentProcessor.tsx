import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Wallet, 
  ArrowUpDown, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface CryptoTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  timestamp: Date;
  confirmations: number;
  requiredConfirmations: number;
}

interface CryptoRates {
  usdc: number;
  usdt: number;
  btc: number;
  eth: number;
}

const CryptoPaymentProcessor: React.FC = () => {
  const { user, wallet, deposit, withdraw } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [cryptoRates, setCryptoRates] = useState<CryptoRates>({
    usdc: 1.00,
    usdt: 1.00,
    btc: 50000.00,
    eth: 3000.00
  });

  // Simulate crypto rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoRates(prev => ({
        ...prev,
        btc: prev.btc + (Math.random() - 0.5) * 100,
        eth: prev.eth + (Math.random() - 0.5) * 10
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive'
      });
      return;
    }

    if (!wallet?.isConnected) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your crypto wallet first',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create transaction record
      const transaction: CryptoTransaction = {
        id: `tx_${Date.now()}`,
        type: 'deposit',
        amount: parseFloat(amount),
        currency,
        status: 'processing',
        timestamp: new Date(),
        confirmations: 0,
        requiredConfirmations: currency === 'usdc' || currency === 'usdt' ? 1 : 6
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Process deposit
      await deposit(parseFloat(amount), currency);
      
      // Update transaction status
      setTransactions(prev => prev.map(tx => 
        tx.id === transaction.id ? { ...tx, status: 'completed' } : tx
      ));
      
      toast({
        title: '✅ Deposit Successful!',
        description: `Successfully deposited ${amount} ${currency.toUpperCase()}`,
      });
      
      setAmount('');
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
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: '❌ Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive'
      });
      return;
    }

    if (!wallet?.isConnected) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your crypto wallet first',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create transaction record
      const transaction: CryptoTransaction = {
        id: `tx_${Date.now()}`,
        type: 'withdrawal',
        amount: parseFloat(amount),
        currency,
        status: 'processing',
        timestamp: new Date(),
        confirmations: 0,
        requiredConfirmations: currency === 'usdc' || currency === 'usdt' ? 1 : 6
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Process withdrawal
      await withdraw(parseFloat(amount), currency);
      
      // Update transaction status
      setTransactions(prev => prev.map(tx => 
        tx.id === transaction.id ? { ...tx, status: 'completed' } : tx
      ));
      
      toast({
        title: '✅ Withdrawal Successful!',
        description: `Successfully withdrew ${amount} ${currency.toUpperCase()}`,
      });
      
      setAmount('');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied!',
      description: 'Address copied to clipboard',
    });
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

  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'usdc': return 'USD Coin';
      case 'usdt': return 'Tether';
      case 'btc': return 'Bitcoin';
      case 'eth': return 'Ethereum';
      default: return 'Unknown';
    }
  };

  const getNetworkInfo = (currency: string) => {
    switch (currency) {
      case 'usdc': return { network: 'Ethereum/Polygon', fee: '~$2-5' };
      case 'usdt': return { network: 'Ethereum/Polygon', fee: '~$2-5' };
      case 'btc': return { network: 'Bitcoin', fee: '~$1-3' };
      case 'eth': return { network: 'Ethereum', fee: '~$5-15' };
      default: return { network: 'Unknown', fee: 'Unknown' };
    }
  };

  const getDepositAddress = (currency: string) => {
    // In production, these would be your actual deposit addresses
    const addresses = {
      usdc: '0x1234567890abcdef1234567890abcdef12345678',
      usdt: '0xabcdef1234567890abcdef1234567890abcdef12',
      btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      eth: '0x9876543210fedcba9876543210fedcba98765432'
    };
    return addresses[currency as keyof typeof addresses] || '';
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'btc' || currency === 'eth') {
      return `${amount.toFixed(6)} ${currency.toUpperCase()}`;
    }
    return `$${amount.toFixed(2)} ${currency.toUpperCase()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💎 Crypto Payments</h1>
          <p className="text-white/80 text-lg">
            Secure, fast, and low-fee cryptocurrency transactions
          </p>
        </div>

        {/* Wallet Status */}
        {wallet?.isConnected ? (
          <div className="bg-green-600/20 border border-green-500/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Wallet Connected</span>
            </div>
            <div className="text-center text-green-300 text-sm mt-1">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
          </div>
        ) : (
          <div className="bg-red-600/20 border border-red-500/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold">Wallet Not Connected</span>
            </div>
            <div className="text-center text-red-300 text-sm mt-1">
              Please connect your crypto wallet to continue
            </div>
          </div>
        )}

        {/* Crypto Rates */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-xl mb-4 text-center">📊 Live Crypto Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(cryptoRates).map(([currency, rate]) => (
              <div key={currency} className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{getCurrencyIcon(currency)}</div>
                <div className="text-white font-bold capitalize">{currency}</div>
                <div className="text-white/80 text-sm">{getCurrencyName(currency)}</div>
                <div className="text-green-400 font-bold mt-2">
                  {currency === 'usdc' || currency === 'usdt' ? '$1.00' : `$${rate.toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
            {[
              { id: 'deposit', label: 'Deposit', icon: '⬇️' },
              { id: 'withdraw', label: 'Withdraw', icon: '⬆️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'deposit' | 'withdraw')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-white font-bold text-2xl mb-2">💰 Deposit {getCurrencyName(currency)}</h3>
                <p className="text-white/60">Send crypto to your BetBingoCash account</p>
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.keys(cryptoRates).map(curr => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      currency === curr
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="text-2xl mb-2">{getCurrencyIcon(curr)}</div>
                    <div className="text-white font-bold capitalize">{curr}</div>
                    <div className="text-white/60 text-sm">{getCurrencyName(curr)}</div>
                  </button>
                ))}
              </div>

              {/* Deposit Address */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h4 className="text-white font-bold text-lg mb-3">📥 Deposit Address</h4>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="flex-1 font-mono text-white text-sm break-all">
                    {getDepositAddress(currency)}
                  </div>
                  <button
                    onClick={() => copyToClipboard(getDepositAddress(currency))}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-3 text-white/60 text-sm">
                  <p>Network: {getNetworkInfo(currency).network}</p>
                  <p>Fee: {getNetworkInfo(currency).fee}</p>
                  <p className="text-yellow-400 mt-2">
                    ⚠️ Only send {currency.toUpperCase()} to this address. Sending other currencies may result in permanent loss.
                  </p>
                </div>
              </div>

              {/* Quick Deposit */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h4 className="text-white font-bold text-lg mb-3">⚡ Quick Deposit</h4>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={isProcessing || !amount || !wallet?.isConnected}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-white font-bold text-2xl mb-2">💸 Withdraw {getCurrencyName(currency)}</h3>
                <p className="text-white/60">Send crypto from your BetBingoCash account to your wallet</p>
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.keys(cryptoRates).map(curr => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      currency === curr
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="text-2xl mb-2">{getCurrencyIcon(curr)}</div>
                    <div className="text-white font-bold capitalize">{curr}</div>
                    <div className="text-white/60 text-sm">{getCurrencyName(curr)}</div>
                  </button>
                ))}
              </div>

              {/* Withdrawal Form */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h4 className="text-white font-bold text-lg mb-3">📤 Withdrawal Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Amount to Withdraw</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Available Balance</label>
                    <div className="text-white font-bold">
                      {formatCurrency(user?.balance[currency as keyof typeof user.balance] || 0, currency)}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleWithdraw}
                      disabled={isProcessing || !amount || !wallet?.isConnected}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-4">📋 Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      {transaction.type === 'deposit' ? '⬇️' : '⬆️'}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {transaction.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPaymentProcessor; 