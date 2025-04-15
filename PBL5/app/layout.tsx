import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { BackToTop } from "@/components/back-to-top"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Be Cool - Đặt vé xe khách trực tuyến",
  description: "Hệ thống đặt vé xe khách trực tuyến Việt Nam",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="pt-16 flex-grow">{children}</main>
            <Footer />
            <BackToTop />
            <ChatbotWidget />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}


import './globals.css'