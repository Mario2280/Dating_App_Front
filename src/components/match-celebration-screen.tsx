"use client"

import { Button } from "@/components/ui/button"
import { Img as Image } from "react-image"
import { getCurrentProfile, getTelegramUser } from "@/lib/telegram-auth"
interface MatchCelebrationScreenProps {
  onMessage: () => void
  onContinue: () => void
}

export default function MatchCelebrationScreen({ onMessage, onContinue }: MatchCelebrationScreenProps) {
  // Get current matched profile and user profile
  const matchedProfile = getCurrentProfile()
  const userProfile = getTelegramUser()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Match Cards */}
        <div className="relative mb-12">
          <div className="relative">
            {/* Left Card - User's photo */}
            <div className="w-48 h-64 rounded-3xl overflow-hidden transform -rotate-12 shadow-xl">
              <Image
                src={userProfile?.photo_url || "/placeholder.svg?height=256&width=192"}
                alt="Your photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Right Card - Matched profile photo */}
            <div className="absolute top-8 left-16 w-48 h-64 rounded-3xl overflow-hidden transform rotate-12 shadow-xl">
              <Image
                src={matchedProfile?.image || "/placeholder.svg?height=256&width=192"}
                alt="Match photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Heart Icons */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute -top-4 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-blue-500 mb-4">У вас мэтч!</h1>
        <p className="text-gray-600 text-lg text-center mb-12">Начните беседу сейчас же</p>
      </div>

      <div className="w-full space-y-4 pb-8">
        <Button
          onClick={onMessage}
          className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
        >
          Написать
        </Button>

        <button onClick={onContinue} className="w-full text-blue-500 text-lg font-medium">
          Смотреть других
        </button>
      </div>
    </div>
  )
}
