"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, X } from "lucide-react"
import TelegramLoginWidget from "./telegram-login-widget"
import WalletConnectionModal from "./wallet-connection-modal"
import { saveTelegramUser, saveProfileData } from "@/lib/telegram-auth"
import type { TelegramUser, WalletInfo } from "@/lib/types"
import Image from "next/image"
import WalletConnectionStub from "./wallet-connection-stub"

interface WelcomeScreenProps {
  onNext: () => void
  onAuthenticated?: (telegramUser: TelegramUser) => void
  authenticatedUser?: TelegramUser // For users who are already authenticated
}

export default function WelcomeScreen({ onNext, onAuthenticated, authenticatedUser }: WelcomeScreenProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null) // Add state for wallet
  const [walletType, setWalletType] = useState<string>("")

  const handleTelegramAuth = (user: TelegramUser) => {
    // Save Telegram user data
    saveTelegramUser(user)

    // Create initial profile data
    const profileData = {
      telegram_id: user.id,
      name: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
      age: 18, // Will be set later
      location: "", // Will be set later
      isRegistered: false,
      profileComplete: false,
    }

    saveProfileData(profileData)

    if (onAuthenticated) {
      onAuthenticated(user)
    } else {
      onNext()
    }
  }

  const handleWalletConnection = (type: string) => {
    setWalletConnected(true)
    setWalletType(type)
    setShowWalletModal(false)
  }

  const handleCreateProfile = () => {
    if (authenticatedUser) {
      handleTelegramAuth(authenticatedUser)
    } else {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-32 h-32 mb-8">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-400 rounded-3xl flex items-center justify-center">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              <path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L12 8z" fill="white" />
            </svg>
          </div>
        </div>

        {authenticatedUser ? (
          <>
            {/* Authenticated user welcome */}
            <div className="flex items-center gap-4 mb-6">
              {authenticatedUser.photo_url && (
                <Image
                  src={authenticatedUser.photo_url || "/placeholder.svg"}
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Привет, {authenticatedUser.first_name}!</h1>
                <p className="text-gray-600">Давайте создадим ваш профиль</p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <Button
                onClick={handleCreateProfile}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
              >
                Создать профиль
              </Button>

              {/* Replace the wallet button with WalletConnector */}
              {walletConnected ? (
                <WalletConnectionStub walletType={walletType} />
              ) : (
                <Button
                  onClick={() => setShowWalletModal(true)}
                  variant="outline"
                  className="w-full h-14 text-lg font-medium rounded-2xl flex items-center gap-3 border-blue-500 text-blue-500"
                >
                  <Wallet className="h-5 w-5" />
                  Привязать кошелек
                </Button>
              )}
              {/*<WalletConnector
                variant="button-only"
                isConnected={walletConnected}
                connectedWallet={connectedWallet}
                onSuccess={(wallet) => {
                  setWalletConnected(true)
                  setConnectedWallet(wallet)
                }}
                onError={(error) => {
                  console.error("Wallet connection error:", error)
                }}
                onDisconnect={() => {
                  setWalletConnected(false)
                  setConnectedWallet(null)
                }}
                className="w-full h-14 text-lg font-medium rounded-2xl"
              />*/}
            </div>
          </>
        ) : (
          <>
            {/* Non-authenticated user welcome */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Добро пожаловать!</h1>
            <p className="text-gray-600 text-center mb-12 max-w-sm">Войдите через Telegram, чтобы начать знакомства</p>

            <div className="w-full space-y-4">
              {/* Telegram Login Widget */}
              <div className="flex justify-center">
                <TelegramLoginWidget
                  botName="SomeDatingBot" // Replace with your actual bot name
                  onAuth={handleTelegramAuth}
                  buttonSize="large"
                  cornerRadius={20}
                />
              </div>
              {walletConnected ? (
                <WalletConnectionStub walletType={walletType} />
              ) : (
                <Button
                  onClick={() => setShowWalletModal(true)}
                  variant="outline"
                  className="w-full h-14 text-lg font-medium rounded-2xl flex items-center gap-3 border-blue-500 text-blue-500"
                >
                  <Wallet className="h-5 w-5" />
                  Привязать кошелек
                </Button>
              )}
              {/* Replace the wallet button with WalletConnector */}
              {/*<WalletConnector
                variant="button-only"
                isConnected={walletConnected}
                connectedWallet={connectedWallet}
                onSuccess={(wallet) => {
                  setWalletConnected(true)
                  setConnectedWallet(wallet)
                }}
                onError={(error) => {
                  console.error("Wallet connection error:", error)
                }}
                onDisconnect={() => {
                  setWalletConnected(false)
                  setConnectedWallet(null)
                }}
                className="w-full h-14 text-lg font-medium rounded-2xl"
              />*/}

              <button onClick={onNext} className="w-full text-blue-500 text-lg font-medium">
                Продолжить без входа
              </button>
            </div>
          </>
        )}
      </div>

      <div className="pb-8">
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
