"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"
import Image from "next/image"
import BottomNavigation from "./bottom-navigation"
import type { Screen } from "@/app/page"
interface MatchesScreenProps {
  onBack: () => void
  onChatClick: () => void
  navigateToScreen: (screen: Screen) => void
}

interface Match {
  id: number
  name: string
  age: number
  image: string
  section: "today" | "yesterday"
  isRejected?: boolean
}

export default function MatchesScreen({ onBack, onChatClick, navigateToScreen }: MatchesScreenProps) {
  const [matches, setMatches] = useState<Match[]>([
    { id: 1, name: "Мария", age: 19, image: "/placeholder.svg?height=200&width=150", section: "today" },
    { id: 2, name: "Анна", age: 20, image: "/placeholder.svg?height=200&width=150", section: "today" },
    { id: 3, name: "Анна", age: 19, image: "/placeholder.svg?height=200&width=150", section: "today" },
    { id: 4, name: "Алиса", age: 25, image: "/placeholder.svg?height=200&width=150", section: "today" },
    { id: 5, name: "Елена", age: 22, image: "/placeholder.svg?height=200&width=150", section: "yesterday" },
    { id: 6, name: "София", age: 24, image: "/placeholder.svg?height=200&width=150", section: "yesterday" },
  ])

  const handleReject = (matchId: number) => {
    setMatches((prev) => prev.map((match) => (match.id === matchId ? { ...match, isRejected: true } : match)))
  }

  const todayMatches = matches.filter((match) => match.section === "today" && !match.isRejected)
  const yesterdayMatches = matches.filter((match) => match.section === "yesterday" && !match.isRejected)

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Мэтчи</h1>
        <p className="text-gray-600 text-lg mb-8">Те, кто лайкнул вас, и ваши совпадения — всё в одном месте.</p>

        {/* Today Section */}
        {todayMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-center text-gray-500 mb-4">Сегодня</h2>
            <div className="grid grid-cols-2 gap-4">
              {todayMatches.map((match) => (
                <div key={match.id} className="relative rounded-2xl overflow-hidden h-64">
                  <Image src={match.image || "/placeholder.svg"} alt={match.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {match.name}, {match.age}
                    </h3>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm"
                      onClick={() => handleReject(match.id)}
                    >
                      <X className="h-6 w-6 text-white" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm"
                      onClick={onChatClick}
                    >
                      <Heart className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yesterday Section */}
        {yesterdayMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-center text-gray-500 mb-4">Вчера</h2>
            <div className="grid grid-cols-2 gap-4">
              {yesterdayMatches.map((match) => (
                <div key={match.id} className="relative rounded-2xl overflow-hidden h-64">
                  <Image src={match.image || "/placeholder.svg"} alt={match.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {match.name}, {match.age}
                    </h3>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm"
                      onClick={() => handleReject(match.id)}
                    >
                      <X className="h-6 w-6 text-white" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm"
                      onClick={onChatClick}
                    >
                      <Heart className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                  {match.id === 6 && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="matches" onNavigate={navigateToScreen} />
    </div>
  )
}
