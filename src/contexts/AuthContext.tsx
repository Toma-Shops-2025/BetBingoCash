import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  cryptoAddress: string;
  balance: {
    usdc: number;
    usdt: number;
    btc: number;
    eth: number;
  };
  totalGames: number;
  totalWinnings: number;
  joinDate: Date;
  isVerified: boolean;
  isVIP: boolean;
}

interface CryptoWallet {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  wallet: CryptoWallet | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createAccount: (username: string, email: string) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number, currency: string) => void;
  deposit: (amount: number, currency: string) => Promise<void>;
  withdraw: (amount: number, currency: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<CryptoWallet | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const savedUser = localStorage.getItem('betbingo_user');
      const savedWallet = localStorage.getItem('betbingo_wallet');
      
      if (savedUser && savedWallet) {
        const userData = JSON.parse(savedUser);
        const walletData = JSON.parse(savedWallet);
        
        setUser(userData);
        setWallet(walletData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Check if MetaMask is available
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        // Get chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        });
        
        const walletData: CryptoWallet = {
          address: account,
          chainId: parseInt(chainId, 16),
          isConnected: true,
          balance: parseInt(balance, 16) / Math.pow(10, 18) // Convert from wei to ETH
        };
        
        setWallet(walletData);
        localStorage.setItem('betbingo_wallet', JSON.stringify(walletData));
        
        // Auto-login if wallet was previously connected to an account
        const savedUser = localStorage.getItem('betbingo_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          if (userData.cryptoAddress === account) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
        
        console.log('Wallet connected:', walletData);
      } else {
        throw new Error('MetaMask not found. Please install MetaMask extension.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('betbingo_wallet');
    console.log('Wallet disconnected');
  };

  const createAccount = async (username: string, email: string) => {
    try {
      if (!wallet?.address) {
        throw new Error('Please connect your wallet first');
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        cryptoAddress: wallet.address,
        balance: {
          usdc: 0,
          usdt: 0,
          btc: 0,
          eth: 0
        },
        totalGames: 0,
        totalWinnings: 0,
        joinDate: new Date(),
        isVerified: false,
        isVIP: false
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('betbingo_user', JSON.stringify(newUser));
      
      console.log('Account created:', newUser);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  const login = async (email: string) => {
    try {
      // For demo purposes, we'll create a mock user
      // In production, this would verify against your backend
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: email.split('@')[0],
        email,
        cryptoAddress: wallet?.address || '0x0000000000000000000000000000000000000000',
        balance: {
          usdc: 1000,
          usdt: 1000,
          btc: 0.01,
          eth: 0.1
        },
        totalGames: 25,
        totalWinnings: 450,
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        isVerified: true,
        isVIP: true
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('betbingo_user', JSON.stringify(mockUser));
      
      console.log('User logged in:', mockUser);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('betbingo_user');
    console.log('User logged out');
  };

  const updateBalance = (amount: number, currency: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      
      const newBalance = { ...prev.balance };
      if (currency in newBalance) {
        newBalance[currency as keyof typeof newBalance] += amount;
      }
      
      const updatedUser = { ...prev, balance: newBalance };
      localStorage.setItem('betbingo_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const deposit = async (amount: number, currency: string) => {
    try {
      // In production, this would integrate with your crypto payment processor
      console.log(`Depositing ${amount} ${currency}`);
      
      // Simulate deposit processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateBalance(amount, currency);
      
      console.log(`Successfully deposited ${amount} ${currency}`);
    } catch (error) {
      console.error('Error processing deposit:', error);
      throw error;
    }
  };

  const withdraw = async (amount: number, currency: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const currentBalance = user.balance[currency as keyof typeof user.balance] || 0;
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
      
      // In production, this would integrate with your crypto payment processor
      console.log(`Withdrawing ${amount} ${currency}`);
      
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      updateBalance(-amount, currency);
      
      console.log(`Successfully withdrew ${amount} ${currency}`);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    wallet,
    isAuthenticated,
    isLoading,
    connectWallet,
    disconnectWallet,
    createAccount,
    login,
    logout,
    updateBalance,
    deposit,
    withdraw
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 