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

export const createPayPalOrder = async (amount: number) => {
  try {
    const response = await fetch('/api/create-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toFixed(2),
        currency: paypalConfig.currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const order = await response.json();
    return order.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

export const capturePayPalOrder = async (orderId: string) => {
  try {
    const response = await fetch('/api/capture-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal order');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
};

// PayPal button configuration
export const paypalButtonConfig = {
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
      throw error;
    }
  },
  onError: (err: any) => {
    console.error('PayPal error:', err);
    throw new Error('PayPal payment failed');
  },
}; 