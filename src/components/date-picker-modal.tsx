"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (date: string) => void
  initialDate?: string
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

export default function DatePickerModal({ isOpen, onClose, onSelect, initialDate }: DatePickerModalProps) {
  const currentYear = new Date().getFullYear()
  const [selectedDate, setSelectedDate] = useState(11)
  const [selectedMonth, setSelectedMonth] = useState(6) // July (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2005)
  const [view, setView] = useState<"calendar" | "month" | "year">("calendar")

  // Year range for selection (18-80 years ago) - removed 2007 limit
  const minYear = currentYear - 80
  const maxYear = currentYear - 18
  const yearRanges = []

  // Create year ranges in groups of 12
  for (let i = maxYear; i >= minYear; i -= 12) {
    const endYear = Math.max(i - 11, minYear)
    yearRanges.push({ start: endYear, end: i })
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleSelectDate = () => {
    const formattedDate = `${selectedDate} ${months[selectedMonth]} ${selectedYear}`
    onSelect(formattedDate)
    onClose()
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setView("month")
  }

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    setView("calendar")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Выберите дату рождения</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {view === "calendar" && (
            <>
              <div className="flex items-center justify-center gap-4 mb-8">
                <button onClick={() => setView("month")}>
                  <div className="text-center">
                    <div className="text-lg text-blue-500">{months[selectedMonth]}</div>
                  </div>
                </button>
                <button onClick={() => setView("year")}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500">{selectedYear}</div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-8">
                {daysArray.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium ${
                      day === selectedDate ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </>
          )}

          {view === "month" && (
            <>
              <div className="flex items-center justify-center mb-8">
                <button onClick={() => setView("year")}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500">{selectedYear}</div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`p-4 rounded-xl flex items-center justify-center text-lg font-medium ${
                      index === selectedMonth ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </>
          )}

          {view === "year" && (
            <>
              <div className="text-center mb-8">
                <div className="text-2xl font-bold">Выберите год</div>
              </div>

              <div className="space-y-4 mb-8">
                {yearRanges.map((range) => (
                  <div key={`${range.start}-${range.end}`} className="border rounded-xl p-2">
                    <div className="text-sm text-gray-500 mb-2 text-center">
                      {range.start} - {range.end}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
                        .reverse()
                        .map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`p-2 rounded-lg flex items-center justify-center ${
                              year === selectedYear ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t">
          <Button onClick={handleSelectDate} className="w-full">
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  )
}
