"use client"

import { useEffect } from "react"

export function ResizeObserverFix() {
  useEffect(() => {
    // ResizeObserver hatalarını yakalayıp bastırmak için
    const originalError = window.console.error
    window.console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("ResizeObserver loop") ||
          args[0].includes("ResizeObserver loop completed with undelivered notifications"))
      ) {
        return
      }
      originalError(...args)
    }

    // Orijinal error event listener'ı
    const errorHandler = (event: ErrorEvent) => {
      if (
        event.message === "ResizeObserver loop limit exceeded" ||
        event.message.includes("ResizeObserver loop completed with undelivered notifications")
      ) {
        event.stopImmediatePropagation()
        event.preventDefault()
        return false
      }
    }

    window.addEventListener("error", errorHandler as EventListener, true)

    // Cleanup
    return () => {
      window.console.error = originalError
      window.removeEventListener("error", errorHandler as EventListener, true)
    }
  }, [])

  return null
}

