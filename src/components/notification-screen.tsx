"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { saveProfileData } from "@/lib/telegram-auth"
import AuthService, { type CompleteProfileData } from "@/lib/auth.service"
import { useEffect, useState } from "react"

interface NotificationScreenProps {
  onNext: () => void
  onUpdate: (updates: Partial<CompleteProfileData>) => void
  onBack: () => void,
  currentUser: CompleteProfileData
}

export default function NotificationScreen({ onNext, onBack, onUpdate, currentUser }: NotificationScreenProps) {
  const [notificationSettings, setNotificationSettings] = useState({
    matches: true,
    messages: true,
    likes: true,
    super_likes: false,
    promotions: true,
    updates: true,
  })
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  useEffect(() => {
      if (currentUser?.notification_settings) {
        setNotificationSettings(currentUser.notification_settings)
        console.log("Loaded notification_settings from currentUser:", currentUser.notification_settings) // Debug log
      }
    }, [currentUser])

    const createUserProfile = async () => {
      setIsCreatingProfile(true)
      try {
        // Convert notification settings to bitmask
        const settingsBitmask =
          (notificationSettings.matches ? 1 : 0) |
          (notificationSettings.messages ? 2 : 0) |
          (notificationSettings.likes ? 4 : 0) |
          (notificationSettings.super_likes ? 8 : 0) |
          (notificationSettings.promotions ? 16 : 0) |
          (notificationSettings.updates ? 32 : 0)
  
        const currentProfile = currentUser
  
        const completeProfileData: CompleteProfileData = {
          ...currentProfile,
          notification_settings: settingsBitmask,
          wallets: currentProfile?.wallets || [],
        }
  
        console.log("Creating profile with data:", completeProfileData)
  
        // Create profile on backend
        const createdProfile = await AuthService.createCompleteProfile(completeProfileData)
        console.log("Profile created successfully:", createdProfile)
  
        // Update local storage with server response
        saveProfileData({
          ...createdProfile,
        })
  
        return createdProfile
      } catch (error) {
        console.error("Failed to create profile:", error)
        throw error
      } finally {
        setIsCreatingProfile(false)
      }
    }
  
    const handleEnableNotifications = async () => {
      try {
        //await createUserProfile()
        
        // Open Telegram bot for notifications
        window.open("https://t.me/SomeDatingBot?start=notify", "_blank")
  
        onNext()
      } catch (error) {
        console.error("Failed to create profile:", error)
        // Still proceed to next screen even if backend fails
        onNext()
      }
    }

    const handleSkip = async () => {
      try {
        await createUserProfile()
        onNext()
      } catch (error) {
        console.error("Failed to create profile:", error)
        onNext()
      }
    }
  
    const handleContinue = async () => {
      try {
        await createUserProfile()
        onNext()
      } catch (error) {
        console.error("Failed to create profile:", error)
        onNext()
      }
    }
  
    const handleBack = () => {
      onUpdate({ notification_settings: {...notificationSettings} })
      onBack()
    }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button 
          onClick={handleSkip} 
          className="text-blue-500 text-lg font-medium"
          disabled={isCreatingProfile}
        >
          {isCreatingProfile ? "Создание..." : "Пропустить"}
        </button>
      </div>

      <div className="px-6 pt-8 pb-32">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-12">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 rounded-3xl flex items-center justify-center">
                <div className="w-20 h-16 bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl flex items-center justify-center relative">
                  <div className="w-12 h-3 bg-orange-300 rounded-full"></div>
                  <div className="w-8 h-3 bg-orange-300 rounded-full mt-2"></div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <div className="w-16 h-3 bg-orange-300 rounded-full"></div>
                <div className="w-12 h-3 bg-orange-300 rounded-full mt-2"></div>
              </div>
            </div>
          </div>

          <button
            onClick={handleEnableNotifications}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center hover:text-blue-500 transition-colors"
            disabled={isCreatingProfile}
          >
            {isCreatingProfile ? "Создание профиля..." : "Открыть чат с ботом"}
          </button>

          <p className="text-gray-600 text-lg text-center mb-12 max-w-sm">
            Узнавайте сразу, когда у вас совпадение или новое сообщение. Отправьте боту команду /notify, чтобы получать
            уведомления.
          </p>
        </div>

        <div className="px-6 space-y-4 mb-32">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Настройки уведомлений</h3>

          {Object.entries({
            matches: "Новые совпадения",
            messages: "Сообщения",
            likes: "Лайки",
            super_likes: "Супер-лайки",
            promotions: "Акции и предложения",
            updates: "Обновления приложения",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <button
                onClick={() =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationSettings[key as keyof typeof notificationSettings] ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationSettings[key as keyof typeof notificationSettings] ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 left-6 right-6">
          <Button
            onClick={handleContinue}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
            disabled={isCreatingProfile}
          >
            {isCreatingProfile ? "Создание профиля..." : "Продолжить"}
          </Button>
        </div>
      </div>
    </div>
  )
}
