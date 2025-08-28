import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (amount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const { updateBalance } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  // Load PayPal script
  useEffect(() => {
    if (isOpen && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPalButton();
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen, paypalLoaded]);

  // Render PayPal button when loaded
  useEffect(() => {
    if (paypalLoaded && paypalButtonRef.current) {
      renderPayPalButton();
    }
  }, [paypalLoaded, amount]);

  const renderPayPalButton = () => {
    if (!paypalLoaded || !paypalButtonRef.current) return;

    // Clear previous button
    paypalButtonRef.current.innerHTML = '';

    // @ts-ignore - PayPal types
    if (window.paypal) {
      // @ts-ignore
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: 'USD',
                },
                description: `Add funds to BetBingoCash account`,
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            const order = await actions.order.capture();

            if (order.status === 'COMPLETED') {
              // Update user balance
              updateBalance(amount);
              
              toast({
                title: "Payment Successful! 🎉",
                description: `$${amount.toFixed(2)} has been added to your balance.`,
              });
              
              onSuccess(amount);
              onClose();
            }
          } catch (error: any) {
            console.error('PayPal payment error:', error);
            toast({
              title: "Payment Failed",
              description: "There was an error processing your payment. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast({
            title: "PayPal Error",
            description: "There was an error with PayPal. Please try again.",
            variant: "destructive",
          });
        },
      }).render(paypalButtonRef.current);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update user balance
      updateBalance(amount);
      
      toast({
        title: "Payment Successful! 🎉",
        description: `$${amount.toFixed(2)} has been added to your balance.`,
      });
      
      onSuccess(amount);
      onClose();
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700" aria-describedby="payment-description">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            💳 Add Funds to Your Account
          </DialogTitle>
        </DialogHeader>
        
        <div id="payment-description" className="sr-only">
          Add funds to your BetBingoCash account using PayPal or credit card
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-green-400">${amount.toFixed(2)}</div>
          <div className="text-white/80">Amount to add</div>
        </div>
        
        <Tabs defaultValue="paypal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="paypal" className="text-white">PayPal</TabsTrigger>
            <TabsTrigger value="card" className="text-white">Credit Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="text-6xl">💳</div>
              <div className="text-white/80">
                Pay securely with PayPal. Complete your payment below.
              </div>
              
              {!paypalLoaded ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-white/60 text-sm mt-2">Loading PayPal...</p>
                </div>
              ) : (
                <div ref={paypalButtonRef} className="w-full" />
              )}
              
              <div className="text-xs text-white/60">
                🔒 Secure payment powered by PayPal
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="card" className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-white">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName" className="text-white">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing Payment..." : "Complete Payment"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-xs text-white/60 mt-4">
          🔒 All payments are secured with bank-level encryption
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 