"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface SwipeableCardProps {
  profile: {
    id: number
    name: string
    age: number
    occupation: string
    location: string
    distance: string
    image: string
  }
  onSwipeLeft: (id: number) => void
  onSwipeRight: (id: number) => void
  onPullUp: (id: number) => void
  style?: React.CSSProperties
}

export default function SwipeableCard({ profile, onSwipeLeft, onSwipeRight, onPullUp, style }: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [pullUp, setPullUp] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  // For horizontal swipe
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30])
  const leftOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0])
  const rightOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Check for pull up gesture (negative Y offset means pulling up)
    if (info.offset.y < -100) {
      onPullUp(profile.id)
      return
    }

    if (info.offset.x > 100) {
      onSwipeRight(profile.id)
    } else if (info.offset.x < -100) {
      onSwipeLeft(profile.id)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = startY - currentY // Inverted for pull up
    if (diff > 0) {
      // Only allow pulling up, not down
      setPullUp(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (pullUp > 100) {
      // If pulled up significantly, expand the card
      onPullUp(profile.id)
    }
    setPullUp(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute top-0 left-0 right-0 w-full h-[500px] rounded-3xl overflow-hidden shadow-lg"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      style={{
        x,
        y: y.get() - pullUp,
        rotate,
        transformOrigin: "50% 20%", // Changed from default to rotate from top area
        ...style,
      }}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      whileTap={{ scale: 0.98 }}
      exit={{
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 },
      }}
    >
      <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />

      {/* Distance indicator */}
      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
        <MapPin className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">{profile.distance}</span>
      </div>

      {/* Profile info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
        <h2 className="text-white text-2xl font-bold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-white/80">{profile.occupation}</p>
      </div>

      {/* Swipe indicators */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white rounded-full p-4"
        style={{ opacity: leftOpacity }}
      >
        <div className="text-red-500 text-2xl font-bold">NOPE</div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white rounded-full p-4"
        style={{ opacity: rightOpacity }}
      >
        <div className="text-green-500 text-2xl font-bold">LIKE</div>
      </motion.div>

      {/* Pull up indicator */}
      {pullUp > 20 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-4">
          <div className="text-blue-500 text-lg font-medium">Потяните вверх для подробностей</div>
        </div>
      )}
    </motion.div>
  )
}
