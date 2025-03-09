import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ResizeObserverFix } from "@/components/resize-observer-fix"
import { OdealInitializer } from "@/components/odeal-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ultimate Card Validator",
  description: "Professional card validation system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ResizeObserverFix />
        <OdealInitializer />
        {children}
      </body>
    </html>
  )
}



import './globals.css'