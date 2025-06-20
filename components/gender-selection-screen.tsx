"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Check } from "lucide-react"
import type { ProfileData } from "@/lib/types"

interface GenderSelectionScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

export default function GenderSelectionScreen({ onNext, onBack, onUpdate, currentUser }: GenderSelectionScreenProps) {
  const [selectedGender, setSelectedGender] = useState<"MALE" | "FEMALE">("FEMALE")

  // Load existing gender from currentUser
  useEffect(() => {
    if (currentUser?.gender) {
      setSelectedGender(currentUser.gender)
      console.log("Loaded gender from currentUser:", currentUser.gender) // Debug log
    }
  }, [currentUser])

  const handleNext = () => {
    onUpdate({ gender: selectedGender })
    onNext()
  }

  const handleBack = () => {
    onUpdate({ gender: selectedGender })
    onBack()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={handleNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Ваш пол</h1>

        <div className="space-y-4">
          <button
            onClick={() => setSelectedGender("MALE")}
            className={`w-full p-6 rounded-2xl border-2 flex justify-between items-center transition-colors ${
              selectedGender === "MALE" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-xl font-medium text-gray-900">Мужчина</span>
            {selectedGender === "MALE" && <Check className="h-6 w-6 text-blue-500" />}
          </button>

          <button
            onClick={() => setSelectedGender("FEMALE")}
            className={`w-full p-6 rounded-2xl border-2 flex justify-between items-center transition-colors ${
              selectedGender === "FEMALE" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-xl font-medium">Женщина</span>
            {selectedGender === "FEMALE" && <Check className="h-6 w-6 text-white" />}
          </button>
        </div>

        <div className="fixed bottom-8 left-6 right-6">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
