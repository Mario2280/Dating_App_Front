"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Camera, Calendar, Edit3 } from "lucide-react"
import Image from "next/image"
import ScrollingDatePickerModal from "./scrolling-date-picker"
import { getTelegramUser, type ProfileData } from "@/lib/telegram-auth"

interface ProfileDetailsScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

// Helper function to download image as base64
const downloadImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Failed to download image:", error)
    return url // Fallback to original URL
  }
}

export default function ProfileDetailsScreen({ onNext, onBack, onUpdate, currentUser }: ProfileDetailsScreenProps) {
  const telegramUser = getTelegramUser()

  const [firstName, setFirstName] = useState(currentUser?.name?.split(" ")[0] || telegramUser?.first_name || "")
  const [lastName, setLastName] = useState(currentUser?.name?.split(" ")[1] || telegramUser?.last_name || "")
  const [profileImage, setProfileImage] = useState<string>("")
  const [birthDate, setBirthDate] = useState("11 июля 2005")
  const [age, setAge] = useState(currentUser?.age || 19)
  const [location, setLocation] = useState(currentUser?.location || "Минск, Беларусь")
  const [showDatePicker, setShowDatePicker] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize profile image from Telegram or saved data
  useEffect(() => {
    const initializeProfileImage = async () => {
      if (currentUser?.profile_photo) {
        // Use saved profile photo
        setProfileImage(currentUser.profile_photo)
      } else if (telegramUser?.photo_url) {
        // Download and convert Telegram photo
        const base64Image = await downloadImageAsBase64(telegramUser.photo_url)
        setProfileImage(base64Image)
        // Save to profile data immediately
        onUpdate({ profile_photo: base64Image })
      } else {
        setProfileImage("/placeholder.svg?height=128&width=128")
      }
    }

    initializeProfileImage()
  }, [telegramUser, currentUser, onUpdate])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Image = e.target?.result as string
        setProfileImage(base64Image)
        // Save to profile data
        onUpdate({ profile_photo: base64Image })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateSelect = (date: string) => {
    setBirthDate(date)
    // Calculate age from birth date
    const parts = date.split(" ")
    if (parts.length === 3) {
      const year = Number.parseInt(parts[2])
      const currentYear = new Date().getFullYear()
      setAge(currentYear - year)
    }
  }

  const handleNext = () => {
    const updates: Partial<ProfileData> = {
      name: `${firstName}${lastName ? ` ${lastName}` : ""}`,
      age,
      location,
      profile_photo: profileImage !== "/placeholder.svg?height=128&width=128" ? profileImage : undefined,
    }

    onUpdate(updates)
    onNext()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={handleNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Профиль</h1>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            {/* Edit indicator */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <Edit3 className="h-4 w-4 text-blue-500" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Имя</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-14 text-lg border-gray-200 rounded-2xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Фамилия</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-14 text-lg border-gray-200 rounded-2xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Возраст</label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="h-14 text-lg border-gray-200 rounded-2xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Дата рождения</label>
            <button
              onClick={() => setShowDatePicker(true)}
              className="w-full p-4 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium"
            >
              <Calendar className="h-6 w-6" />
              {birthDate}
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Местоположение</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-14 text-lg border-gray-200 rounded-2xl"
            />
          </div>
        </div>

        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Продолжить
          </Button>
        </div>
      </div>

      {/* Date Picker Modal */}
      <ScrollingDatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        initialDate={birthDate}
      />
    </div>
  )
}
