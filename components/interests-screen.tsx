"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Camera,
  ShoppingBag,
  Mic,
  Mountain,
  ChefHat,
  Zap,
  Palette,
  Gamepad2,
  Wine,
  Music,
  Plane,
} from "lucide-react"
import type { ProfileData } from "@/lib/types"

interface InterestsScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

const interests = [
  { id: "photo", label: "Фото", icon: Camera, selected: false },
  { id: "shopping", label: "Покупки", icon: ShoppingBag, selected: true },
  { id: "karaoke", label: "Караоке", icon: Mic, selected: false },
  { id: "yoga", label: "Йога", icon: Mountain, selected: false },
  { id: "cooking", label: "Готовка", icon: ChefHat, selected: false },
  { id: "tennis", label: "Теннис", icon: Zap, selected: false },
  { id: "running", label: "Бег", icon: Zap, selected: true },
  { id: "swimming", label: "Плавание", icon: Mountain, selected: false },
  { id: "art", label: "Искусство", icon: Palette, selected: false },
  { id: "travel", label: "Поездки", icon: Plane, selected: true },
  { id: "extreme", label: "Экстрим", icon: Mountain, selected: false },
  { id: "music", label: "Музыка", icon: Music, selected: false },
  { id: "drinks", label: "Выпивка", icon: Wine, selected: false },
  { id: "games", label: "Видеоигры", icon: Gamepad2, selected: false },
]

export default function InterestsScreen({ onNext, onBack, onUpdate, currentUser }: InterestsScreenProps) {
  const [selectedInterests, setSelectedInterests] = useState<Record<string, boolean>>({})

  // Load existing interests from currentUser
  useEffect(() => {
    const existingInterests = currentUser?.interests || []
    console.log("Loading interests from currentUser:", existingInterests) // Debug log

    const interestsMap = interests.reduce(
      (acc, interest) => {
        acc[interest.id] = existingInterests.includes(interest.id) || interest.selected
        return acc
      },
      {} as Record<string, boolean>,
    )

    setSelectedInterests(interestsMap)
  }, [currentUser])

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleNext = () => {
    const selectedInterestsList = Object.entries(selectedInterests)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => id)

    console.log("Saving interests:", selectedInterestsList) // Debug log
    onUpdate({ interests: selectedInterestsList })
    onNext()
  }

  const handleBack = () => {
    const selectedInterestsList = Object.entries(selectedInterests)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => id)

    console.log("Saving interests:", selectedInterestsList) // Debug log
    onUpdate({ interests: selectedInterestsList })
    onBack()
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Интересы</h1>
        <p className="text-gray-600 text-lg mb-8">Расскажите о своих интересах — выберите то, что вас вдохновляет.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {interests.map((interest) => {
            const Icon = interest.icon
            const isSelected = selectedInterests[interest.id]

            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{interest.label}</span>
              </button>
            )
          })}
        </div>

        <div className="fixed bottom-8 left-6 right-6">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  )
}
