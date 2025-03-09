// Ödeal API Yapılandırması
export const ODEAL_CONFIG = {
  // API URL'leri
  STAGE_API_URL: "https://stage.odealapp.com/api/v1",
  PROD_API_URL: "https://api.odeal.com/api/v1",
  STAGE_LEAD_API_URL: "https://stage.odealapp.com/lead-api/v1",
  PROD_LEAD_API_URL: "https://apigw.odeal.com/lead-api/v1",

  // Callback URL'leri
  PAYMENT_SUCCEEDED_CALLBACK: "https://stage.odealapp.com/api/v1/callback/payment-succeeded",
  PAYMENT_FAILED_CALLBACK: "https://stage.odealapp.com/api/v1/callback/payment-failed",

  // Raporlama URL'i
  TRANSACTIONS_REPORT_URL: "https://stage.odealapp.com/api/v1/report/transactions",

  // Entegrasyon profilleri
  INTEGRATION_PROFILES: {
    INTERNAL_BASKET: "internal-basket",
    EXTERNAL_BASKET_WITH_APP: "external-basket-with-app",
    EXTERNAL_BASKET_WITH_ECOMMERCE_URL: "external-basket-with-ecommerce-url",
    EXTERNAL_BASKET_WITH_QR: "external-basket-with-qr",
    EXTERNAL_BASKET_WITH_BARCODE: "external-basket-with-barcode",
    EXTERNAL_BASKET_WITH_CODE: "external-basket-with-code",
  },

  // Sepet tipleri
  BASKET_TYPES: {
    SIMPLE: "SIMPLE",
    DETAILED: "DETAILED",
  },
}

// Ödeal API Hata Kodları
export const ODEAL_ERROR_CODES = {
  // 2xx: Başarılı
  SUCCESS: 200,
  CREATED: 201,

  // 4xx: İstek Hatası
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  // 5xx: Sunucu Hatası
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// Ödeal API Hata Mesajları
export const ODEAL_ERROR_MESSAGES = {
  [ODEAL_ERROR_CODES.BAD_REQUEST]: "Geçersiz istek. Lütfen parametrelerinizi kontrol edin.",
  [ODEAL_ERROR_CODES.UNAUTHORIZED]: "Yetkilendirme hatası. API anahtarınızı kontrol edin.",
  [ODEAL_ERROR_CODES.FORBIDDEN]: "Bu işlem için yetkiniz bulunmamaktadır.",
  [ODEAL_ERROR_CODES.NOT_FOUND]: "İstenilen kaynak bulunamadı.",
  [ODEAL_ERROR_CODES.SERVER_ERROR]: "Ödeal sunucusunda bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  [ODEAL_ERROR_CODES.SERVICE_UNAVAILABLE]: "Ödeal servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
}

