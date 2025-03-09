import { NextResponse } from "next/server"
import { paymentProviders } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    const leadData = await request.json()

    const isProduction = paymentProviders.odeal.mode === "prod"
    const baseUrl = isProduction ? "https://apigw.odeal.com/lead-api/v1" : "https://stage.odealapp.com/lead-api/v1"

    const response = await fetch(`${baseUrl}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ODEAL-SECRET-KEY": paymentProviders.odeal.apiKey,
        "X-ODEAL-MERCHANT-KEY": paymentProviders.odeal.merchantId,
      },
      body: JSON.stringify(leadData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Lead oluşturma hatası: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Lead oluşturma hatası:", error)
    return NextResponse.json({ error: error.message || "Lead oluşturma sırasında bir hata oluştu" }, { status: 500 })
  }
}

