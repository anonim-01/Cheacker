import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // URL'den referans kodunu al
    const url = new URL(request.url)
    const referenceCode = url.searchParams.get("referenceCode")

    if (!referenceCode) {
      return NextResponse.json({ error: "Referans kodu bulunamadı" }, { status: 400 })
    }

    // Ödeal API dokümanına göre sepet verisi
    const basketData = {
      referenceCode: referenceCode,
      externalDeviceKey: "web-device",
      receiptInfo: "Örnek fiş bilgisi",
      customInfo: "Özel bilgi",
      customer: {
        referenceCode: `CUST-${Date.now()}`,
        type: "INDIVIDUAL", // INDIVIDUAL veya CORPORATE
        title: "Sayın",
        name: "Örnek",
        surname: "Müşteri",
        gsmNumber: "5551234567",
        email: "ornek@mail.com",
        city: "İstanbul",
        town: "Kadıköy",
        address: "Örnek Mahallesi, Örnek Sokak No:1",
      },
      price: {
        grossPrice: 100.0,
      },
      items: [
        {
          quantity: 1,
          product: {
            unitCode: "ADET",
            name: "Örnek Ürün",
            referenceCode: "PROD-001",
            price: {
              grossPrice: 100.0,
              vatRatio: 18,
              sctRatio: 0,
            },
          },
        },
      ],
    }

    return NextResponse.json(basketData)
  } catch (error: any) {
    console.error("Sepet bilgisi getirme hatası:", error)
    return NextResponse.json(
      { error: error.message || "Sepet bilgisi getirme sırasında bir hata oluştu" },
      { status: 500 },
    )
  }
}

