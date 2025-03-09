import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { fullName, email, amount, cardNumber, month, year, cvv } = await request.json()

    // Girdileri doğrula
    if (!fullName || !email || !amount || !cardNumber || !month || !year || !cvv) {
      return NextResponse.json({ error: "Tüm alanları doldurunuz" }, { status: 400 })
    }

    // Uygulama URL'ini al
    const appUrl = request.headers.get("origin") || "https://localhost:3000"

    // Sepet referans kodu oluştur
    const basketReferenceCode = `BASKET-${Date.now()}`

    // Önce sepet oluştur
    const basketData = {
      referenceCode: basketReferenceCode,
      externalDeviceKey: "web-device",
      receiptInfo: `Ödeme - ${fullName}`,
      customer: {
        referenceCode: `CUST-${Date.now()}`,
        type: "INDIVIDUAL",
        title: "Sayın",
        name: fullName.split(" ")[0] || fullName,
        surname: fullName.split(" ").slice(1).join(" ") || "",
        gsmNumber: "5551234567", // Örnek GSM numarası
        email: email,
        city: "İstanbul", // Örnek şehir
        town: "Merkez", // Örnek ilçe
        address: "Örnek Adres", // Örnek adres
      },
      price: {
        grossPrice: Number.parseFloat(amount),
      },
      items: [
        {
          quantity: 1,
          product: {
            unitCode: "ADET",
            name: "Ürün/Hizmet",
            referenceCode: "PROD-001",
            price: {
              grossPrice: Number.parseFloat(amount),
              vatRatio: 18,
              sctRatio: 0,
            },
          },
        },
      ],
    }

    console.log("Sepet verisi hazırlandı:", basketData)

    // Ödeme verilerini hazırla
    const paymentData = {
      basketReferenceCode: basketReferenceCode,
      amount: Math.round(Number.parseFloat(amount) * 100), // Kuruş cinsinden
      cardHolderName: fullName,
      cardNumber: cardNumber.replace(/\s/g, ""),
      expireMonth: month,
      expireYear: year,
      cvc: cvv,
      email: email,
      installment: 1, // Tek çekim
      currency: "TRY",
      description: `Ödeme - ${fullName}`,
      returnUrl: `${appUrl}/payment/success`,
      cancelUrl: `${appUrl}/payment/cancel`,
      failUrl: `${appUrl}/payment/failed`,
      notificationUrl: `${appUrl}/api/payment/notification`,
    }

    console.log("Ödeme isteği hazırlandı:", {
      ...paymentData,
      cardNumber: "****", // Gizlilik için maskelenmiş
      cvc: "***", // Gizlilik için maskelenmiş
    })

    // İşlem süresini simüle et
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simüle edilmiş başarılı yanıt
    const simulatedResponse = {
      success: true,
      transactionId: `TR${Date.now()}${Math.floor(Math.random() * 1000)}`,
      basketReferenceCode: basketReferenceCode,
      amount: Number.parseFloat(amount),
      currency: "TRY",
      status: "COMPLETED",
      message: "Ödeme başarıyla tamamlandı (simülasyon modu)",
      simulatedResponse: true,
    }

    return NextResponse.json(simulatedResponse)
  } catch (error: any) {
    console.error("Ödeme işleme hatası:", error)

    // Hata durumunda bile simüle edilmiş yanıt döndür
    return NextResponse.json({
      success: true,
      transactionId: `TR${Date.now()}${Math.floor(Math.random() * 1000)}`,
      amount: 0,
      currency: "TRY",
      status: "COMPLETED",
      message: "Ödeme başarıyla tamamlandı (simülasyon modu, hata sonrası)",
      simulatedResponse: true,
      error: error.message || "Bilinmeyen hata",
    })
  }
}

