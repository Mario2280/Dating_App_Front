"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X, MessageSquare, Menu, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SwipeableCard from "./swipeable-card"
import BottomNavigation from "./bottom-navigation"
import PremiumPopup from "./premium-popup"
import { useLocation } from "@/contexts/location-context"
import type { Screen } from "@/App"
import { getSearchFilters, saveCurrentProfile, createConversationFromCurrentProfile } from "@/lib/telegram-auth"
interface MainScreenProps {
  onProfileClick: () => void
  navigateToScreen: (screen: Screen) => void
}


const names = [
  "Анна", "Мария", "Елена"
];

// Add interface for profile data
interface ProfileData {
  id: number
  name: string
  age: number
  occupation: string
  location: string
  distance: string
  image: string
  about?: string
  interests?: string[]
}

const aboutTexts = [
  "Привет! Мне нравится общаться с новыми людьми. Обожаю читать книги, особенно фантастику и детективы. В свободное время занимаюсь фотографией и путешествую.",
  "Привет! Люблю активный отдых, походы в театр и кино. Готова к новым знакомствам и приключениям!",
  "Здравствуйте! Увлекаюсь искусством и культурой. Ищу интересного собеседника для приятного общения.",
]

const allInterests = [
  "Музыка",
  "Книги",
  "Дайвинг",
  "Танцы",
  "Моделинг",
  "Фотография",
  "Путешествия",
  "Спорт",
  "Кино",
  "Театр",
  "Искусство",
  "Готовка",
  "Йога",
  "Фитнес",
]

const occupations = [
  "Модель", "Фотограф", "Дизайнер", "Журналист", "Программист", "Маркетолог",
  "Менеджер", "Актриса", "Певица", "Врач", "Учитель", "Архитектор",
  "Стилист", "Переводчик", "Повар", "Блогер", "Спортсмен", "Юрист",
  "Инженер", "Психолог"
];

const distances = [
  "1 км", "2 км", "3 км", "4 км", "5 км", "6 км", "7 км", "8 км", "9 км", "10 км"
];

const images = ["/girl_3.jpg", "/girl_2.jpg", "/girl_1.jpg"];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const generateProfile = (id: number): ProfileData => {
  const filters = getSearchFilters()

  // Apply age filter if exists
  let age = getRandomInt(18, 56)
  if (filters?.ageRange) {
    const [min, max] = filters.ageRange
    age = getRandomInt(min, max)
  }

  // Apply distance filter if exists
  let distance = distances[id % distances.length]
  if (filters?.distance) {
    const maxDist = Math.min(filters.distance, 10)
    const availableDistances = distances.filter((d) => Number.parseInt(d) <= maxDist)
    distance = availableDistances[id % availableDistances.length] || distances[0]
  }

  // Generate interests (3-5 random interests)
  const interests = getRandomItems(allInterests, getRandomInt(3, 5))

  return {
    id,
    name: names[id % names.length],
    age,
    occupation: occupations[id % occupations.length],
    location: "Беларусь",
    distance,
    image: images[id % images.length],
    about: aboutTexts[id % aboutTexts.length],
    interests,
    instagramPhotos: [images[0], images[1], images[2]],
  }
}



export default function MainScreen({ onProfileClick, navigateToScreen }: MainScreenProps) {
  const [currentProfiles, setCurrentProfiles] = useState(() => [
    generateProfile(0),
    generateProfile(1),
    generateProfile(2),
  ])
  const [nextProfileId, setNextProfileId] = useState(3)
  const [swipingCard, setSwipingCard] = useState<{ id: number; direction: "left" | "right" } | null>(null)
  const [likesCount, setLikesCount] = useState(50)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [premiumPopupType, setPremiumPopupType] = useState<"likes" | "messages">("likes")
  const [hasWallet] = useState(false)
  const [pullUpDistance, setPullUpDistance] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  
  const [currentProfileData, setCurrentProfileData] = useState<ProfileData | null>(null)
  
  // Access location context for background location updates
  const { requestLocation, hasLocationPermission } = useLocation()

  // Auto-request location for existing users (silently in background)
  useEffect(() => {
    const updateLocationForExistingUser = async () => {
      if (!hasLocationPermission) {
        try {
          await requestLocation()
          console.log("Location updated for existing user")
        } catch (error) {
          console.log("Background location update failed:", error)
        }
      }
    }

    // Update location every 5 minutes for existing users
    const interval = setInterval(updateLocationForExistingUser, 5 * 60 * 1000)

    // Initial update
    updateLocationForExistingUser()

    return () => clearInterval(interval)
  }, [requestLocation, hasLocationPermission])

  const animateSwipe = (id: number, direction: "left" | "right") => {
    if (direction === "right") {
      if (likesCount <= 0) {
        setPremiumPopupType("likes")
        setShowPremiumPopup(true)
        return
      }
      setLikesCount((prev) => prev - 1)
    }

    setSwipingCard({ id, direction })

    // Show next card after 200ms (before animation completes)
    setTimeout(() => {
      setCurrentProfiles((prev) => {
        const filtered = prev.filter((profile) => profile.id !== id)

        // Add a new profile to maintain 3 cards
        if (filtered.length < 3) {
          const newProfile = generateProfile(nextProfileId)
          setNextProfileId((prev) => prev + 1)
          return [...filtered, newProfile]
        }

        return filtered
      })
      
      if (direction === "right") {
        // Save the liked profile for potential match
        const likedProfile = currentProfiles.find((p) => p.id === id)
        if (likedProfile) {
          saveCurrentProfile(likedProfile)
        // Create conversation for this profile
        createConversationFromCurrentProfile()

        // Random match chance
        if (Math.random() > 0.5) {
        navigateToScreen("match-celebration")
        }
      }
    }
      
  }, 200)

    // Clear swipe state after animation completes
    setTimeout(() => {
      setSwipingCard(null)
    }, 400)
  }

  const handleSwipeLeft = (id: number) => {
    animateSwipe(id, "left")
  }

  const handleSwipeRight = (id: number) => {
    animateSwipe(id, "right")
  }

  const handlePullUp = (id: number) => {
    const currentProfile = currentProfiles.find((p) => p.id === id)
    if (currentProfile) {
      saveCurrentProfile(currentProfile)
    }
    // Pass the current profile data and navigation function
    navigateToScreen("profile-view")
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = startYRef.current - currentY
    if (diff > 0) {
      setPullUpDistance(Math.min(diff, 150))
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (pullUpDistance > 80) {
      navigateToScreen("profile-view")
    }
    setPullUpDistance(0)
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
    <div
      className="min-h-screen bg-white pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={() => {
            setPremiumPopupType("likes")
            setShowPremiumPopup(true)
          }}
        >
          <RotateCcw className="h-6 w-6 text-blue-500" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Совпадения</h1>
          <p className="text-gray-500">Минск</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => navigateToScreen("filters")}>
          <Menu className="h-6 w-6 text-blue-500" />
        </Button>
      </div>

      {/* Likes Counter */}
      <div className="px-4 mb-2">
        <div className="text-center text-sm text-gray-500">
          Осталось лайков: <span className="font-semibold text-blue-500">{likesCount}</span>
        </div>
      </div>

      {/* Swipeable Cards */}
      <div className="px-4 flex-1 relative h-[500px] mb-8">
        <AnimatePresence mode="popLayout">
        {currentProfiles.slice(0, 3).map((profile, index) => (
        <motion.div
          key={profile.id}
          style={{
            zIndex: 3 - index, // Top card has highest z-index
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            y: pullUpDistance > 0 && index === 0 ? -pullUpDistance : 0,
            transformOrigin: "50% 20%",
          }}
          animate={
            swipingCard?.id === profile.id && index === 0
              ? {
                  x: swipingCard.direction === "left" ? -500 : 500,
                  rotate: swipingCard.direction === "left" ? -45 : 45,
                  opacity: 0,
                  scale: 0.8,
                }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        >
          <SwipeableCard
            profile={profile}
            onSwipeLeft={() => handleSwipeLeft(profile.id)}
            onSwipeRight={() => handleSwipeRight(profile.id)}
            onPullUp={handlePullUp}
          />
        </motion.div>
      ))}
        </AnimatePresence>

        {/* Pull up indicator */}
        {pullUpDistance > 20 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 z-50">
            <div className="text-blue-500 text-lg font-medium text-center">
              {pullUpDistance > 80 ? "Отпустите для просмотра" : "Потяните вверх для подробностей"}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <Button
          variant="secondary"
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg"
          onClick={() => currentProfiles.length > 0 && handleSwipeLeft(currentProfiles[0].id)}
        >
          <X className="h-8 w-8 text-orange-500" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-20 w-20 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          onClick={() => currentProfiles.length > 0 && handleSwipeRight(currentProfiles[0].id)}
        >
          <Heart className="h-10 w-10" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg"
          onClick={() => {
            if (currentProfiles.length > 0) {
              saveCurrentProfile(currentProfiles[0])
              navigateToScreen("chat")
            }
          }}
        >
          <MessageSquare className="h-8 w-8 text-purple-500" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="main" onNavigate={navigateToScreen} />

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
