import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { transactionId, reason } = await request.json()

    // İptal bilgilerini işle
    console.log("İptal edilen ödeme bildirimi:", { transactionId, reason })

    // Burada veritabanına kaydetme, e-posta gönderme vb. işlemler yapılabilir

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ödeme iptal bildirimi işleme hatası:", error)
    return NextResponse.json({ error: error.message || "Bildirim işlemi sırasında bir hata oluştu" }, { status: 500 })
  }
}

