"use client"

import { Check, Wallet } from "lucide-react"

interface WalletConnectionStubProps {
  walletType: "ton" | "stripe" | string
}

export default function WalletConnectionStub({ walletType }: WalletConnectionStubProps) {
  const getWalletIcon = () => {
    switch (walletType.toLowerCase()) {
      case "ton":
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
        )
      case "stripe":
        return (
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
        )
      default:
        return <Wallet className="h-6 w-6 text-blue-500" />
    }
  }

  return (
    <div className="w-full p-4 rounded-2xl border-2 border-green-500 bg-green-50 flex items-center gap-3">
      {getWalletIcon()}
      <span className="text-lg font-medium flex-1 text-green-700">
        {walletType === "ton" ? "TON кошелек подключен" : "Stripe кошелек подключен"}
      </span>
      <Check className="h-6 w-6 text-green-500" />
    </div>
  )
}
