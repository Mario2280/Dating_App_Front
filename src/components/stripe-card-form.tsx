"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...")

interface StripeCardFormProps {
  onSuccess: (paymentMethod: any) => void
  onError: (error: string) => void
}

function CardForm({ onSuccess, onError }: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      onError("Card element not found")
      setIsLoading(false)
      return
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: "Dating App User",
        },
      })

      if (error) {
        onError(error.message || "An error occurred")
      } else {
        onSuccess(paymentMethod)
      }
    } catch (err) {
      onError("Failed to create payment method")
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "12px",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm text-gray-500 mb-2 block">Данные карты</label>
        <div className="p-4 border border-gray-200 rounded-xl bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
      >
        <CreditCard className="h-5 w-5" />
        {isLoading ? "Подключение..." : "Подключить карту"}
      </Button>
    </form>
  )
}

export default function StripeCardForm({ onSuccess, onError }: StripeCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
