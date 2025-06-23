"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, X, ChevronRight } from "lucide-react"
import TelegramLoginWidget from "./telegram-login-widget"
import WalletConnectionModal from "./wallet-connection-modal"
import LocationManager from "./location-manager"
import { saveTelegramUser, saveProfileData, getTelegramUser } from "@/lib/telegram-auth"
import type { TelegramUser, WalletInfo } from "@/lib/types"
import { Img as Image } from 'react-image';
import WalletConnectionStub from "./wallet-connection-stub"
interface WelcomeScreenProps {
  onNext: () => void
  onAuthenticated?: (telegramUser: TelegramUser) => void
  authenticatedUser?: TelegramUser // For users who are already authenticated
}



const styles = `
  @keyframes gentle-scale {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
  
  .animation-delay-300 {
    animation-delay: 300ms;
  }
`

export default function WelcomeScreen({ onNext, onAuthenticated, authenticatedUser }: WelcomeScreenProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null)
  const [walletType, setWalletType] = useState<string>("")
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [locationGranted, setLocationGranted] = useState(false)
  const [showLocationStep, setShowLocationStep] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

 
  
  // Check for existing user on mount
  useEffect(() => {
    const checkExistingUser = () => {
      const existingUser = authenticatedUser || getTelegramUser()
      if (existingUser) {
        setTelegramUser(existingUser)
        setShowLocationStep(true)
      }
      setIsLoading(false)
    }

    checkExistingUser()
  }, [authenticatedUser])

  const handleTelegramAuth = (user: TelegramUser): void => {
    console.log("Telegram auth successful:", user)

    try {
      // Save Telegram user data
      saveTelegramUser(user)
      setTelegramUser(user)

      // Create initial profile data (without location yet)
      const profileData = {
        telegram_id: user.id,
        name: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
        age: 18, // Will be set later
        location: "", // Will be set by LocationManager
        isRegistered: false,
      }

      saveProfileData(profileData)

      // Smooth transition to location step
      setTimeout(() => {
        setShowLocationStep(true)
      }, 500)
    } catch (error) {
      console.error("Error saving Telegram user:", error)
      alert("Произошла ошибка при сохранении данных. Попробуйте еще раз.")
    }
  }

  const handleTelegramAuthError = (error: any): void => {
    console.log("Telegram auth failed or cancelled:", error)
    // User stays on welcome screen - no action needed
    // Reset states in case of error
    setTelegramUser(null)
    setShowLocationStep(false)
    setLocationGranted(false)
  }

  const handleWalletConnection = (type: string): void => {
    setWalletConnected(true)
    setWalletType(type)
    setShowWalletModal(false)
  }

  const handleLocationGranted = (): void => {
    console.log("Location granted")
    setLocationGranted(true)
  }

  const handleLocationDenied = (): void => {
    console.log("Location denied, staying on welcome screen")
    setLocationGranted(false)
    alert("Для продолжения необходимо предоставить доступ к геолокации")
  }

  const handleContinue = (): void => {
    if (!locationGranted) {
      alert("Для продолжения необходимо предоставить доступ к геолокации")
      return
    }

    if (telegramUser) {
      if (onAuthenticated) {
        onAuthenticated(telegramUser)
      }
      onNext()
    }
  }

  const termsText = `
Условия использования

1. Общие положения
Настоящие Условия использования регулируют отношения между пользователем и сервисом знакомств. Используя наше приложение, вы соглашаетесь с данными условиями.

2. Регистрация и аккаунт
- Пользователь должен быть не младше 18 лет
- Предоставляемая информация должна быть достоверной
- Запрещается создание фальшивых профилей

3. Правила поведения
- Уважительное отношение к другим пользователям
- Запрет на оскорбления и домогательства
- Недопустимость размещения неприемлемого контента

4. Конфиденциальность
Мы защищаем ваши персональные данные в соответствии с политикой конфиденциальности.

5. Ответственность
Сервис не несет ответственности за действия пользователей и результаты знакомств.

6. Изменения условий
Мы оставляем за собой право изменять данные условия с уведомлением пользователей.

7. Прекращение использования
Пользователь может удалить аккаунт в любое время через настройки приложения.
  `.trim()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{styles}</style>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-32 h-32 mb-8">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-400 rounded-3xl flex items-center justify-center">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              <path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L12 8z" fill="white" />
            </svg>
          </div>
        </div>

        {telegramUser ? (
          <>
            {/* Step 2: User is authenticated, show location permission */}
            <div
              className={`w-full max-w-md transition-all duration-700 ease-in-out ${
                showLocationStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center gap-4 mb-8 text-center">
                <Image
                  src={telegramUser.photo_url || "/placeholder.svg"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Привет, {telegramUser.first_name}!</h1>
                  <p className="text-gray-600">Теперь разрешите доступ к геолокации</p>
                </div>
              </div>

              {/* Animated step indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    className={`w-12 h-2 rounded transition-all duration-500 ${
                      locationGranted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                      locationGranted ? "bg-green-500 scale-110" : "bg-orange-500 animate-pulse scale-105"
                    }`}
                  >
                    {locationGranted ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Location Permission Section with pulsing hint */}
                <div className="relative">
                  {!locationGranted && (
                    <>
                      <div className="absolute inset-0 rounded-2xl border-2 border-orange-500 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-2xl border border-orange-400 animate-ping"></div>
                    </>
                  )}

                  <div className="relative">
                    <LocationManager
                      onLocationGranted={handleLocationGranted}
                      onLocationDenied={handleLocationDenied}
                      showAsCard={true}
                    />
                  </div>
                </div>

                {/* Step indicator for location */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      locationGranted ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        locationGranted ? "bg-green-500" : "bg-orange-500 animate-pulse"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      {locationGranted ? "Шаг 2: Геолокация разрешена ✓" : "Шаг 2: Разрешите доступ к геолокации"}
                    </span>
                  </div>
                </div>

                {/* Optional: Wallet Connection */}
                {walletConnected ? (
                  <WalletConnectionStub walletType={walletType} />
                ) : (
                  <Button
                    onClick={() => setShowWalletModal(true)}
                    variant="outline"
                    className="w-full h-14 text-lg font-medium rounded-2xl flex items-center gap-3 border-blue-500 text-blue-500 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <Wallet className="h-5 w-5" />
                    Привязать кошелек
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Step 1: User needs to authenticate via Telegram */}
            <div className="w-full max-w-md text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Добро пожаловать!</h1>
              <p className="text-gray-600 mb-12 max-w-sm mx-auto">Войдите через Telegram, чтобы начать знакомства</p>

              <div className="space-y-4">
                {/* Telegram Login Widget - Step 1 with better pulsing hint */}
                <div className="relative flex justify-center">
                  {/* Better pulsing animation that adapts to button size - only border */}
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="absolute w-72 h-16 rounded-2xl border border-blue-400 animate-ping animation-delay-300"></div>
                  </div>

                  <div className="relative z-10" style={{ animation: "gentle-scale 2s ease-in-out infinite"}}>
                    <TelegramLoginWidget
                      botName="SomeDatingBot" // Replace with your actual bot name
                      onAuth={handleTelegramAuth}
                      onError={handleTelegramAuthError}
                      buttonSize="large"
                      cornerRadius={20}
                    />
                  </div>
                </div>

                {/* Step indicator with hint text */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-600 font-medium">Шаг 1: Войдите через Telegram</span>
                  </div>
                </div>

                {/* Development only - will be removed */}
                {import.meta.env.VITE_NODE_ENV === "dev" && (
                  <button onClick={onNext} className="w-full text-gray-400 text-sm font-medium opacity-50">
                    [DEV] Продолжить без входа
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Continue Button - Only show when location is granted */}
      {telegramUser && showLocationStep && (
        <div className="px-6 pb-8">
          <Button
            onClick={handleContinue}
            disabled={!locationGranted}
            className={`w-full h-14 text-lg font-medium rounded-2xl transition-all duration-500 ${
              locationGranted
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            style={
              locationGranted
                ? {
                    animation: "gentle-scale 2s ease-in-out infinite",
                  }
                : {}
            }
          >
            Продолжить
            <ChevronRight
              className={`ml-2 h-5 w-5 transition-all duration-300 ${locationGranted ? "transform translate-x-1" : ""}`}
            />
          </Button>
        </div>
      )}

      {/* Terms link */}
      <div className="px-6 pb-4 text-center">
        <button onClick={() => setShowTerms(true)} className="text-blue-500 text-base">
          Условия использования
        </button>
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={handleWalletConnection}
      />

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Условия использования</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTerms(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-sm text-gray-700 whitespace-pre-line">{termsText}</div>
            </div>
            <div className="p-4 border-t">
              <Button onClick={() => setShowTerms(false)} className="w-full">
                Понятно
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
