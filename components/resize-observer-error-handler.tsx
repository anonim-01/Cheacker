"use client"

import { useEffect } from "react"

export function ResizeObserverErrorHandler() {
  useEffect(() => {
    // This prevents the ResizeObserver loop limit exceeded error
    const errorHandler = (event: ErrorEvent) => {
      if (
        event.message === "ResizeObserver loop limit exceeded" ||
        event.message.includes("ResizeObserver loop completed with undelivered notifications")
      ) {
        // Prevent the error from being displayed in the console
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", errorHandler as EventListener)

    return () => {
      window.removeEventListener("error", errorHandler as EventListener)
    }
  }, [])

  return null
}

