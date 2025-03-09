"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { type PaymentProvider, paymentProviders } from "@/config/payment-providers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeProvider, setActiveProvider] = useState<PaymentProvider>("stripe")
  const { toast } = useToast()

  // Customer state
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [customerMetadata, setCustomerMetadata] = useState("")
  const [customerLimit, setCustomerLimit] = useState("3")
  const [customerQuery, setCustomerQuery] = useState("")

  // Payout state
  const [payoutAmount, setPayoutAmount] = useState("")
  const [payoutCurrency, setPayoutCurrency] = useState("usd")
  const [payoutId, setPayoutId] = useState("")
  const [payoutMetadata, setPayoutMetadata] = useState("")
  const [payoutLimit, setPayoutLimit] = useState("3")

  const handleOperation = async (operation: string, data: any) => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/payment-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          provider: activeProvider,
          data,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResult(result)
        toast({
          title: "İşlem Başarılı",
          description: `${operation} işlemi ${paymentProviders[activeProvider].name} ile başarıyla tamamlandı.`,
        })
      } else {
        throw new Error(result.error || "Bir hata oluştu")
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const parseMetadata = (metadataStr: string) => {
    try {
      return metadataStr ? JSON.parse(metadataStr) : {}
    } catch (error) {
      toast({
        title: "Metadata Hatası",
        description: "Metadata geçerli bir JSON formatında olmalıdır.",
        variant: "destructive",
      })
      return {}
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Ödeme Yönetim Paneli</h1>

      <div className="mb-6">
        <Label htmlFor="provider-select" className="mb-2 block">
          Ödeme Sağlayıcısı
        </Label>
        <div className="flex items-center gap-2">
          <Select value={activeProvider} onValueChange={(value) => setActiveProvider(value as PaymentProvider)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Ödeme Sağlayıcısı Seçin" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(paymentProviders) as PaymentProvider[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {paymentProviders[p].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {paymentProviders[activeProvider].mode === "live" && (
            <span className="px-2 py-1 bg-green-500 text-white text-sm rounded-md">CANLI MOD</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="customers">
        <TabsList className="mb-6">
          <TabsTrigger value="customers">Müşteriler</TabsTrigger>
          <TabsTrigger value="payouts">Ödemeler</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Oluştur</CardTitle>
                <CardDescription>Yeni bir {paymentProviders[activeProvider].name} müşterisi oluşturun</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">İsim</Label>
                    <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">E-posta</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerMetadata">Metadata (JSON)</Label>
                    <Textarea
                      id="customerMetadata"
                      placeholder='{"order_id": "6735"}'
                      value={customerMetadata}
                      onChange={(e) => setCustomerMetadata(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleOperation("createCustomer", {
                        name: customerName,
                        email: customerEmail,
                        metadata: parseMetadata(customerMetadata),
                      })
                    }
                    disabled={loading || !customerName || !customerEmail}
                  >
                    {loading ? "İşleniyor..." : "Müşteri Oluştur"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Müşteri İşlemleri</CardTitle>
                <CardDescription>Mevcut müşteriler üzerinde işlemler yapın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Müşteri ID</Label>
                    <Input
                      id="customerId"
                      placeholder="cus_..."
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleOperation("getCustomer", { customerId })}
                      disabled={loading || !customerId}
                      className="flex-1"
                    >
                      Getir
                    </Button>
                    <Button
                      onClick={() => handleOperation("deleteCustomer", { customerId })}
                      disabled={loading || !customerId}
                      variant="destructive"
                      className="flex-1"
                    >
                      Sil
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="updateMetadata">Metadata Güncelle (JSON)</Label>
                    <Textarea
                      id="updateMetadata"
                      placeholder='{"order_id": "6735"}'
                      value={customerMetadata}
                      onChange={(e) => setCustomerMetadata(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleOperation("updateCustomerMetadata", {
                          customerId,
                          metadata: parseMetadata(customerMetadata),
                        })
                      }
                      disabled={loading || !customerId}
                      className="w-full"
                    >
                      Metadata Güncelle
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerLimit">Limit</Label>
                    <Input
                      id="customerLimit"
                      type="number"
                      value={customerLimit}
                      onChange={(e) => setCustomerLimit(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleOperation("listCustomers", {
                          limit: Number.parseInt(customerLimit),
                        })
                      }
                      disabled={loading}
                      className="w-full"
                    >
                      Müşterileri Listele
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerQuery">Arama Sorgusu</Label>
                    <Input
                      id="customerQuery"
                      placeholder="name:'Jane Doe' AND metadata['foo']:'bar'"
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleOperation("searchCustomers", {
                          query: customerQuery,
                        })
                      }
                      disabled={loading || !customerQuery}
                      className="w-full"
                    >
                      Müşteri Ara
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Oluştur</CardTitle>
                <CardDescription>Yeni bir {paymentProviders[activeProvider].name} ödemesi oluşturun</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payoutAmount">Miktar (cent)</Label>
                    <Input
                      id="payoutAmount"
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payoutCurrency">Para Birimi</Label>
                    <Input
                      id="payoutCurrency"
                      value={payoutCurrency}
                      onChange={(e) => setPayoutCurrency(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payoutMetadata">Metadata (JSON)</Label>
                    <Textarea
                      id="payoutMetadata"
                      placeholder='{"order_id": "6735"}'
                      value={payoutMetadata}
                      onChange={(e) => setPayoutMetadata(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleOperation("createPayout", {
                        amount: Number.parseInt(payoutAmount),
                        currency: payoutCurrency,
                        metadata: parseMetadata(payoutMetadata),
                      })
                    }
                    disabled={loading || !payoutAmount}
                  >
                    {loading ? "İşleniyor..." : "Ödeme Oluştur"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ödeme İşlemleri</CardTitle>
                <CardDescription>Mevcut ödemeler üzerinde işlemler yapın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payoutId">Ödeme ID</Label>
                    <Input
                      id="payoutId"
                      placeholder="po_..."
                      value={payoutId}
                      onChange={(e) => setPayoutId(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleOperation("getPayout", { payoutId })}
                      disabled={loading || !payoutId}
                      className="flex-1"
                    >
                      Getir
                    </Button>
                    <Button
                      onClick={() => handleOperation("reversePayout", { payoutId })}
                      disabled={loading || !payoutId}
                      variant="destructive"
                      className="flex-1"
                    >
                      Geri Al
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="updatePayoutMetadata">Metadata Güncelle (JSON)</Label>
                    <Textarea
                      id="updatePayoutMetadata"
                      placeholder='{"order_id": "6735"}'
                      value={payoutMetadata}
                      onChange={(e) => setPayoutMetadata(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleOperation("updatePayoutMetadata", {
                          payoutId,
                          metadata: parseMetadata(payoutMetadata),
                        })
                      }
                      disabled={loading || !payoutId}
                      className="w-full"
                    >
                      Metadata Güncelle
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoutLimit">Limit</Label>
                    <Input
                      id="payoutLimit"
                      type="number"
                      value={payoutLimit}
                      onChange={(e) => setPayoutLimit(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleOperation("listPayouts", {
                          limit: Number.parseInt(payoutLimit),
                        })
                      }
                      disabled={loading}
                      className="w-full"
                    >
                      Ödemeleri Listele
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sonuç</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  )
}

