"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { type PaymentProvider, paymentProviders } from "@/config/payment-providers"

interface CardValidationResult {
  card: {
    brand: string
    country: string
    funding: string
    threeDSecure: boolean
    cvcCheck: string
  }
  status: string
  virtualPos: boolean
  mailOrderPos: boolean
  limit: number
  liveMode: boolean
}

export default function Home() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CardValidationResult | null>(null)
  const [provider, setProvider] = useState<PaymentProvider>("stripe")
  const { toast } = useToast()

  const navigateToPayment = () => {
    window.location.href = "/payment"
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "")

    if (cleanValue.length <= 2) {
      return cleanValue
    }

    let month = cleanValue.substring(0, 2)
    const year = cleanValue.substring(2, 6)

    // Validate month
    if (Number.parseInt(month, 10) > 12) {
      month = "12"
    }

    return `${month}/${year}`
  }

  const validateInputs = () => {
    // Validate card number (basic check for length, we'll let the provider do the real validation)
    const cardDigits = cardNumber.replace(/\s/g, "")
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      toast({
        title: "Hata",
        description: "Kart numarası 13-19 haneli olmalıdır",
        variant: "destructive",
      })
      return false
    }

    // Validate expiry
    const expiryRegex = /^(0[1-9]|1[0-2])\/20\d{2}$/
    if (!expiryRegex.test(expiry)) {
      toast({
        title: "Hata",
        description: "Geçersiz son kullanma tarihi (AA/YYYY formatında olmalı)",
        variant: "destructive",
      })
      return false
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      toast({
        title: "Hata",
        description: "Geçersiz CVV kodu (3-4 haneli olmalı)",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleValidateCard = async () => {
    if (!validateInputs()) return

    setIsLoading(true)

    try {
      const [month, year] = expiry.split("/")

      const response = await fetch("/api/validate-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber: cardNumber.replace(/\s/g, ""),
          month,
          year,
          cvv,
          provider,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      toast({
        title: "Başarılı",
        description: `Kart ${paymentProviders[provider].name} ile başarıyla doğrulandı`,
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu",
        variant: "destructive",
      })
      console.error("Card validation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestCard = () => {
    // Fill in a test card based on the selected provider
    switch (provider) {
      case "stripe":
        setCardNumber("4242 4242 4242 4242")
        break
      case "odeal":
        setCardNumber("5555 5555 5555 4444")
        break
      case "paypal":
        setCardNumber("4111 1111 1111 1111")
        break
    }
    setExpiry("12/2025")
    setCvv("123")
  }

  return (
    <main>
      <div className="container">
        <div className="flex justify-between mb-4">
          <button onClick={fillTestCard} className="text-blue-500 hover:underline" type="button">
            Test Kartı Ekle
          </button>
          <div className="flex gap-4">
            <button onClick={navigateToPayment} className="text-blue-500 hover:underline" type="button">
              Ödeme Yap
            </button>
            <a href="/admin" className="text-blue-500 hover:underline">
              Yönetim Paneli
            </a>
          </div>
        </div>
        <h1>Ultimate Card Validator</h1>

        <div className="mb-4">
          <div className="flex justify-center space-x-4">
            {(Object.keys(paymentProviders) as PaymentProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-4 py-2 rounded-md ${
                  provider === p ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {paymentProviders[p].name}
                {paymentProviders[p].mode === "live" && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">LIVE</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Kart Numarası"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
          />
          <input
            type="text"
            placeholder="Son Kullanma (AA/YYYY)"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={7}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={4}
          />
        </div>

        <button onClick={handleValidateCard} disabled={isLoading}>
          {isLoading ? "İşleniyor..." : `▶ ${paymentProviders[provider].name} ile Kontrolü Başlat`}
        </button>

        {result && (
          <div className="results">
            <div className="result-card">
              <h3>Temel Bilgiler</h3>
              <div>
                <p>Tip: {result.card.brand}</p>
                <p>Ülke: {result.card.country}</p>
                <p>
                  Durum:
                  <span className={`status ${result.status === "CANLI" ? "live" : "dead"}`}>{result.status}</span>
                </p>
                <p>
                  Mod:
                  <span className={`status ${result.liveMode ? "live" : "unknown"}`}>
                    {result.liveMode ? "CANLI" : "TEST"}
                  </span>
                </p>
              </div>
            </div>

            <div className="result-card">
              <h3>Güvenlik</h3>
              <div>
                <p>3D Secure: {result.card.threeDSecure ? "✅ Aktif" : "❌ Pasif"}</p>
                <p>CVC: {result.card.cvcCheck === "pass" ? "✅ Geçerli" : "❌ Geçersiz"}</p>
                <p>Tip: {result.card.funding}</p>
              </div>
            </div>

            <div className="result-card">
              <h3>İşlem Yetkileri</h3>
              <div>
                <p>Sanal POS: {result.virtualPos ? "✅ Açık" : "❌ Kapalı"}</p>
                <p>Mail Order: {result.mailOrderPos ? "✅ Açık" : "❌ Kapalı"}</p>
                <p>Limit: ${result.limit.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </main>
  )
}

