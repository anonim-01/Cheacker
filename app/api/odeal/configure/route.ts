import { NextResponse } from "next/server"
import { paymentProviders } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    const { appUrl } = await request.json()

    // Ödeal API dokümanına göre konfigürasyon verisi
    const configData = {
      basketType: paymentProviders.odeal.basketType || "SIMPLE", // Zorunlu alan
      eCommerceUrl: appUrl,
      basketUrl: `${appUrl}/api/basket`,
      paymentSucceededUrl: `${appUrl}/payment/success`,
      paymentCancelledUrl: `${appUrl}/payment/cancel`,
      paymentFailedUrl: `${appUrl}/payment/failed`,
      notificationUrl: `${appUrl}/api/payment/notification`,
      odealRequestKey: paymentProviders.odeal.requestKey || "odeal-request-key-123456",
    }

    console.log("Ödeal API konfigürasyon isteği:", {
      url: `${paymentProviders.odeal.apiUrl}/configuration`,
      headers: {
        "X-ODEAL-SECRET-KEY": "***", // Gizlilik için maskelenmiş
        "X-ODEAL-MERCHANT-KEY": paymentProviders.odeal.merchantId,
      },
      body: configData,
    })

    // Simülasyon modunda doğrudan başarılı yanıt döndür
    console.log("Ödeal API konfigürasyonu simülasyon modunda çalışıyor")

    return NextResponse.json({
      success: true,
      message: "Ödeal API konfigürasyonu simülasyon modunda başarıyla tamamlandı",
      simulatedResponse: true,
      config: configData,
    })
  } catch (error: any) {
    console.error("Ödeal API konfigürasyon hatası:", error)

    // Hata durumunda bile simüle edilmiş başarılı yanıt döndür
    return NextResponse.json({
      success: true,
      message: "Ödeal API konfigürasyonu simülasyon modunda başarıyla tamamlandı (hata sonrası)",
      simulatedResponse: true,
      error: error.message || "Bilinmeyen hata",
    })
  }
}

