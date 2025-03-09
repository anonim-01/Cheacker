import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "285b98586e7988803485b8605c2f13069ffd38b465c8cfdf63ef657a7338c84a",
  {
    apiVersion: "2023-10-16",
  },
)

export async function POST(request: Request) {
  try {
    const { operation, data } = await request.json()

    let result

    switch (operation) {
      case "createCustomer":
        result = await stripe.customers.create({
          name: data.name,
          email: data.email,
          metadata: data.metadata || {},
        })
        break

      case "getCustomer":
        result = await stripe.customers.retrieve(data.customerId)
        break

      case "updateCustomerMetadata":
        result = await stripe.customers.update(data.customerId, {
          metadata: data.metadata || {},
        })
        break

      case "listCustomers":
        result = await stripe.customers.list({
          limit: data.limit || 10,
        })
        break

      case "deleteCustomer":
        result = await stripe.customers.del(data.customerId)
        break

      case "searchCustomers":
        result = await stripe.customers.search({
          query: data.query,
        })
        break

      case "createPayout":
        result = await stripe.payouts.create({
          amount: data.amount,
          currency: data.currency || "usd",
          metadata: data.metadata || {},
        })
        break

      case "getPayout":
        result = await stripe.payouts.retrieve(data.payoutId)
        break

      case "updatePayoutMetadata":
        result = await stripe.payouts.update(data.payoutId, {
          metadata: data.metadata || {},
        })
        break

      case "listPayouts":
        result = await stripe.payouts.list({
          limit: data.limit || 10,
        })
        break

      case "reversePayout":
        result = await stripe.payouts.reverse(data.payoutId)
        break

      default:
        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Stripe API error:", error)

    // Provide a more helpful error message for development
    let errorMessage = error.message || "Bir hata oluştu"

    // Handle common Stripe errors
    if (error.type === "StripeCardError") {
      errorMessage = `Kart hatası: ${error.message}`
    } else if (error.type === "StripeInvalidRequestError") {
      errorMessage = `Geçersiz istek: ${error.message}`
    } else if (error.type === "StripeAPIError") {
      errorMessage = `Stripe API hatası: ${error.message}`
    } else if (error.type === "StripeConnectionError") {
      errorMessage = `Bağlantı hatası: Stripe sunucularına ulaşılamıyor.`
    } else if (error.type === "StripeAuthenticationError") {
      errorMessage = `Kimlik doğrulama hatası: API anahtarınızı kontrol edin.`
    }

    return NextResponse.json({ error: errorMessage }, { status: error.statusCode || 500 })
  }
}

