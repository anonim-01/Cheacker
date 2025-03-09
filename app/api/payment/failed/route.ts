import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { transactionId, errorCode, errorMessage } = await request.json()

    // Hata bilgilerini işle
    console.log("Başarısız ödeme bildirimi:", { transactionId, errorCode, errorMessage })

    // Burada veritabanına kaydetme, e-posta gönderme vb. işlemler yapılabilir

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ödeme hata bildirimi işleme hatası:", error)
    return NextResponse.json({ error: error.message || "Bildirim işlemi sırasında bir hata oluştu" }, { status: 500 })
  }
}

