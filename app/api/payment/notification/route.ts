import { NextResponse } from "next/server"
import { paymentProviders } from "@/config/payment-providers"

export async function POST(request: Request) {
  try {
    // Ödeal'den gelen bildirim verilerini al
    const notificationData = await request.json()

    // Ödeal'den gelen isteğin doğruluğunu kontrol et
    const odealRequestKey = request.headers.get("X-ODEAL-REQUEST-KEY")

    if (odealRequestKey !== paymentProviders.odeal.requestKey) {
      console.error("Geçersiz Ödeal istek anahtarı:", odealRequestKey)
      return NextResponse.json({ error: "Geçersiz istek anahtarı" }, { status: 401 })
    }

    // Bildirim verilerini işle
    console.log("Ödeal bildirim verileri:", notificationData)

    // İşlem durumunu kontrol et
    const { status, transactionId, amount, currency } = notificationData

    // Burada veritabanına kaydetme, e-posta gönderme vb. işlemler yapılabilir
    // Örnek: Veritabanında işlem durumunu güncelle
    // await db.transaction.update({ where: { id: transactionId }, data: { status } })

    // Başarılı yanıt döndür
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ödeal bildirim işleme hatası:", error)
    return NextResponse.json({ error: error.message || "Bildirim işlemi sırasında bir hata oluştu" }, { status: 500 })
  }
}

