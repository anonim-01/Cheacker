import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
      <div className="apple-card max-w-md w-full">
        <div className="apple-card-header text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="apple-card-title">Ödeme Başarılı</h2>
          <p className="apple-card-description">Ödemeniz başarıyla tamamlandı.</p>
        </div>
        <div className="apple-card-content text-center">
          <p className="text-lg">
            Ödeme işleminiz başarıyla gerçekleştirildi. İşlem detayları e-posta adresinize gönderilecektir.
          </p>
        </div>
        <div className="apple-card-footer flex justify-center">
          <Link href="/">
            <button className="apple-button">Ana Sayfaya Dön</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

