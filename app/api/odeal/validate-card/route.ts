import { NextResponse } from "next/server"
import { paymentProviders } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    const { cardNumber, expireMonth, expireYear, cvc } = await request.json()

    // Girdileri doğrula
    if (!cardNumber || !expireMonth || !expireYear || !cvc) {
      return NextResponse.json({ error: "Tüm kart bilgilerini giriniz" }, { status: 400 })
    }

    console.log("Ödeal kart doğrulama simülasyon modunda çalışıyor")

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
    const simulatedResponse = {
      success: true,
      liveMode: paymentProviders.odeal.mode === "prod",
      card: {
        brand: brand,
        country: "TR",
        funding: "credit",
        threeDSecure: Math.random() > 0.3,
        cvcCheck: Math.random() > 0.1 ? "pass" : "fail",
      },
      status: Math.random() > 0.4 ? "CANLI" : "ÖLÜ",
      virtualPos: Math.random() > 0.2,
      mailOrderPos: Math.random() > 0.5,
      limit: Math.floor(Math.random() * 15000) + 1000,
      simulatedResponse: true,
    }

    return NextResponse.json(simulatedResponse)
  } catch (error: any) {
    console.error("Ödeal kart doğrulama hatası:", error)

    // Hata durumunda bile simüle edilmiş yanıt döndür
    return NextResponse.json({
      success: true,
      liveMode: false,
      card: {
        brand: "unknown",
        country: "TR",
        funding: "credit",
        threeDSecure: false,
        cvcCheck: "fail",
      },
      status: "ÖLÜ",
      virtualPos: false,
      mailOrderPos: false,
      limit: 1000,
      simulatedResponse: true,
      error: error.message || "Bilinmeyen hata",
    })
  }
}

