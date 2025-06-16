"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, Heart, MessageSquare, MapPin, Send, X, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProfileViewScreenProps {
  onBack: () => void
  onPhotoClick?: (photoIndex: number) => void
}

export default function ProfileViewScreen({ onBack, onPhotoClick }: ProfileViewScreenProps) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)

  const fullAboutText = `Привет! Я Аня. Мне нравится общаться с новыми людьми. Обожаю читать книги, особенно фантастику и детективы. В свободное время занимаюсь фотографией и путешествую. Ищу интересного собеседника для приятного общения и, возможно, серьезных отношений. Люблю активный отдых, походы в театр и кино. Готова к новым знакомствам и приключениям!`

  const shortAboutText = `Привет! Я Аня. Мне нравится общаться с новыми людьми. Обожаю читать...`

  const instagramPhotos = [
    "/placeholder.svg?height=150&width=150",
    "/placeholder.svg?height=150&width=150",
    "/placeholder.svg?height=150&width=150",
    "/placeholder.svg?height=150&width=150",
    "/placeholder.svg?height=150&width=150",
    "/placeholder.svg?height=150&width=150",
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Profile Image Section */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/30 backdrop-blur-sm"
            onClick={onBack}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="h-[400px] relative">
          <Image src="/placeholder.svg?height=400&width=400" alt="Profile" fill className="object-cover" priority />

          {/* Action Buttons */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4">
            <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full shadow-lg">
              <X className="h-8 w-8 text-orange-500" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-20 w-20 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              <Heart className="h-10 w-10" />
            </Button>
            <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full shadow-lg">
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Анна Санкевич, 19</h1>
            <p className="text-gray-600">Модель</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Send className="h-5 w-5 rotate-45 text-blue-500" />
          </Button>
        </div>

        {/* Location */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Минск, Беларусь</p>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-500 flex items-center gap-1 px-3 py-1 rounded-full"
            >
              <MapPin className="h-4 w-4" />1 км
            </Badge>
          </div>
        </div>

        {/* About */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">About</h2>
          <div className="overflow-hidden">
            <p className="text-gray-600 transition-all duration-300">
              {isAboutExpanded ? fullAboutText : shortAboutText}
            </p>
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="text-blue-500 font-medium mt-1 transition-all duration-300"
            >
              {isAboutExpanded ? "Скрыть" : "Читать полностью"}
            </button>
          </div>
        </div>

        {/* Interests */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Интересы</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="rounded-full px-4 py-2 border-blue-300 flex items-center gap-1">
              <svg
                className="h-4 w-4 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Музыка
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2 border-blue-300 flex items-center gap-1">
              <svg
                className="h-4 w-4 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Книги
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Дайвинг
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Танцы
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Моделинг
            </Badge>
          </div>
        </div>

        {/* Instagram */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Instagram</h2>
            <Instagram className="h-5 w-5 text-pink-500" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {instagramPhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => onPhotoClick?.(index)}
                className="aspect-square relative rounded-md overflow-hidden hover:opacity-80 transition-opacity"
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Instagram photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
