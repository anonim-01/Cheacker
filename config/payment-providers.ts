import { env } from "@/lib/env"

export const paymentProviders = {
  stripe: {
    name: "Stripe",
    secretKey: env.STRIPE_SECRET_KEY || "",
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    mode: env.STRIPE_MODE || "test",
  },
  odeal: {
    name: "Ödeal",
    apiKey: env.ODEAL_API_KEY || "285b98586e7988803485b8605c2f13069ffd38b465c8cfdf63ef657a7338c84a",
    merchantId: env.ODEAL_MERCHANT_ID || "3af988c4-7040-476b-ad8e-70334b52d621",
    requestKey: env.ODEAL_REQUEST_KEY || "odeal-request-key-123456",
    mode: env.ODEAL_MODE || "stage", // "stage" veya "prod"
    apiUrl: env.ODEAL_API_URL || "https://stage.odealapp.com/api/v1",
    leadApiUrl: env.ODEAL_LEAD_API_URL || "https://stage.odealapp.com/lead-api/v1",
    integrationProfile: env.ODEAL_INTEGRATION_PROFILE || "internal-basket",
    basketType: env.ODEAL_BASKET_TYPE || "SIMPLE",
  },
  paypal: {
    name: "PayPal",
    clientId: env.PAYPAL_CLIENT_ID || "",
    clientSecret: env.PAYPAL_CLIENT_SECRET || "",
    mode: env.PAYPAL_MODE || "test",
  },
}

export type PaymentProvider = "stripe" | "odeal" | "paypal"

