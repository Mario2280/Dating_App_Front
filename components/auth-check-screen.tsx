"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  getTelegramUser,
  checkUserRegistration,
  clearTelegramAuth,
  type TelegramUser,
  type ProfileData,
} from "@/lib/telegram-auth"
import LoadingScreen from "./loading-screen"


interface AuthCheckScreenProps {
  onAuthenticated: (profile: ProfileData) => void
  onNotAuthenticated: () => void
  onWelcomeForNewUser: (telegramUser: TelegramUser) => void
}

const AuthCheckScreen: React.FC<AuthCheckScreenProps> = ({
  onAuthenticated,
  onNotAuthenticated,
  onWelcomeForNewUser,
}) => {
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsChecking(true)
      setError(null)

      // Check if user is authenticated via Telegram
      const telegramUser = getTelegramUser()

      if (!telegramUser) {
        // No Telegram authentication found
        onNotAuthenticated()
        return
      }

      // Validate with backend - this will check hash and auth date
      const userProfile = await checkUserRegistration(telegramUser)

      if (userProfile) {
        // Check if user is a moderator
        // In a real app, this would come from the backend in userProfile
        // For now, we'll check a mock list of moderator IDs
        const isModerator = checkIfModerator(userProfile.telegramId)

        // Add moderator flag to profile data
        const profileWithRole = {
          ...userProfile,
          isModerator,
        }

        if (userProfile.profileComplete) {
          // User exists and has completed registration
          onAuthenticated(profileWithRole)
        } else {
          // User exists but hasn't completed registration
          onAuthenticated(profileWithRole)
        }
      } else {
        // User is authenticated but not registered or validation failed
        onWelcomeForNewUser(telegramUser)
      }
    } catch (err) {
      setError("Ошибка проверки авторизации")
      console.error("Auth check error:", err)
      // Clear auth data on error
      clearTelegramAuth()
      setTimeout(() => onNotAuthenticated(), 2000)
    } finally {
      setIsChecking(false)
    }
  }

  // Mock function to check if user is a moderator
  const checkIfModerator = (telegramId: number): boolean => {
    // Mock moderator IDs - in real app this would come from backend
    const moderatorIds = [123456789, 987654321] // Replace with actual moderator IDs
    return moderatorIds.includes(telegramId)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка авторизации</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Перенаправление на главную страницу...</p>
        </div>
      </div>
    )
  }

  return <LoadingScreen message={isChecking ? "Проверка авторизации..." : "Загрузка..."} />
}

export default AuthCheckScreen
