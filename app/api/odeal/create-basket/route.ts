import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const basketData = await request.json()

    // Zorunlu alanları kontrol et
    if (!basketData.referenceCode) {
      return NextResponse.json({ error: "Sepet referans kodu zorunludur" }, { status: 400 })
    }

    if (!basketData.price || !basketData.price.grossPrice) {
      return NextResponse.json({ error: "Sepet fiyat bilgisi zorunludur" }, { status: 400 })
    }

    if (!basketData.items || !basketData.items.length) {
      return NextResponse.json({ error: "Sepet ürün bilgisi zorunludur" }, { status: 400 })
    }

    // Simülasyon modunda doğrudan başarılı yanıt döndür
    console.log("Ödeal sepet oluşturma simülasyon modunda çalışıyor")

    return NextResponse.json({
      success: true,
      basketId: `BASKET-${Date.now()}`,
      referenceCode: basketData.referenceCode,
      message: "Sepet başarıyla oluşturuldu (simülasyon modu)",
      simulatedResponse: true,
    })
  } catch (error: any) {
    console.error("Sepet oluşturma hatası:", error)
    return NextResponse.json(
      {
        error: error.message || "Sepet oluşturma sırasında bir hata oluştu",
        simulatedResponse: true,
      },
      { status: 500 },
    )
  }
}

