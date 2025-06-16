"use client"

import type React from "react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import TonConnectUIProvider with no SSR
const TonConnectUIProvider = dynamic(() => import("@tonconnect/ui-react").then((mod) => mod.TonConnectUIProvider), {
  ssr: false,
})

interface TonConnectProviderProps {
  children: React.ReactNode
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <>{children}</>
  }

  const manifestUrl = "https://your-domain.com/tonconnect-manifest.json"

  return <TonConnectUIProvider manifestUrl={manifestUrl}>{children}</TonConnectUIProvider>
}
