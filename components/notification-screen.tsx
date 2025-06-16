"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface NotificationScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function NotificationScreen({ onNext, onBack }: NotificationScreenProps) {
  const handleEnableNotifications = async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          new Notification("Уведомления включены!", {
            body: "Теперь вы будете получать уведомления о новых совпадениях и сообщениях.",
            icon: "/favicon.ico",
          })
        }
      }
    } catch (error) {
      console.log("Notification permission denied")
    }
    onNext()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
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
            className="text-3xl font-bold text-gray-900 mb-4 text-center hover:text-blue-500 transition-colors"
          >
            Включить оповещения
          </button>

          <p className="text-gray-600 text-lg text-center mb-12 max-w-sm">
            Узнавайте сразу, когда у вас совпадение или новое сообщение.
          </p>
        </div>

        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
          <Button
            onClick={onNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Не беспокоить
          </Button>
        </div>
      </div>
    </div>
  )
}
