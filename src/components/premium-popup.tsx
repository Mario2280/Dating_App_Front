"use client"

import { Button } from "@/components/ui/button"
import { X, Crown, Heart, MessageSquare } from "lucide-react"
import { getPaymentType } from "@/lib/telegram-auth"
import { loadStripe } from "@stripe/stripe-js"


interface PremiumPopupProps {
  isOpen: boolean
  onClose: () => void
  type: "likes" | "messages"
  hasWallet: boolean
  onConnectWallet: () => void
  navigateToScreen: (screen: string) => void
}

const stripePromise = loadStripe("pk_test_51RdvRRFxOGVlsqnPPUlVuSjBiVCQtyjFHOvymIlMzsdtDu4VXd5Gw0lQkx8vhi4vtC1aM4P9NVYygbuqWMkJWzId00FJqSWYzr")

export async function onBuyPremium() {
  if (getPaymentType() !== "stripe") return

  const stripe = await stripePromise
  if (!stripe) {
    console.error("Stripe failed to initialize.")
    return
  }

  const currentUrl = window.location.href

  const result = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: "price_1RdyxyFxOGVlsqnPqgR8Ya9b", 
        quantity: 1,
      },
    ],
    mode: "payment",
    customerEmail: "mock@opail.com",
    successUrl: currentUrl,
    cancelUrl: currentUrl,
  })
  
  if (result.error) {
    console.error("Stripe checkout error:", result.error.message)
  }
}

export async function onBuyIndividual(){
if (getPaymentType() !== "stripe") return

  const stripe = await stripePromise
  if (!stripe) {
    console.error("Stripe failed to initialize.")
    return
  }

  const currentUrl = window.location.href

  const result = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: "price_1Re3GhFxOGVlsqnPi9NEyBIa", 
        quantity: 1,
      },
    ],
    mode: "payment",
    customerEmail: "mock@opail.com",
    successUrl: currentUrl,
    cancelUrl: currentUrl,
  })
  
  if (result.error) {
    console.error("Stripe checkout error:", result.error.message)
  }
}

export default function PremiumPopup({
  isOpen,
  onClose,
  type,
  onConnectWallet,
  navigateToScreen,
}: PremiumPopupProps) {
  if (!isOpen) return null

  let hasWallet = false
  if (!hasWallet){
    hasWallet = getPaymentType() === "stripe"
  }

  //const isLikes = type === "likes"

  const handleConnectWallet = () => {
    // Navigate to profile edit and trigger wallet connection
    navigateToScreen("profile-edit")
    onClose()

    // Scroll to wallet section and trigger wallet modal after navigation
    setTimeout(() => {
      const walletSection = document.querySelector("[data-wallet-section]")
      if (walletSection) {
        walletSection.scrollIntoView({ behavior: "smooth", block: "center" })

        // Auto-click the wallet button after scrolling
        //setTimeout(() => {
        //  const walletButton = document.querySelector("[data-wallet-button]") as HTMLButtonElement
        //  if (walletButton) {
        //    walletButton.click()
        //  }
        //}, 2000)
      }
    }, 100)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
          <X className="h-5 w-5" />
        </Button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {false ? <Heart className="h-10 w-10 text-white" /> : <MessageSquare className="h-10 w-10 text-white" />}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {false ? "Лимит лайков исчерпан" : "Лимит сообщений исчерпан"}
          </h2>

          <p className="text-gray-600">
            {false
              ? "Вы достигли дневного лимита лайков. Получите больше возможностей с премиум-аккаунтом!"
              : "Вы достигли лимита сообщений. Продолжите общение с премиум-аккаунтом!"}
          </p>
        </div>

        <div className="space-y-3">
          {/* Premium Option */}
          <Button
            onClick={hasWallet ? onBuyPremium : handleConnectWallet}
            className="w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-lg font-medium rounded-2xl flex items-center justify-center gap-3"
          >
            <Crown className="h-6 w-6" />
            {hasWallet ? "Купить Premium" : "Подключить кошелек для Premium"}
          </Button>

          {/* Individual Purchase */}
          <Button
            onClick={hasWallet ? onBuyIndividual : handleConnectWallet}
            variant="outline"
            className="w-full h-12 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 text-lg font-medium rounded-2xl"
          >
            {hasWallet ? `Купить 50  лайков` : "Подключить кошелек для покупки"}
          </Button>

          {/* Close Button */}
          <Button onClick={onClose} variant="ghost" className="w-full text-gray-500">
            Может быть позже
          </Button>
        </div>
      </div>
    </div>
  )
}
