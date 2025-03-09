import { NextResponse } from "next/server"
import { paymentProviders } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    const { amount, description } = await request.json()

    if (!amount) {
      return NextResponse.json({ error: "Tutar belirtilmelidir" }, { status: 400 })
    }

    const isProduction = paymentProviders.odeal.mode === "prod"
    const baseUrl = isProduction ? "https://api.odeal.com/api/v1" : "https://stage.odealapp.com/api/v1"

    const response = await fetch(`${baseUrl}/qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ODEAL-SECRET-KEY": paymentProviders.odeal.apiKey,
        "X-ODEAL-MERCHANT-KEY": paymentProviders.odeal.merchantId,
      },
      body: JSON.stringify({ amount, description }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`QR kod oluşturma hatası: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("QR kod oluşturma hatası:", error)
    return NextResponse.json({ error: error.message || "QR kod oluşturma sırasında bir hata oluştu" }, { status: 500 })
  }
}

