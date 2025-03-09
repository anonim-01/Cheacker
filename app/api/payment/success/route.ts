import { NextResponse } from "next/server"
import { getTransactionStatus } from "@/services/odeal-service"

export async function POST(request: Request) {
  try {
    const { transactionId } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: "İşlem ID'si bulunamadı" }, { status: 400 })
    }

    // İşlem durumunu sorgula
    const transactionStatus = await getTransactionStatus(transactionId)

    // Burada veritabanına kaydetme, e-posta gönderme vb. işlemler yapılabilir

    return NextResponse.json({ success: true, transaction: transactionStatus })
  } catch (error: any) {
    console.error("Ödeme başarı bildirimi işleme hatası:", error)
    return NextResponse.json({ error: error.message || "Bildirim işlemi sırasında bir hata oluştu" }, { status: 500 })
  }
}

