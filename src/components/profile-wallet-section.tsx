"use client"

import { useState, useEffect } from "react"
import TonWalletConnector, { type WalletInfo } from "./ton-wallet-connector"
import { walletApi as WalletService } from "@/lib/api-client"

interface ProfileWalletSectionProps {
  className?: string
}

export default function ProfileWalletSection({ className = "" }: ProfileWalletSectionProps) {
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState<{ balance: string; currency: string } | null>(null)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true)
        const wallets = await WalletService.getConnectedWallets()

        if (wallets.length > 0) {
          setConnectedWallet(wallets[0])

          // Fetch wallet balance
          const balance = await WalletService.getWalletBalance(wallets[0].id)
          setWalletBalance(balance)
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  const handleWalletSuccess = async (wallet: WalletInfo) => {
    setConnectedWallet(wallet)

    try {
      // Fetch wallet balance
      const balance = await WalletService.getWalletBalance(wallet.id)
      setWalletBalance(balance)
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold">Кошелек</h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <TonWalletConnector
            isConnected={!!connectedWallet}
            connectedWallet={connectedWallet}
            onSuccess={handleWalletSuccess}
            onError={(error) => {
              console.error("Wallet connection error:", error)
            }}
            onDisconnect={() => {
              setConnectedWallet(null)
              setWalletBalance(null)
            }}
          />

          {connectedWallet && walletBalance && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-medium text-blue-800 mb-2">Баланс кошелька</h3>
              <div className="text-2xl font-bold text-blue-700">
                {walletBalance.balance} <span className="text-blue-500">{walletBalance.currency}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
