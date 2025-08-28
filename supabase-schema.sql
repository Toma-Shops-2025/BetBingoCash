-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  balance DECIMAL(10,2) DEFAULT 0.00,
  gems INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('bingo', 'tournament', 'daily')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  score INTEGER DEFAULT 0,
  numbers_called INTEGER[] DEFAULT '{}',
  bingo_lines INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'win', 'loss', 'bonus')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  entry_fee DECIMAL(10,2) DEFAULT 0.00,
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  max_players INTEGER DEFAULT 100,
  current_players INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- Create leaderboard table (for caching)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  total_score BIGINT DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  bingo_lines INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_rewards table
CREATE TABLE IF NOT EXISTS daily_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('gems', 'balance', 'bonus')),
  reward_amount DECIMAL(10,2) NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, DATE(claimed_at))
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Games policies
CREATE POLICY "Users can view own games" ON games FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own games" ON games FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own games" ON games FOR UPDATE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tournaments are public
CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join tournaments" ON tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard is public
CREATE POLICY "Anyone can view leaderboard" ON leaderboard FOR SELECT USING (true);

-- Daily rewards policies
CREATE POLICY "Users can view own rewards" ON daily_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim own rewards" ON daily_rewards FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard(total_score DESC);

-- Create function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance(
  user_uuid UUID,
  amount_change DECIMAL(10,2)
) RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET balance = balance + amount_change,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user gems
CREATE OR REPLACE FUNCTION update_user_gems(
  user_uuid UUID,
  gems_change INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET gems = gems + gems_change,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard(
  user_uuid UUID
) RETURNS VOID AS $$
BEGIN
  INSERT INTO leaderboard (user_id, username, total_score, games_played, bingo_lines, updated_at)
  SELECT 
    u.id,
    u.username,
    COALESCE(SUM(g.score), 0),
    COUNT(g.id),
    COALESCE(SUM(g.bingo_lines), 0),
    NOW()
  FROM users u
  LEFT JOIN games g ON u.id = g.user_id AND g.status = 'completed'
  WHERE u.id = user_uuid
  GROUP BY u.id, u.username
  
  ON CONFLICT (user_id) 
  DO UPDATE SET
    username = EXCLUDED.username,
    total_score = EXCLUDED.total_score,
    games_played = EXCLUDED.games_played,
    bingo_lines = EXCLUDED.bingo_lines,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 