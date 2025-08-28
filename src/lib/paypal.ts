// PayPal configuration and integration
export interface PayPalConfig {
  clientId: string;
  environment: 'sandbox' | 'live';
  currency: string;
}

export const paypalConfig: PayPalConfig = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  environment: (import.meta.env.VITE_PAYPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
  currency: 'USD'
};

// PayPal button configuration
export const paypalButtonConfig = {
  style: {
    layout: 'vertical' as const,
    color: 'blue' as const,
    shape: 'rect' as const,
    label: 'pay' as const,
  },
  createOrder: (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: data.amount,
            currency_code: paypalConfig.currency,
          },
          description: `Add funds to BetBingoCash account`,
        },
      ],
    });
  },
  onApprove: async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();

      // Handle successful payment
      if (order.status === 'COMPLETED') {
        return {
          success: true,
          orderId: order.id,
          amount: parseFloat(order.purchase_units[0].amount.value),
          payerId: order.payer.payer_id,
        };
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw new Error('PayPal payment failed');
    }
  },
  onError: (err: any) => {
    console.error('PayPal error:', err);
    throw new Error('PayPal payment failed');
  },
};

// PayPal withdrawal functions (for future backend integration)
export const createPayPalWithdrawal = async (amount: number, email: string) => {
  try {
    // This would call your backend API to process PayPal withdrawal
    const response = await fetch('/api/paypal/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toFixed(2),
        currency: paypalConfig.currency,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create withdrawal request');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating PayPal withdrawal:', error);
    throw error;
  }
};

export const getPayPalWithdrawalStatus = async (withdrawalId: string) => {
  try {
    const response = await fetch(`/api/paypal/withdraw/${withdrawalId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get withdrawal status');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting withdrawal status:', error);
    throw error;
  }
}; 