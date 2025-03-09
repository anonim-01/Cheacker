import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function PaymentFailedPage() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
      <div className="apple-card max-w-md w-full">
        <div className="apple-card-header text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="apple-card-title">Ödeme Başarısız</h2>
          <p className="apple-card-description">Ödeme işleminiz tamamlanamadı.</p>
        </div>
        <div className="apple-card-content text-center">
          <p className="text-lg">
            Ödeme işleminiz sırasında bir hata oluştu. Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz.
          </p>
        </div>
        <div className="apple-card-footer flex justify-center gap-4">
          <Link href="/payment">
            <button className="apple-button">Tekrar Dene</button>
          </Link>
          <Link href="/">
            <button className="apple-button bg-gray-500 hover:bg-gray-600">Ana Sayfaya Dön</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

