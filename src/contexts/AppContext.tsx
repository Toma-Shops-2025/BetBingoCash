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

  // Debug authentication state
  console.log('AppProvider - user state:', user, 'isAuthenticated will be:', !!user);

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
        console.log('Login successful, user:', data.user.id);
        
        // Create or fetch user profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Table doesn't exist yet, create a basic user profile
            console.log('Users table not found, creating basic profile');
            const basicProfile = {
              id: data.user.id,
              email: data.user.email || '',
              username: data.user.user_metadata?.username || 'User',
              balance: 55.00, // $50 bonus + $5 starting balance
              gems: 160,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(basicProfile);
            setBalance(basicProfile.balance);
            setGems(basicProfile.gems);
            
            // Show welcome bonus message
            toast({
              title: "🎉 Welcome to BetBingoCash!",
              description: "You've received a $50 welcome bonus!",
            });
          } else if (profile) {
            console.log('Profile found:', profile);
            setUser(profile);
            setBalance(profile.balance || 0);
            setGems(profile.gems || 0);
          } else {
            // No profile found, create basic one
            console.log('No profile found, creating basic profile');
            const basicProfile = {
              id: data.user.id,
              email: data.user.email || '',
              username: data.user.user_metadata?.username || 'User',
              balance: 55.00, // $50 bonus + $5 starting balance
              gems: 160,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(basicProfile);
            setBalance(basicProfile.balance);
            setGems(basicProfile.gems);
          }
        } catch (dbError) {
          console.log('Database error, using basic profile:', dbError);
          // Use basic profile if database is not set up
          const basicProfile = {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username || 'User',
            balance: 55.00, // $50 bonus + $5 starting balance
            gems: 160,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(basicProfile);
          setBalance(basicProfile.balance);
          setGems(basicProfile.gems);
          
          toast({
            title: "🎉 Welcome to BetBingoCash!",
            description: "You've received a $50 welcome bonus!",
          });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
    // Check for existing session first
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Existing session found on mount:', session.user.id);
        
        // Create basic profile immediately
        const basicProfile = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || 'User',
          balance: 55.00,
          gems: 160,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(basicProfile);
        setBalance(basicProfile.balance);
        setGems(basicProfile.gems);
        console.log('Basic profile set from existing session');
      }
    };
    
    checkExistingSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          console.log('Session found, creating user profile...');
          
          // Immediately create a basic user profile to avoid delays
          const basicProfile = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || 'User',
            balance: 55.00, // $50 bonus + $5 starting balance
            gems: 160,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Set user state immediately
          setUser(basicProfile);
          setBalance(basicProfile.balance);
          setGems(basicProfile.gems);
          
          console.log('Basic profile set immediately:', basicProfile);
          
          // Try to fetch from database in background
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile && !profileError) {
              console.log('Database profile found, updating:', profile);
              setUser(profile);
              setBalance(profile.balance || 0);
              setGems(profile.gems || 0);
            } else {
              console.log('No database profile, keeping basic profile');
            }
          } catch (dbError) {
            console.log('Database error, keeping basic profile:', dbError);
          }
        } else {
          console.log('No session, clearing user state');
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
