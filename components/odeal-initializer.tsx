"use client"

import { useEffect, useState } from "react"
import { configureOdealAPI } from "@/services/odeal-service"

export function OdealInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [simulationMode, setSimulationMode] = useState(false)

  useEffect(() => {
    const initializeOdeal = async () => {
      try {
        // Uygulama URL'ini al
        const appUrl = window.location.origin

        // Ödeal API'yi yapılandır
        const result = await configureOdealAPI(appUrl)

        if (result.simulatedResponse) {
          console.log("Ödeal API simülasyon modunda çalışıyor")
          setSimulationMode(true)
        } else {
          console.log("Ödeal API gerçek modda çalışıyor")
        }

        setInitialized(true)
      } catch (err) {
        // Hata durumunda simülasyon moduna geç
        console.error("Ödeal API yapılandırma hatası, simülasyon moduna geçiliyor:", err)
        setSimulationMode(true)
        setInitialized(true)
      }
    }

    initializeOdeal()
  }, [])

  // Bu bileşen görünmez, sadece başlangıç işlemlerini yapar
  return null
}

