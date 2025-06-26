"use client"

import { useState } from "react"
import { Img as Image } from "react-image"
import { ChevronLeft, Heart, MessageSquare, MapPin, Send, X, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import PremiumPopup from "./premium-popup"
import type { Screen } from "@/App"
import {
  getCurrentProfile,
  saveCurrentProfile,
  getProfileData,
  createConversationFromCurrentProfile,
  getConversations,
} from "@/lib/telegram-auth"

interface ProfileViewScreenProps {
  onBack: () => void
  onPhotoClick?: (photoIndex: number) => void
  navigateToScreen: (screen: Screen) => void
  profileData?: {
    id: number
    name: string
    age: number
    occupation: string
    location: string
    distance: string
    image: string
    about: string
    interests: string[]
    instagramPhotos: string[]
  }
}

export default function ProfileViewScreen({
  onBack,
  onPhotoClick,
  navigateToScreen,
  profileData,
}: ProfileViewScreenProps) {
  // Get profile data from storage if not provided
  const currentProfile = getCurrentProfile()
  const userProfile = getProfileData()
  const profile = profileData ||
    currentProfile || {
      id: 1,
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

  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  const [likesCount, setLikesCount] = useState(3)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [premiumPopupType, setPremiumPopupType] = useState<"likes" | "messages">("likes")
  const [hasWallet] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const fullAboutText =
    profile.about ||
    `Привет! Я ${profile.name}. Мне нравится общаться с новыми людьми. Обожаю читать книги, особенно фантастику и детективы. В свободное время занимаюсь фотографией и путешествую. Ищу интересного собеседника для приятного общения и, возможно, серьезных отношений. Люблю активный отдых, походы в театр и кино. Готова к новым знакомствам и приключениям!`

  const shortAboutText = `${fullAboutText.substring(0, 80)}...`

  const instagramPhotos = profile.instagramPhotos || ["/girl_1.jpg", "/girl_2.jpg", "/girl_3.jpg"]

  const handleSwipeLeft = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSwipeDirection("left")

    setTimeout(() => {
      // Navigate back to main screen with next profile
      onBack()
    }, 400)
  }

  const handleSwipeRight = () => {
    if (isAnimating) return

    if (likesCount <= 0) {
      setPremiumPopupType("likes")
      setShowPremiumPopup(true)
      return
    }

    setIsAnimating(true)
    setSwipeDirection("right")
    setLikesCount((prev) => prev - 1)

        // Save current profile and create conversation
        saveCurrentProfile(profile)
        createConversationFromCurrentProfile()

    setTimeout(() => {
      // Check for match (random for demo)
      if (Math.random() > 0.5) {
        navigateToScreen("match-celebration")
      } else {
        onBack()
      }
    }, 400)
  }

  const handleMessage = () => {
    if (likesCount <= 0) {
      setPremiumPopupType("messages")
      setShowPremiumPopup(true)
      return
    }

    // Save current profile for chat
    saveCurrentProfile(profile)
    const conversations = getConversations()
    const existingConversation = conversations.find((conv) => conv.profile && conv.profile.id === profile.id)

    if (!existingConversation) {
      createConversationFromCurrentProfile()
    }
    navigateToScreen("chat")
  }

  const handleBuyPremium = () => {
    window.open("https://payment.example.com/premium", "_blank")
    setShowPremiumPopup(false)
  }

  const handleBuyIndividual = () => {
    window.open("https://payment.example.com/individual", "_blank")
    setShowPremiumPopup(false)
  }

  const handleConnectWallet = () => {
    navigateToScreen("profile-edit")
    setShowPremiumPopup(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col relative overflow-hidden">
      <AnimatePresence>
        <motion.div
          className="w-full h-full"
          animate={
            swipeDirection
              ? {
                  x: swipeDirection === "left" ? -400 : 400,
                  rotate: swipeDirection === "left" ? -30 : 30,
                  opacity: 0,
                  scale: 0.8,
                }
              : { x: 0, rotate: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Profile Image Section */}
          <div className="relative">
            <div className="absolute top-4 left-4 z-10">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                onClick={onBack}
                disabled={isAnimating}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="h-[400px] relative">
              <Image
                src={profile.image || "/placeholder.svg"}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Action Buttons */}
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform"
                  onClick={handleSwipeLeft}
                  disabled={isAnimating}
                >
                  <X className="h-8 w-8 text-orange-500" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-20 w-20 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:scale-105 transition-transform"
                  onClick={handleSwipeRight}
                  disabled={isAnimating}
                >
                  <Heart className="h-10 w-10" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform"
                  onClick={handleMessage}
                  disabled={isAnimating}
                >
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-4 pt-12 pb-6 flex-1">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.name}, {profile.age}
                </h1>
                <p className="text-gray-600">{profile.occupation}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:scale-105 transition-transform"
                onClick={handleMessage}
                disabled={isAnimating}
              >
                <Send className="h-5 w-5 rotate-45 text-blue-500" />
              </Button>
            </div>

            {/*Likes Counter
            <div className="mt-2 text-center text-sm text-gray-500">
              Осталось лайков: <span className="font-semibold text-blue-500">{likesCount}</span>
            </div>*/}

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
                <motion.p
                  className="text-gray-600"
                  animate={{ height: isAboutExpanded ? "auto" : "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {isAboutExpanded ? fullAboutText : shortAboutText}
                </motion.p>
                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="text-blue-500 font-medium mt-1 hover:text-blue-600 transition-colors"
                  disabled={isAnimating}
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
                    className="aspect-square relative rounded-md overflow-hidden hover:opacity-80 transition-opacity disabled:opacity-50"
                    disabled={isAnimating}
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Instagram photo ${index + 1}`}
                      className="absolute inset-0 w-full h-fullobject-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe indicators */}
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div
              className={`bg-white rounded-full p-6 shadow-lg ${
                swipeDirection === "left" ? "border-4 border-red-500" : "border-4 border-green-500"
              }`}
            >
              <div className={`text-3xl font-bold ${swipeDirection === "left" ? "text-red-500" : "text-green-500"}`}>
                {swipeDirection === "left" ? "NOPE" : "LIKE"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Popup */}
      <PremiumPopup
        isOpen={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
        type={premiumPopupType}
        onConnectWallet={handleConnectWallet}
        navigateToScreen={navigateToScreen}
      />
    </div>
  )
}
