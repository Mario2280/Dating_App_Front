"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ScrollingDatePickerProps {
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

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 66 }, (_, i) => 2025 - i) // 2025 down to 1960

interface RouletteWheelProps {
  items: (string | number)[]
  selectedIndex: number
  onSelectionChange: (index: number) => void
  itemHeight?: number
  visibleItems?: number
}

function RouletteWheel({
  items,
  selectedIndex,
  onSelectionChange,
  itemHeight = 50,
  visibleItems = 5,
}: RouletteWheelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [animationOffset, setAnimationOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Adjust radius to make the cylinder more visible
  const radius = itemHeight * 2
  const angleStep = (2 * Math.PI) / items.length

  useEffect(() => {
    const targetOffset = selectedIndex * angleStep
    setAnimationOffset(targetOffset)
  }, [selectedIndex, angleStep])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentOffset(animationOffset)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const deltaY = e.touches[0].clientY - startY
    const deltaAngle = (deltaY / radius) * 0.8
    setAnimationOffset(currentOffset + deltaAngle)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Snap to nearest item
    const normalizedOffset = animationOffset % (2 * Math.PI)
    const nearestIndex = Math.round(normalizedOffset / angleStep) % items.length
    const finalIndex = nearestIndex < 0 ? items.length + nearestIndex : nearestIndex

    onSelectionChange(finalIndex)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const direction = e.deltaY > 0 ? 1 : -1
    const newIndex = (selectedIndex + direction + items.length) % items.length
    onSelectionChange(newIndex)
  }

  const currentRotation = isDragging ? animationOffset : selectedIndex * angleStep

  return (
    <div
      className="relative h-64 overflow-hidden"
      style={{ perspective: "800px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Selection indicator - the blue front plate */}
      <div
        className="absolute left-0 right-0 bg-blue-50 border-t-2 border-b-2 border-blue-300 pointer-events-none z-10 flex items-center justify-center"
        style={{
          top: "50%",
          height: `${itemHeight}px`,
          transform: "translateY(-50%)",
        }}
      >
        <div className="text-blue-600 font-semibold text-lg">{items[selectedIndex]}</div>
      </div>

      {/* 3D Cylinder Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, index) => {
          const angle = index * angleStep - currentRotation
          const y = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius - radius // Offset so front is at z=0

          // Only show items that are somewhat visible (not too far back)
          const isVisible = z > -radius * 0.8

          // Calculate opacity based on distance from front
          const distanceFromFront = Math.abs(z)
          const maxDistance = radius * 0.8
          const opacity = isVisible ? Math.max(0.1, 1 - (distanceFromFront / maxDistance) * 0.9) : 0

          // Scale based on depth
          const scale = isVisible ? Math.max(0.6, 1 - (distanceFromFront / maxDistance) * 0.4) : 0.6

          // Don't render the selected item here since it's shown in the blue plate
          if (index === selectedIndex) {
            return null
          }

          return (
            <div
              key={index}
              className="absolute flex items-center justify-center font-medium cursor-pointer select-none"
              style={{
                width: "100%",
                height: `${itemHeight}px`,
                transform: `translate3d(0, ${y}px, ${z}px) rotateX(${angle}rad)`,
                opacity,
                fontSize: `${14 * scale}px`,
                color: "#6b7280",
                fontWeight: "500",
                backfaceVisibility: "hidden",
                pointerEvents: isVisible ? "auto" : "none",
              }}
              onClick={() => onSelectionChange(index)}
            >
              {item}
            </div>
          )
        })}
      </div>

      {/* Enhanced gradient overlays for better depth */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />

      {/* Side shadows for cylinder effect */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-15" />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-15" />
    </div>
  )
}

// Add this function to validate days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Update the RouletteWheel for days to be dynamic based on selected month/year
export default function ScrollingDatePickerModal({ isOpen, onClose, onSelect, initialDate }: ScrollingDatePickerProps) {
  const [selectedDay, setSelectedDay] = useState(10) // 0-indexed (11th day)
  const [selectedMonth, setSelectedMonth] = useState(6) // 0-indexed (July)
  const [selectedYear, setSelectedYear] = useState(20) // Index in years array (2005)

  // Calculate valid days for selected month/year
  const currentYear = years[selectedYear]
  const daysInSelectedMonth = getDaysInMonth(currentYear, selectedMonth)
  const validDays = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)

  // Adjust selected day if it's invalid for the current month
  const adjustedSelectedDay = Math.min(selectedDay, validDays.length - 1)

  const handleSelectDate = () => {
    const day = validDays[adjustedSelectedDay]
    const month = months[selectedMonth]
    const year = years[selectedYear]
    const formattedDate = `${day} ${month} ${year}`
    onSelect(formattedDate)
    onClose()
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

        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Day Roulette */}
            <div>
              <div className="text-center text-sm text-gray-500 mb-2 font-medium">День</div>
              <RouletteWheel
                items={validDays}
                selectedIndex={adjustedSelectedDay}
                onSelectionChange={(index) => setSelectedDay(Math.min(index, validDays.length - 1))}
              />
            </div>

            {/* Month Roulette */}
            <div>
              <div className="text-center text-sm text-gray-500 mb-2 font-medium">Месяц</div>
              <RouletteWheel items={months} selectedIndex={selectedMonth} onSelectionChange={setSelectedMonth} />
            </div>

            {/* Year Roulette */}
            <div>
              <div className="text-center text-sm text-gray-500 mb-2 font-medium">Год</div>
              <RouletteWheel items={years} selectedIndex={selectedYear} onSelectionChange={setSelectedYear} />
            </div>
          </div>
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
