"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Check, ExternalLink, Unlink, AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { useTonConnectUI } from "@tonconnect/ui-react"
import WalletService from "@/lib/api/wallet.service"

// Dynamically import TonConnectButton separately
const TonConnectButton = dynamic(() => import("@tonconnect/ui-react").then((mod) => mod.TonConnectButton), {
  ssr: false,
  loading: () => (
    <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading...</span>
    </div>
  ),
})

export interface WalletInfo {
  id: string
  type: "ton" | "stripe"
  address?: string
  chain?: string
  name?: string
  connected_at: string
}

interface WalletConnectorProps {
  onSuccess?: (wallet: WalletInfo) => void
  onError?: (error: string) => void
  isConnected?: boolean
  connectedWallet?: WalletInfo | null
  onDisconnect?: () => void
  variant?: "default" | "compact" | "button-only"
  className?: string
}

export default function TonWalletConnector({
  onSuccess,
  onError,
  isConnected = false,
  connectedWallet = null,
  onDisconnect,
  variant = "default",
  className = "",
}: WalletConnectorProps) {
  const [isClient, setIsClient] = useState(false)
  const [wallet, setWallet] = useState<WalletInfo | null>(connectedWallet)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tonConnectUI, tonConnectUIState] = useTonConnectUI();

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Update wallet state if connectedWallet prop changes
    if (connectedWallet) {
      setWallet(connectedWallet)
    }
  }, [connectedWallet])

  useEffect(() => {
    // Check if wallet is already connected via TonConnect
    if (isClient && tonConnectUI.connected && !wallet) {
      const walletInfo = tonConnectUI.wallet
      if (walletInfo) {
        handleTonWalletConnected(walletInfo)
      }
    }
  }, [isClient, tonConnectUI, wallet])

  const handleTonWalletConnected = async (tonWallet: any) => {
    try {
      // Format wallet info
      const walletInfo: WalletInfo = {
        id: tonWallet.account.address || tonWallet.address,
        type: "ton",
        address: tonWallet.account.address || tonWallet.address,
        chain: tonWallet.account.chain || tonWallet.chain,
        name: "TON Wallet",
        connected_at: new Date().toISOString(),
      }

      // Send to backend
      const response = await WalletService.connectWallet(walletInfo)

      setWallet(response)
      if (onSuccess) onSuccess(response)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setError(errorMessage)
      if (onError) onError(errorMessage)
    }
  }

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      if (tonConnectUI) {
        try {
          await tonConnectUI.openModal()
          // The wallet connection will be handled by the useEffect above
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
          setError(errorMessage)
          if (onError) onError(errorMessage)
        }
      } else {
        // Fallback for demo purposes
        setTimeout(() => {
          const mockWallet: WalletInfo = {
            id: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
            type: "ton",
            address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
            chain: "-239", // Mainnet
            name: "TON Wallet",
            connected_at: new Date().toISOString(),
          }
          setWallet(mockWallet)
          if (onSuccess) onSuccess(mockWallet)
        }, 2000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setError(errorMessage)
      if (onError) onError(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setError(null)

      // Disconnect from TonConnect if available
      if (tonConnectUI) {
        try {
          await tonConnectUI.disconnect()
        } catch (error) {
          console.error("Error disconnecting from TonConnect:", error)
        }
      }

      // Call backend to disconnect wallet
      if (wallet) {
        await WalletService.disconnectWallet(wallet.id)
      }

      setWallet(null)
      if (onDisconnect) onDisconnect()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to disconnect wallet"
      setError(errorMessage)
      if (onError) onError(errorMessage)
    }
  }

  const openTonkeeper = () => {
    window.open("https://tonkeeper.com/", "_blank")
  }

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Connected wallet display
  if (wallet || isConnected) {
    const displayWallet = wallet || connectedWallet

    if (variant === "button-only") {
      return (
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className={`border-green-500 text-green-600 bg-green-50 flex items-center gap-2 ${className}`}
        >
          <Wallet className="h-4 w-4" />
          <span>Кошелек подключен</span>
          <Check className="h-4 w-4 ml-1" />
        </Button>
      )
    }

    if (variant === "compact") {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="flex-1 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-sm">Кошелек подключен</div>
              <div className="text-xs text-gray-500">
                {displayWallet?.address?.slice(0, 6)}...{displayWallet?.address?.slice(-4)}
              </div>
            </div>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full text-red-500 hover:bg-red-50"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Кошелек подключен</span>
          </div>
          <div className="text-sm text-green-600">
            <div>
              Адрес: {displayWallet?.address?.slice(0, 8)}...{displayWallet?.address?.slice(-8) || ""}
            </div>
            <div>Тип: {displayWallet?.type === "ton" ? "TON Wallet" : "Stripe"}</div>
            {displayWallet?.chain && <div>Сеть: {displayWallet.chain === "-239" ? "Mainnet" : "Testnet"}</div>}
          </div>
        </div>

        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="w-full h-12 border-red-500 text-red-500 hover:bg-red-50"
        >
          Отключить кошелек
        </Button>
      </div>
    )
  }

  // Button-only variant
  if (variant === "button-only") {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`bg-blue-500 hover:bg-blue-600 flex items-center gap-2 ${className}`}
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Подключение..." : "Подключить кошелек"}
      </Button>
    )
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full h-10 bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Подключение..." : "Подключить кошелек"}
        </Button>
      </div>
    )
  }

  // Default full variant
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Подключить TON кошелек</h3>
        <p className="text-gray-600 text-sm">Подключите ваш TON кошелек для совершения платежей в приложении</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isClient && (
        <div className="flex justify-center mb-4">
          <TonConnectButton />
        </div>
      )}

      {/*<Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
      >
        <Wallet className="h-5 w-5" />
        {isConnecting ? "Подключение..." : "Подключить кошелек"}
      </Button>*/}

      <div className="space-y-3">
        <div className="text-sm text-gray-600 text-center">Рекомендуемые кошельки:</div>

        <Button onClick={openTonkeeper} variant="outline" className="w-full h-10 flex items-center gap-2 text-sm">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          Tonkeeper
          <ExternalLink className="h-4 w-4 ml-auto" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Поддерживаемые кошельки: Tonkeeper, OpenMask, MyTonWallet, Ton Wallet
      </div>
    </div>
  )
}
