import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  balance: number;
  gems: number;
  isAuthenticated: boolean;
  currentGame: any | null;
  gameHistory: any[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => void;
  updateGems: (amount: number) => void;
  startGame: (gameType: string) => void;
  endGame: (score: number) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  balance: 0,
  gems: 0,
  isAuthenticated: false,
  currentGame: null,
  gameHistory: [],
  login: async () => {},
  logout: async () => {},
  updateBalance: () => {},
  updateGems: () => {},
  startGame: () => {},
  endGame: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(5.00);
  const [gems, setGems] = useState(160);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from database
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser(profile);
          setBalance(profile.balance || 0);
          setGems(profile.gems || 0);
        }
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setBalance(0);
      setGems(0);
      setCurrentGame(null);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const updateGems = (amount: number) => {
    setGems(prev => prev + amount);
  };

  const startGame = (gameType: string) => {
    const game = {
      id: uuidv4(),
      type: gameType,
      startTime: new Date(),
      status: 'active',
      score: 0,
      numbersCalled: [],
      bingoLines: 0,
    };
    setCurrentGame(game);
  };

  const endGame = (score: number) => {
    if (currentGame) {
      const endedGame = {
        ...currentGame,
        status: 'completed',
        endTime: new Date(),
        score,
      };
      
      setGameHistory(prev => [endedGame, ...prev]);
      setCurrentGame(null);
      
      // Award gems based on score
      const gemsEarned = Math.floor(score / 100);
      if (gemsEarned > 0) {
        updateGems(gemsEarned);
        toast({
          title: "Game Complete!",
          description: `You earned ${gemsEarned} gems!`,
        });
      }
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile);
            setBalance(profile.balance || 0);
            setGems(profile.gems || 0);
          }
        } else {
          setUser(null);
          setBalance(0);
          setGems(0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        balance,
        gems,
        isAuthenticated: !!user,
        currentGame,
        gameHistory,
        login,
        logout,
        updateBalance,
        updateGems,
        startGame,
        endGame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
