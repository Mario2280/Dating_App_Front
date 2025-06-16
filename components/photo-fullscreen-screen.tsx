"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"

interface PhotoFullscreenScreenProps {
  onBack: () => void
}

const photos = [
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
  "/placeholder.svg?height=800&width=400",
]

export default function PhotoFullscreenScreen({ onBack }: PhotoFullscreenScreenProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/20 backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Main Photo */}
      <div className="h-screen relative">
        <Image src={photos[0] || "/placeholder.svg"} alt="Profile photo" fill className="object-cover" priority />
      </div>

      {/* Photo Thumbnails */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-lg overflow-hidden ${index === 0 ? "ring-2 ring-white" : "opacity-60"}`}
          >
            <Image
              src={photo || "/placeholder.svg"}
              alt={`Photo ${index + 1}`}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
