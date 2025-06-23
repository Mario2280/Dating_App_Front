"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, ChevronDown } from "lucide-react"
import { Img as Image } from 'react-image';

interface PhotoUploadScreenProps {
  onBack: () => void
  onSave: () => void
}

const datingPurposes = ["Серьезные отношения", "Дружба", "Общение", "Развлечения", "Не определился(ась)"]

const educationLevels = [
  "Среднее образование",
  "Среднее специальное",
  "Высшее образование",
  "Магистратура",
  "Аспирантура",
  "Ученая степень",
]

export default function PhotoUploadScreen({ onBack, onSave }: PhotoUploadScreenProps) {
  const [photos, setPhotos] = useState<(string | null)[]>(["/placeholder.svg?height=200&width=200", null, null])
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null)
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false)
  const [showEducationDropdown, setShowEducationDropdown] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhotos = [...photos]
        newPhotos[index] = e.target?.result as string
        setPhotos(newPhotos)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button className="text-blue-500 text-lg font-medium">Пропустить</button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Загрузите фото</h1>
        <p className="text-gray-600 mb-8">Покажите себя! Загрузите фото для начала своего пути в знакомствах.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square rounded-2xl overflow-hidden relative">
              {photo ? (
                <Image src={photo || "/placeholder.svg"} alt={`Profile ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <button
                  onClick={() => fileInputRefs.current[index]?.click()}
                  className="w-full h-full border-2 border-dashed border-blue-300 flex items-center justify-center"
                >
                  <Plus className="h-8 w-8 text-blue-500" />
                </button>
              )}
              <input
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
                className="hidden"
              />
            </div>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="space-y-4 mb-8">
          {/* Dating Purpose Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl flex justify-between items-center"
            >
              <span className={selectedPurpose ? "text-gray-900" : "text-gray-500"}>
                {selectedPurpose || "Цель знакомства"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${showPurposeDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showPurposeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border z-10 max-h-48 overflow-y-auto">
                {datingPurposes.map((purpose) => (
                  <button
                    key={purpose}
                    onClick={() => {
                      setSelectedPurpose(purpose)
                      setShowPurposeDropdown(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl ${
                      selectedPurpose === purpose ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Education Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowEducationDropdown(!showEducationDropdown)}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl flex justify-between items-center"
            >
              <span className={selectedEducation ? "text-gray-900" : "text-gray-500"}>
                {selectedEducation || "Образование"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${showEducationDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showEducationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border z-10 max-h-48 overflow-y-auto">
                {educationLevels.map((education) => (
                  <button
                    key={education}
                    onClick={() => {
                      setSelectedEducation(education)
                      setShowEducationDropdown(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl ${
                      selectedEducation === education ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {education}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={onSave}
          className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
        >
          Сохранить
        </Button>
      </div>
    </div>
  )
}
