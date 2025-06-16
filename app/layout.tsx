import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TonConnectProvider } from "@/components/ton-connect-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dating App",
  description: "Modern dating application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TonConnectProvider>{children}</TonConnectProvider>
      </body>
    </html>
  )
}
