"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, CreditCard, Wallet, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import StripeCardForm from "./stripe-card-form"
import TonWalletConnector, { type WalletInfo } from "./ton-wallet-connector"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (walletType: string) => void
}

type PaymentType = "stripe" | "ton" | null

export default function WalletConnectionModal({ isOpen, onClose, onSuccess }: WalletConnectionModalProps) {
  const [selectedType, setSelectedType] = useState<PaymentType>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleStripeSuccess = (paymentMethod: any) => {
    console.log("Stripe payment method created:", paymentMethod)
    setSuccessMessage("Карта успешно подключена!")
    setTimeout(() => {
      onSuccess("stripe")
      handleClose()
    }, 2000)
  }

  const handleTonSuccess = (wallet: WalletInfo) => {
    console.log("TON wallet connected:", wallet)
    setSuccessMessage("TON кошелек успешно подключен!")
    setTimeout(() => {
      onSuccess("ton")
      handleClose()
    }, 2000)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setTimeout(() => setError(null), 5000)
  }

  const resetForm = () => {
    setSelectedType(null)
    setError(null)
    setSuccessMessage(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleBack = () => {
    setSelectedType(null)
    setError(null)
    setSuccessMessage(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-3xl max-w-md w-full max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            {selectedType && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {selectedType === "stripe"
                ? "Банковская карта"
                : selectedType === "ton"
                  ? "TON Кошелек"
                  : "Привязать кошелек"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {successMessage}
            </div>
          )}

          {!selectedType ? (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">Выберите способ оплаты для покупки премиум-функций</p>

              <Button
                onClick={() => setSelectedType("stripe")}
                variant="outline"
                className="w-full h-16 flex items-center gap-4 text-left hover:bg-blue-50 hover:border-blue-300"
              >
                <CreditCard className="h-6 w-6 text-blue-500" />
                <div>
                  <div className="font-medium">Банковская карта</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, МИР</div>
                </div>
              </Button>

              <Button
                onClick={() => setSelectedType("ton")}
                variant="outline"
                className="w-full h-16 flex items-center gap-4 text-left hover:bg-purple-50 hover:border-purple-300"
              >
                <Wallet className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">TON Кошелек</div>
                  <div className="text-sm text-gray-500">Криптовалютный кошелек</div>
                </div>
              </Button>
            </div>
          ) : selectedType === "stripe" ? (
            <StripeCardForm onSuccess={handleStripeSuccess} onError={handleError} />
          ) : (
            <TonWalletConnector onSuccess={handleTonSuccess} onError={handleError} />
          )}
        </div>
      </motion.div>
    </div>
  )
}
