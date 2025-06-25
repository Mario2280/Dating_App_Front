"use client"

import { useState } from "react"
import { Img as Image } from "react-image"
import { ChevronLeft, MapPin, Send, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentProfile } from "@/lib/telegram-auth"

interface ChatProfileViewProps {
  onBack: () => void
  onPhotoClick?: (photoIndex: number) => void
}

export default function ChatProfileView({ onBack, onPhotoClick }: ChatProfileViewProps) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)

  // Get current profile data
  const currentProfile = getCurrentProfile()
  const profile = currentProfile || {
    name: "Анна Санкевич",
    age: 19,
    occupation: "Модель",
    location: "Минск, Беларусь",
    distance: "1 км",
    image: "/girl_3.jpg",
    about: "Привет! Я Аня. Мне нравится общаться с новыми людьми...",
    interests: ["Музыка", "Книги", "Дайвинг", "Танцы", "Моделинг"],
    instagramPhotos: ["/girl_1.jpg", "/girl_2.jpg", "/girl_3.jpg"],
  }

  const fullAboutText =
    profile.about ||
    `Привет! Я ${profile.name}. Мне нравится общаться с новыми людьми. Обожаю читать книги, особенно фантастику и детективы. В свободное время занимаюсь фотографией и путешествую. Ищу интересного собеседника для приятного общения и, возможно, серьезных отношений. Люблю активный отдых, походы в театр и кино. Готова к новым знакомствам и приключениям!`

  const shortAboutText = `${fullAboutText.substring(0, 80)}...`

  const instagramPhotos = profile.instagramPhotos || ["/girl_1.jpg", "/girl_2.jpg", "/girl_3.jpg"]

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
          <Image
            src={profile.image || "/placeholder.svg?height=400&width=400"}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {profile.name}, {profile.age}
            </h1>
            <p className="text-gray-600">{profile.occupation}</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Send className="h-5 w-5 rotate-45 text-blue-500" />
          </Button>
        </div>

        {/* Location */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{profile.location}</p>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-500 flex items-center gap-1 px-3 py-1 rounded-full"
            >
              <MapPin className="h-4 w-4" />
              {profile.distance}
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
            {(profile.interests || ["Музыка", "Книги", "Дайвинг", "Танцы", "Моделинг"]).map((interest, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`rounded-full px-4 py-2 ${index < 2 ? "border-blue-300 flex items-center gap-1" : ""}`}
              >
                {index < 2 && (
                  <svg
                    className="h-4 w-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {interest}
              </Badge>
            ))}
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
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
