import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import NavigationHeader from './NavigationHeader';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'win' | 'loss';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'crypto' | 'bank' | 'card';
  name: string;
  icon: string;
  enabled: boolean;
}

const PaymentSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(1000);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Available payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'btc', type: 'crypto', name: 'Bitcoin', icon: '₿', enabled: true },
    { id: 'eth', type: 'crypto', name: 'Ethereum', icon: 'Ξ', enabled: true },
    { id: 'usdt', type: 'crypto', name: 'USDT', icon: '💎', enabled: true },
    { id: 'bank', type: 'bank', name: 'Bank Transfer', icon: '🏦', enabled: true },
    { id: 'card', type: 'card', name: 'Credit Card', icon: '💳', enabled: false }
  ];

  // Sample transactions
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        amount: 500,
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        description: 'Bitcoin deposit'
      },
      {
        id: '2',
        type: 'win',
        amount: 1250,
        status: 'completed',
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        description: 'BINGO win'
      },
      {
        id: '3',
        type: 'loss',
        amount: -100,
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        description: 'Slot machine loss'
      }
    ];
    setTransactions(sampleTransactions);
  }, []);

  // Handle deposit
  const handleDeposit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make deposits",
        variant: "destructive"
      });
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const amount = parseFloat(depositAmount);
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'deposit',
        amount,
        status: 'completed',
        timestamp: new Date(),
        description: `${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name} deposit`
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev + amount);
      setDepositAmount('');
      setSelectedPaymentMethod('');

      toast({
        title: "✅ Deposit Successful",
        description: `Successfully deposited $${amount.toFixed(2)}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "❌ Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make withdrawals",
        variant: "destructive"
      });
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'withdrawal',
        amount: -amount,
        status: 'completed',
        timestamp: new Date(),
        description: `${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name} withdrawal`
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev - amount);
      setWithdrawalAmount('');
      setSelectedPaymentMethod('');

      toast({
        title: "✅ Withdrawal Successful",
        description: `Withdrawal of $${amount.toFixed(2)} has been processed`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "❌ Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdrawal': return '💸';
      case 'win': return '🎉';
      case 'loss': return '😔';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">💳 Payment System</h1>
          <p className="text-white/80 text-lg">Manage your deposits, withdrawals, and transactions</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Current Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-400 casino-neon">
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Total Deposits</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-400 casino-neon">
                {formatCurrency(transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-lg">Total Winnings</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-yellow-400 casino-neon">
                {formatCurrency(transactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deposit Section */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">💰 Make a Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-white/20 text-white border-white/30"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.filter(pm => pm.enabled).map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="text-white text-sm">{method.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount || !selectedPaymentMethod}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '💳 Deposit Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Withdrawal Section */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">💸 Request Withdrawal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="bg-white/20 text-white border-white/30"
                />
                <p className="text-white/60 text-xs mt-1">Available: {formatCurrency(balance)}</p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.filter(pm => pm.enabled && pm.type !== 'card').map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="text-white text-sm">{method.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleWithdrawal}
                disabled={isProcessing || !withdrawalAmount || !selectedPaymentMethod || parseFloat(withdrawalAmount) > balance}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '💸 Withdraw Now'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">📊 Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                    <div>
                      <div className="text-white font-medium">{transaction.description}</div>
                      <div className="text-white/60 text-sm">{formatDate(transaction.timestamp)}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                    <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Info */}
        <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-green-500/30">
          <h3 className="text-white font-bold text-xl mb-4 text-center">💳 Supported Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">₿</div>
              <div className="text-white font-bold">Cryptocurrency</div>
              <div className="text-green-200">Bitcoin, Ethereum, USDT</div>
              <div className="text-green-200/70 text-sm">Instant deposits</div>
            </div>
            <div className="bg-green-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🏦</div>
              <div className="text-white font-bold">Bank Transfer</div>
              <div className="text-green-200">Direct bank deposits</div>
              <div className="text-green-200/70 text-sm">1-3 business days</div>
            </div>
            <div className="bg-green-800/40 rounded-lg p-4">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-white font-bold">Secure & Fast</div>
              <div className="text-green-200">256-bit encryption</div>
              <div className="text-green-200/70 text-sm">24/7 support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem; 