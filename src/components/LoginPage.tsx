import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, createAccount } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email);
        toast({
          title: "✅ Login Successful",
          description: "Welcome back to BetBingo!",
          variant: "default"
        });
      } else {
        await createAccount(username, email);
        toast({
          title: "✅ Account Created",
          description: "Welcome to BetBingo! Your account has been created.",
          variant: "default"
        });
      }
      
      navigate('/');
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 casino-neon">🎰 BetBingo</h1>
          <p className="text-white/80 text-lg">Welcome to the ultimate casino experience!</p>
        </div>

        {/* Login/Register Card */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">
              {isLogin ? '🔐 Welcome Back' : '✨ Create Account'}
            </CardTitle>
            <p className="text-white/60">
              {isLogin ? 'Sign in to continue playing' : 'Join us and start winning big!'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/20 text-white border-white/30 placeholder:text-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 text-white border-white/30 placeholder:text-white/50"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 text-lg disabled:opacity-50"
              >
                {isLoading ? '⏳ Processing...' : (isLogin ? '🚀 Sign In' : '🎉 Create Account')}
              </Button>
            </form>

            {/* Toggle between login and register */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Create one here" 
                  : "Already have an account? Sign in here"
                }
              </button>
            </div>

            {/* Demo Account Info */}
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <h3 className="text-white font-semibold mb-2">🎮 Demo Mode</h3>
              <p className="text-white/70 text-sm mb-2">
                For testing purposes, you can use any username and email to create an account.
              </p>
              <p className="text-white/70 text-sm">
                Your data is stored locally and will persist between sessions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white/60 hover:text-white"
          >
            ← Back to Casino
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 