"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PaymentPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Component mount olduğunda
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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
    const year = cleanValue.substring(2, 4)

    // Ay doğrulama
    if (Number.parseInt(month, 10) > 12) {
      month = "12"
    }

    return `${month}/${year}`
  }

  const validateInputs = () => {
    if (!fullName.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen ad soyad giriniz",
        variant: "destructive",
      })
      return false
    }

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir e-posta adresi giriniz",
        variant: "destructive",
      })
      return false
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir tutar giriniz",
        variant: "destructive",
      })
      return false
    }

    // Kart numarası doğrulama
    const cardDigits = cardNumber.replace(/\s/g, "")
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      toast({
        title: "Hata",
        description: "Kart numarası 13-19 haneli olmalıdır",
        variant: "destructive",
      })
      return false
    }

    // Son kullanma tarihi doğrulama
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(expiry)) {
      toast({
        title: "Hata",
        description: "Geçersiz son kullanma tarihi (AA/YY formatında olmalı)",
        variant: "destructive",
      })
      return false
    }

    // CVV doğrulama
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

  const handlePayment = async () => {
    if (!validateInputs()) return

    setIsLoading(true)

    try {
      const [month, year] = expiry.split("/")

      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          amount: Number.parseFloat(amount),
          cardNumber: cardNumber.replace(/\s/g, ""),
          month,
          year: `20${year}`,
          cvv,
        }),
      })

      const data = await response.json()

      if (data.error && !data.success) {
        throw new Error(data.error)
      }

      toast({
        title: "Başarılı",
        description: data.simulatedResponse
          ? "Ödeme işleminiz simülasyon modunda başarıyla gerçekleştirildi."
          : "Ödeme işleminiz başarıyla gerçekleştirildi.",
      })

      // Başarılı ödeme sonrası formu sıfırla
      setFullName("")
      setEmail("")
      setAmount("")
      setCardNumber("")
      setExpiry("")
      setCvv("")

      // Başarılı ödeme sayfasına yönlendir
      window.location.href = "/payment/success"
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Ödeme işlemi sırasında bir hata oluştu",
        variant: "destructive",
      })
      console.error("Ödeme hatası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Hydration sorunlarını önlemek için component mount olana kadar render etme
  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="apple-card max-w-lg mx-auto">
        <div className="apple-card-header">
          <h2 className="apple-card-title">Ödeme Yap</h2>
          <p className="apple-card-description">Ödeal ile güvenli ödeme</p>
          <p className="text-xs text-gray-500 mt-1">(Simülasyon Modu)</p>
        </div>
        <div className="apple-card-content space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="apple-label">
              Ad Soyad
            </label>
            <input
              id="fullName"
              className="apple-input"
              placeholder="Ad Soyad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="apple-label">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className="apple-input"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="apple-label">
              Tutar (TL)
            </label>
            <input
              id="amount"
              className="apple-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "")
                setAmount(value)
              }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cardNumber" className="apple-label">
              Kart Numarası
            </label>
            <input
              id="cardNumber"
              className="apple-input"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiry" className="apple-label">
                Son Kullanma Tarihi
              </label>
              <input
                id="expiry"
                className="apple-input"
                placeholder="AA/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cvv" className="apple-label">
                CVV
              </label>
              <input
                id="cvv"
                className="apple-input"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={4}
              />
            </div>
          </div>
        </div>
        <div className="apple-card-footer">
          <button className="apple-button" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "İşleniyor..." : "Ödeme Yap"}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

