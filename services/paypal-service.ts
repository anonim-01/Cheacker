import { paymentProviders } from "@/config/payment-providers"

// PayPal API entegrasyonu
export async function validateCardWithPaypal(cardNumber: string, month: string, year: string, cvv: string) {
  try {
    // API anahtarları kontrolü
    if (!paymentProviders.paypal.clientId || !paymentProviders.paypal.clientSecret) {
      throw new Error("PayPal API anahtarları bulunamadı")
    }

    // Gerçek bir PayPal API entegrasyonu burada olacaktır
    // Şu anda simülasyon yapıyoruz

    // Canlı mod bilgisini ekle
    const isLiveMode = paymentProviders.paypal.mode === "live"

    // Kart numarasının ilk rakamına göre kart tipini belirle
    const cardTypes: { [key: string]: string } = {
      "4": "visa",
      "5": "mastercard",
      "3": "amex",
      "6": "discover",
    }

    const firstDigit = cardNumber.charAt(0)
    const brand = cardTypes[firstDigit] || "unknown"

    // Simüle edilmiş yanıt
    return {
      success: true,
      liveMode: isLiveMode,
      card: {
        brand: brand,
        country: "US",
        funding: "credit",
        threeDSecure: Math.random() > 0.5,
        cvcCheck: Math.random() > 0.2 ? "pass" : "fail",
      },
      status: Math.random() > 0.5 ? "CANLI" : "ÖLÜ",
      virtualPos: Math.random() > 0.3,
      mailOrderPos: Math.random() > 0.4,
      limit: Math.floor(Math.random() * 8000) + 500, // USD cinsinden
    }
  } catch (error) {
    console.error("PayPal validation error:", error)
    throw new Error("PayPal kart doğrulama hatası")
  }
}

