"use client"

import { Screen } from '@/App'
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, User, Zap } from "lucide-react"

interface BottomNavigationProps {
  currentScreen: string
  onNavigate: (screen: Screen) => void
  isOpen?: boolean
}

export default function BottomNavigation({ currentScreen, onNavigate, isOpen }: BottomNavigationProps) {
  const isActive = (screen: string) => currentScreen === screen

  if (isOpen) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around items-center py-4 border-t border-gray-200 bg-white z-50">
      <Button
        variant="ghost"
        size="icon"
        className={isActive("main") ? "text-blue-500" : "text-gray-400"}
        onClick={() => onNavigate("main")}
      >
        <Zap className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={isActive("matches") ? "text-blue-500" : "text-gray-400"}
        onClick={() => onNavigate("matches")}
      >
        <Heart className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={isActive("messages") ? "text-blue-500" : "text-gray-400"}
        onClick={() => onNavigate("messages")}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={isActive("profile-edit") ? "text-blue-500" : "text-gray-400"}
        onClick={() => onNavigate("profile-edit")}
      >
        <User className="h-6 w-6" />
      </Button>
    </div>
  )
}
