"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Img as Image } from 'react-image';
import ScrollingDatePickerModal from "./scrolling-date-picker"

interface BirthdayScreenProps {
  onNext: () => void
  onBack: () => void
}

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

export default function BirthdayScreen({ onNext, onBack }: BirthdayScreenProps) {
  const [selectedDate, setSelectedDate] = useState(11)
  const [currentYear, setCurrentYear] = useState(2005)
  const [currentMonth, setCurrentMonth] = useState(6) // July (0-indexed)
  const [birthDate, setBirthDate] = useState("11 июля 2005")
  const [showDatePicker, setShowDatePicker] = useState(false)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateSelect = (date: string) => {
    setBirthDate(date)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-end p-4">
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Профиль</h1>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Profile"
              width={80}
              height={80}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white rounded-t-3xl p-6 min-h-[500px]">
          <h2 className="text-xl font-semibold text-center mb-2">День рождения</h2>

          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full p-4 mb-8 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium"
          >
            <Calendar className="h-6 w-6" />
            {birthDate}
          </button>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={goToPreviousMonth}>
              <ChevronLeft className="h-6 w-6 text-gray-400" />
            </button>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{currentYear}</div>
              <div className="text-lg text-blue-500">{months[currentMonth]}</div>
            </div>
            <button onClick={goToNextMonth}>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-8">
            {daysArray.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDate(day)
                  setBirthDate(`${day} ${months[currentMonth]} ${currentYear}`)
                }}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium ${
                  day === selectedDate ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <Button
            onClick={onNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Сохранить
          </Button>
        </div>
      </div>

      <ScrollingDatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        initialDate={birthDate}
      />
    </div>
  )
}
