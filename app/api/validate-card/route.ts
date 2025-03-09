import { NextResponse } from "next/server"
import { validateCardWithStripe } from "@/services/stripe-service"
import { validateCardWithOdeal } from "@/services/odeal-service"
import { validateCardWithPaypal } from "@/services/paypal-service"
import type { PaymentProvider } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    const { cardNumber, month, year, cvv, provider = "stripe" } = await request.json()

    // Validate inputs server-side
    if (!cardNumber || !month || !year || !cvv) {
      return NextResponse.json({ error: "Geçersiz kart bilgileri" }, { status: 400 })
    }

    let result

    // Seçilen ödeme sağlayıcısına göre doğrulama yap
    switch (provider as PaymentProvider) {
      case "stripe":
        result = await validateCardWithStripe(cardNumber, month, year, cvv)
        break
      case "odeal":
        result = await validateCardWithOdeal(cardNumber, month, year, cvv)
        break
      case "paypal":
        result = await validateCardWithPaypal(cardNumber, month, year, cvv)
        break
      default:
        return NextResponse.json({ error: "Geçersiz ödeme sağlayıcısı" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error validating card:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}

