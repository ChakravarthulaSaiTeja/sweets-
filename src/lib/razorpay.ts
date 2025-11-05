/**
 * Razorpay Client Configuration
 * 
 * Initializes Razorpay client for payment processing
 * Lazy loaded to avoid build-time initialization
 */

let razorpayInstance: any = null;
let RazorpayModule: any = null;

/**
 * Get Razorpay instance (lazy loaded)
 * Returns null if Razorpay keys are not configured
 */
export async function getRazorpay(): Promise<any> {
  // Lazy load Razorpay module only when needed
  if (!RazorpayModule) {
    try {
      RazorpayModule = await import("razorpay");
    } catch (error) {
      console.warn("Razorpay module not available");
      return null;
    }
  }

  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    // Return null if keys are not set (optional for COD-only mode)
    if (!keyId || !keySecret) {
      return null;
    }
    
    razorpayInstance = new RazorpayModule.default({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  
  return razorpayInstance;
}

