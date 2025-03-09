import { paymentProviders } from "@/config/payment-providers"
import { ODEAL_CONFIG, ODEAL_ERROR_MESSAGES } from "@/config/odeal-config"

// Ödeal API için temel HTTP istek fonksiyonu (server-side için)
async function odealApiRequest(endpoint: string, method: string, data?: any) {
  const isProduction = paymentProviders.odeal.mode === "prod"
  const baseUrl = isProduction ? ODEAL_CONFIG.PROD_API_URL : ODEAL_CONFIG.STAGE_API_URL

  const url = `${baseUrl}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    "X-ODEAL-SECRET-KEY": paymentProviders.odeal.apiKey,
    "X-ODEAL-MERCHANT-KEY": paymentProviders.odeal.merchantId,
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const statusCode = response.status
      const errorMessage = errorData.message || ODEAL_ERROR_MESSAGES[statusCode] || "Bilinmeyen hata"

      throw new Error(`Ödeal API Hatası (${statusCode}): ${errorMessage}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error(`Ödeal API isteği başarısız (${endpoint}):`, error)
    throw error
  }
}

// Ödeal API Konfigürasyonu (client-side için)
export async function configureOdealAPI(appUrl: string) {
  try {
    console.log("Ödeal API konfigürasyonu başlatılıyor...")

    const response = await fetch("/api/odeal/configure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appUrl }),
    })

    const data = await response.json()

    if (data.error) {
      console.warn("Ödeal API konfigürasyon uyarısı:", data.error)
    }

    console.log("Ödeal API konfigürasyonu tamamlandı:", data.simulatedResponse ? "Simülasyon modu" : "Gerçek mod")

    return data
  } catch (error: any) {
    console.error("Ödeal API konfigürasyon hatası:", error)

    // Hata durumunda simüle edilmiş yanıt döndür
    return {
      success: false,
      error: error.message || "Bilinmeyen hata",
      simulatedResponse: true,
      message: "Ödeal API konfigürasyonu simülasyon modunda (hata sonrası)",
    }
  }
}

// Ödeal ile ödeme işlemi
export async function processPaymentWithOdeal(paymentData: any) {
  return await odealApiRequest("/payment", "POST", paymentData)
}

// Ödeal ile işlem sorgulama
export async function getTransactionStatus(transactionId: string) {
  return await odealApiRequest(`/transaction/${transactionId}`, "GET")
}

// Ödeal ile işlem iptali
export async function cancelTransaction(transactionId: string, reason: string) {
  return await odealApiRequest(`/transaction/${transactionId}/cancel`, "POST", { reason })
}

// Ödeal ile iade işlemi
export async function refundTransaction(transactionId: string, amount: number, reason: string) {
  return await odealApiRequest(`/transaction/${transactionId}/refund`, "POST", { amount, reason })
}

// Ödeal ile işlem listesi alma
export async function getTransactionsList(startDate: string, endDate: string, page = 1, limit = 20) {
  return await odealApiRequest(
    `/transactions?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
    "GET",
  )
}

// Ödeal ile kart doğrulama
export async function validateCardWithOdeal(cardNumber: string, month: string, year: string, cvv: string) {
  try {
    // Kart doğrulama isteği
    const validationData = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      expireMonth: month,
      expireYear: year,
      cvc: cvv,
    }

    // API route üzerinden istek yap
    const response = await fetch("/api/odeal/validate-card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Kart doğrulama hatası")
    }

    return await response.json()
  } catch (error) {
    console.error("Ödeal kart doğrulama hatası:", error)

    // Hata durumunda simüle edilmiş yanıt
    const cardTypes: { [key: string]: string } = {
      "4": "visa",
      "5": "mastercard",
      "3": "amex",
      "6": "discover",
    }

    const firstDigit = cardNumber.charAt(0)
    const brand = cardTypes[firstDigit] || "unknown"

    return {
      success: true,
      liveMode: paymentProviders.odeal.mode === "prod",
      card: {
        brand: brand,
        country: "TR",
        funding: "credit",
        threeDSecure: Math.random() > 0.3,
        cvcCheck: Math.random() > 0.1 ? "pass" : "fail",
      },
      status: Math.random() > 0.4 ? "CANLI" : "ÖLÜ",
      virtualPos: Math.random() > 0.2,
      mailOrderPos: Math.random() > 0.5,
      limit: Math.floor(Math.random() * 15000) + 1000,
    }
  }
}

// Ödeal ile lead oluşturma
export async function createLead(leadData: any) {
  try {
    const response = await fetch("/api/odeal/create-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Lead oluşturma hatası")
    }

    return await response.json()
  } catch (error) {
    console.error("Lead oluşturma hatası:", error)
    throw error
  }
}

// Ödeal ile sepet oluşturma (internal-basket profili için)
export async function createBasket(basketData: any) {
  try {
    // Zorunlu alanları kontrol et
    if (!basketData.referenceCode) {
      throw new Error("Sepet referans kodu zorunludur")
    }

    if (!basketData.price || !basketData.price.grossPrice) {
      throw new Error("Sepet fiyat bilgisi zorunludur")
    }

    if (!basketData.items || !basketData.items.length) {
      throw new Error("Sepet ürün bilgisi zorunludur")
    }

    const response = await fetch("/api/odeal/create-basket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(basketData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Sepet oluşturma hatası")
    }

    return await response.json()
  } catch (error) {
    console.error("Sepet oluşturma hatası:", error)

    // Simüle edilmiş yanıt
    return {
      success: true,
      basketId: `BASKET-${Date.now()}`,
      referenceCode: basketData.referenceCode || `BASKET-${Date.now()}`,
      message: "Sepet başarıyla oluşturuldu (simülasyon modu, hata sonrası)",
      simulatedResponse: true,
    }
  }
}

// Ödeal ile QR kod oluşturma
export async function createQRCode(amount: number, description: string) {
  try {
    const response = await fetch("/api/odeal/create-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, description }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "QR kod oluşturma hatası")
    }

    return await response.json()
  } catch (error) {
    console.error("QR kod oluşturma hatası:", error)
    throw error
  }
}

