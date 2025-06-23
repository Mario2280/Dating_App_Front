"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { TonConnectUIProvider } from "@tonconnect/ui-react"


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
