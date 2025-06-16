"use client"

import { useEffect } from "react"
import LoadingScreen from "./loading-screen"

interface ProfileCompletionScreenProps {
  onComplete: () => void
}

export default function ProfileCompletionScreen({ onComplete }: ProfileCompletionScreenProps) {
  useEffect(() => {
    // Simulate API call to create profile
    const timer = setTimeout(() => {
      onComplete()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return <LoadingScreen message="Создание профиля..." />
}
