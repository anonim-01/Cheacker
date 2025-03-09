import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
      <div className="apple-card max-w-md w-full">
        <div className="apple-card-header text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="apple-card-title">Ödeme İptal Edildi</h2>
          <p className="apple-card-description">Ödeme işleminiz iptal edildi.</p>
        </div>
        <div className="apple-card-content text-center">
          <p className="text-lg">
            Ödeme işleminiz tamamlanamadı veya iptal edildi. Tekrar denemek için aşağıdaki butona tıklayabilirsiniz.
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

