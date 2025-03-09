export const paymentProviders = {
  stripe: {
    name: "Stripe",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    mode: process.env.STRIPE_MODE || "test",
  },
  odeal: {
    name: "Ödeal",
    apiKey: process.env.ODEAL_API_KEY || "285b98586e7988803485b8605c2f13069ffd38b465c8cfdf63ef657a7338c84a",
    merchantId: process.env.ODEAL_MERCHANT_ID || "3af988c4-7040-476b-ad8e-70334b52d621",
    requestKey: process.env.ODEAL_REQUEST_KEY || "odeal-request-key-123456",
    mode: process.env.ODEAL_MODE || "stage", // "stage" veya "prod"
    apiUrl: process.env.ODEAL_API_URL || "https://stage.odealapp.com/api/v1",
    leadApiUrl: process.env.ODEAL_LEAD_API_URL || "https://stage.odealapp.com/lead-api/v1",
    integrationProfile: process.env.ODEAL_INTEGRATION_PROFILE || "internal-basket",
    basketType: process.env.ODEAL_BASKET_TYPE || "SIMPLE",
  },
  paypal: {
    name: "PayPal",
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
    mode: process.env.PAYPAL_MODE || "test",
  },
}

export type PaymentProvider = "stripe" | "odeal" | "paypal"

