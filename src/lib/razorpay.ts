// Razorpay Integration Utilities
// Using test/sandbox credentials

const RAZORPAY_TEST_KEY_ID = "rzp_test_1DP5MMOk7YCFYZ";
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        resolve(false);
      }
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

/**
 * Create a Razorpay order via backend API
 */
export const createRazorpayOrder = async (
  amount: number,
  receipt: string
): Promise<RazorpayOrderResponse> => {
  const response = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Razorpay uses paise (smallest unit)
      currency: "INR",
      receipt,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return response.json();
};

/**
 * Verify payment via backend API
 */
export const verifyRazorpayPayment = async (
  paymentData: RazorpayPaymentData
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Payment verification failed");
  }

  return response.json();
};

/**
 * Open Razorpay payment modal
 */
export const openRazorpayCheckout = (
  orderId: string,
  amount: number,
  email: string,
  name: string,
  onSuccess: (data: RazorpayPaymentData) => void,
  onError: (error: Error) => void
) => {
  const options: any = {
    key: RAZORPAY_TEST_KEY_ID,
    amount: Math.round(amount * 100),
    currency: "INR",
    order_id: orderId,
    name: "Green Earth Credits",
    description: "Carbon Credits Retirement",
    prefill: {
      name,
      email,
    },
    theme: {
      color: "#10b981",
    },
    handler: function (response: RazorpayPaymentData) {
      onSuccess(response);
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();

  razorpay.on("payment.failed", function (response: any) {
    onError(new Error(`Payment failed: ${response.error.description}`));
  });
};

/**
 * Full payment flow: Create order -> Open checkout -> Verify payment
 */
export const initiateRazorpayPayment = async (
  amount: number,
  email: string,
  name: string,
  onSuccess: (paymentData: RazorpayPaymentData) => Promise<void>,
  onError: (error: Error) => void
) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay script");
    }

    // Create order on backend
    const receipt = `retirement-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const order = await createRazorpayOrder(amount, receipt);

    // Open checkout modal
    openRazorpayCheckout(
      order.id,
      amount,
      email,
      name,
      async (paymentData: RazorpayPaymentData) => {
        try {
          // Verify payment on backend
          const verification = await verifyRazorpayPayment(paymentData);

          if (verification.success) {
            await onSuccess(paymentData);
          } else {
            throw new Error("Payment verification failed");
          }
        } catch (error) {
          onError(error instanceof Error ? error : new Error("Payment verification error"));
        }
      },
      onError
    );
  } catch (error) {
    onError(error instanceof Error ? error : new Error("Payment initiation failed"));
  }
};
