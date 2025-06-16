"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X, MessageSquare, Menu, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SwipeableCard from "./swipeable-card"
import BottomNavigation from "./bottom-navigation"
import PremiumPopup from "./premium-popup"

interface MainScreenProps {
  onProfileClick: () => void
  navigateToScreen: (screen: string) => void
}

const profiles = [
  {
    id: 1,
    name: "Анна",
    age: 19,
    occupation: "Модель",
    location: "Минск, Беларусь",
    distance: "1 км",
    image: "/placeholder.svg?height=500&width=400",
  },
  {
    id: 2,
    name: "Мария",
    age: 22,
    occupation: "Фотограф",
    location: "Минск, Беларусь",
    distance: "3 км",
    image: "/placeholder.svg?height=500&width=400",
  },
  {
    id: 3,
    name: "Елена",
    age: 24,
    occupation: "Дизайнер",
    location: "Минск, Беларусь",
    distance: "5 км",
    image: "/placeholder.svg?height=500&width=400",
  },
]

export default function MainScreen({ onProfileClick, navigateToScreen }: MainScreenProps) {
  const [currentProfiles, setCurrentProfiles] = useState(profiles)
  const [swipingCard, setSwipingCard] = useState<{ id: number; direction: "left" | "right" } | null>(null)
  const [likesCount, setLikesCount] = useState(3)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [premiumPopupType, setPremiumPopupType] = useState<"likes" | "messages">("likes")
  const [hasWallet] = useState(false)
  const [pullUpDistance, setPullUpDistance] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)

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
      setCurrentProfiles((prev) => prev.filter((profile) => profile.id !== id))

      if (direction === "right" && Math.random() > 0.5) {
        navigateToScreen("match-celebration")
      }

      if (currentProfiles.length === 1) {
        setTimeout(() => setCurrentProfiles(profiles), 500)
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
          {currentProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              style={{
                zIndex: swipingCard?.id === profile.id ? 1000 : currentProfiles.length - index,
                y: pullUpDistance > 0 && index === 0 ? -pullUpDistance : 0,
                transformOrigin: "50% 20%", // Ensure consistent transform origin
              }}
              animate={
                swipingCard?.id === profile.id
                  ? {
                      x: swipingCard.direction === "left" ? -500 : 500,
                      rotate: swipingCard.direction === "left" ? -45 : 45,
                      opacity: 0,
                      scale: 0.8,
                    }
                  : {}
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2 },
              }}
            >
              <SwipeableCard
                profile={profile}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
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
            setPremiumPopupType("messages")
            setShowPremiumPopup(true)
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
        hasWallet={hasWallet}
        onBuyPremium={handleBuyPremium}
        onBuyIndividual={handleBuyIndividual}
        onConnectWallet={handleConnectWallet}
        navigateToScreen={navigateToScreen}
      />
    </div>
  )
}
