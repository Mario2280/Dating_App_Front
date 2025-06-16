"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface InstagramFullscreenProps {
  onBack: () => void
  initialPhotoIndex?: number
}

const photos = [
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
]

export default function InstagramFullscreen({ onBack, initialPhotoIndex = 0 }: InstagramFullscreenProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/20 backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Photo counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-white text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* Main Photo */}
      <div className="h-screen relative flex items-center justify-center">
        <Image
          src={photos[currentIndex] || "/placeholder.svg"}
          alt={`Instagram photo ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-4 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute right-4 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Photo indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  )
}
