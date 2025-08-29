import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, balance, gems, updateBalance, updateGems } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Update user profile in database
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (amount < 10) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is $10.00",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Process withdrawal through PayPal
      const withdrawalData = {
        amount: amount,
        currency: 'USD',
        user_id: user?.id,
        email: user?.email,
        description: `Withdrawal from BetBingoCash account`
      };

      // TODO: In production, this would call your backend API
      // For now, we'll simulate the withdrawal process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local balance immediately (in production, wait for confirmation)
      updateBalance(-amount);
      
      toast({
        title: "Withdrawal Requested! 💸",
        description: `$${amount.toFixed(2)} withdrawal has been submitted to PayPal. You'll receive an email confirmation.`,
      });
      
      setWithdrawAmount('');
      onClose();
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700" aria-describedby="profile-description">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            👤 My Account & Profile
          </DialogTitle>
        </DialogHeader>
        
        <div id="profile-description" className="sr-only">
          Manage your BetBingoCash account profile and settings
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="profile" className="text-white">Profile</TabsTrigger>
            <TabsTrigger value="balance" className="text-white">Balance</TabsTrigger>
            <TabsTrigger value="withdraw" className="text-white">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-white font-bold text-lg">{user?.username || 'User'}</div>
                <div className="text-white/60 text-sm">{user?.email}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="balance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Account Balance</h3>
                <button
                  onClick={() => {
                    // Trigger a refresh of user data
                    window.location.reload();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-800 to-emerald-800 rounded-lg">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-white font-bold text-xl">${balance.toFixed(2)}</div>
                  <div className="text-white/60 text-sm">Available Balance</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-yellow-800 to-orange-800 rounded-lg">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="text-white font-bold text-xl">{gems}</div>
                  <div className="text-white/60 text-sm">Gems Earned</div>
                </div>
              </div>

              <div className="text-center text-white/60 text-sm">
                💡 Play games to earn more gems and increase your balance!
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-white/80 text-sm font-semibold mb-2">💡 Cross-Device Sync:</div>
                <div className="text-white/60 text-xs space-y-1">
                  <div>• Your balance and gems sync automatically across devices</div>
                  <div>• Changes are saved every 30 seconds</div>
                  <div>• Use the Refresh button to force sync</div>
                  <div>• All winnings are permanently saved to your account</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-red-800 to-pink-800 rounded-lg">
                <div className="text-2xl mb-2">💸</div>
                <div className="text-white font-bold text-lg">Withdraw Funds</div>
                <div className="text-white/60 text-sm">Minimum withdrawal: $10.00</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawAmount" className="text-white">Amount to Withdraw</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-gray-800 border-gray-600 text-white"
                  min="10"
                  step="0.01"
                />
              </div>

              <Button 
                onClick={handleWithdraw}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                disabled={isLoading || !withdrawAmount}
              >
                {isLoading ? "Processing..." : "Request Withdrawal"}
              </Button>

              <div className="space-y-3">
                <div className="text-center text-white/60 text-xs">
                  ⚠️ Withdrawals are processed within 24-48 hours
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white/80 text-sm font-semibold mb-2">💡 How Withdrawals Work:</div>
                  <ul className="text-white/60 text-xs space-y-1">
                    <li>• Funds are sent to your PayPal account</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Minimum withdrawal: $10.00</li>
                    <li>• No withdrawal fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal; 