"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, ExternalLink, Trash2 } from "lucide-react"
import WalletConnectionModal from "./wallet-connection-modal"
import WalletConnectionStub from "./wallet-connection-stub"
import type { WalletInfo } from "@/lib/types"

interface WalletSettingsScreenProps {
  onBack: () => void
}

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    type: "payment",
    amount: "50",
    currency: "TON",
    date: "2025-06-10T14:30:00",
    walletType: "ton",
    description: "Premium подписка",
  },
  {
    id: "tx2",
    type: "payment",
    amount: "10",
    currency: "USD",
    date: "2025-06-05T09:15:00",
    walletType: "stripe",
    description: "Покупка лайков",
  },
  {
    id: "tx3",
    type: "refund",
    amount: "5",
    currency: "TON",
    date: "2025-05-28T16:45:00",
    walletType: "ton",
    description: "Возврат средств",
  },
]

// Mock wallet data
const mockWallets = [
  {
    id: "wallet1",
    type: "ton",
    address: "UQDrLq-scVgbf1xmNR8GHjyepdtV_Wc-D0Q1YgGJtkBZm5IW",
    chain: "mainnet",
    name: "TON Wallet",
    connected_at: "2025-06-01T10:00:00",
  },
  {
    id: "wallet2",
    type: "stripe",
    name: "Visa ****4242",
    connected_at: "2025-05-15T14:30:00",
  },
]

export default function WalletSettingsScreen({ onBack }: WalletSettingsScreenProps) {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connectedWallets, setConnectedWallets] = useState<WalletInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [walletType, setWalletType] = useState<string>("")
  const [recentlyConnected, setRecentlyConnected] = useState(false)

  const walletSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if we should scroll to wallet section (from URL params)
    const urlParams = new URLSearchParams(window.location.search)
    const scrollToWallet = urlParams.get("scrollToWallet")

    if (scrollToWallet === "true" && walletSectionRef.current) {
      setTimeout(() => {
        walletSectionRef.current?.scrollIntoView({ behavior: "smooth" })
        setShowWalletModal(true)
      }, 500)

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Simulate loading wallets
    const loadWallets = async () => {
      setIsLoading(true)
      try {
        // In a real app, we would fetch from API
        // const wallets = await WalletService.getConnectedWallets()
        setConnectedWallets(mockWallets)
      } catch (error) {
        console.error("Failed to load wallets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWallets()
  }, [])

  const handleWalletConnection = (type: string) => {
    const newWallet: WalletInfo = {
      id: `wallet${Date.now()}`,
      type: type as "ton" | "stripe",
      address: type === "ton" ? "UQD...XYZ" : undefined,
      name: type === "ton" ? "TON Wallet" : "Visa ****4242",
      connected_at: new Date().toISOString(),
    }

    setConnectedWallets([...connectedWallets, newWallet])
    setWalletType(type)
    setRecentlyConnected(true)
    setTimeout(() => setRecentlyConnected(false), 3000)
  }

  const handleDisconnectWallet = (walletId: string) => {
    setConnectedWallets(connectedWallets.filter((wallet) => wallet.id !== walletId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const maskAddress = (address?: string) => {
    if (!address) return ""
    if (address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex justify-between items-center p-4 sticky top-0 bg-white z-10 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <h1 className="text-xl font-semibold">Настройки кошелька</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="px-6 pt-6 pb-6 space-y-8">
        {/* Connected Wallets Section */}
        <div className="space-y-4" ref={walletSectionRef}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Подключенные кошельки</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWalletModal(true)}
              className="text-blue-500 border-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" /> Добавить
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : connectedWallets.length > 0 ? (
            <div className="space-y-3">
              {recentlyConnected && <WalletConnectionStub walletType={walletType} />}

              {connectedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="p-4 border border-gray-200 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        wallet.type === "ton" ? "bg-blue-500" : "bg-purple-500"
                      }`}
                    >
                      <span className="text-white font-bold">{wallet.type === "ton" ? "T" : "S"}</span>
                    </div>
                    <div>
                      <p className="font-medium">{wallet.name}</p>
                      <p className="text-sm text-gray-500">
                        {wallet.type === "ton" ? maskAddress(wallet.address) : "Карта"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {wallet.type === "ton" && wallet.address && (
                      <Button variant="ghost" size="icon" className="text-gray-500">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDisconnectWallet(wallet.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-gray-300 rounded-xl text-center">
              <p className="text-gray-500 mb-4">У вас пока нет подключенных кошельков</p>
              <Button onClick={() => setShowWalletModal(true)} className="bg-blue-500 hover:bg-blue-600">
                Подключить кошелек
              </Button>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">История транзакций</h2>

          {mockTransactions.length > 0 ? (
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "payment" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
                      }`}
                    >
                      {tx.type === "payment" ? "-" : "+"}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${tx.type === "payment" ? "text-red-500" : "text-green-500"}`}>
                    {tx.type === "payment" ? "-" : "+"}
                    {tx.amount} {tx.currency}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-gray-300 rounded-xl text-center">
              <p className="text-gray-500">У вас пока нет транзакций</p>
            </div>
          )}
        </div>
      </div>

      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={handleWalletConnection}
      />
    </div>
  )
}
