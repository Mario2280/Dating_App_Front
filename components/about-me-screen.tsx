"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Check } from "lucide-react"
import type { ProfileData } from "@/lib/types"
import InstagramOAuthConnector from "./instagram-oauth-connector"

interface AboutMeScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

export default function AboutMeScreen({ onNext, onBack, onUpdate, currentUser }: AboutMeScreenProps) {
  const [spotifyConnected, setSpotifyConnected] = useState(true)
  const [bio, setBio] = useState("")

  // Add Instagram connection state
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [instagramProfile, setInstagramProfile] = useState<any>(null)

  // Load existing bio from currentUser
  useEffect(() => {
    if (currentUser?.bio) {
      setBio(currentUser.bio)
      console.log("Loaded bio from currentUser:", currentUser.bio) // Debug log
    }
  }, [currentUser])

  const handleNext = () => {
    console.log("Saving bio:", bio) // Debug log
    onUpdate({ bio })
    onNext()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">О себе</h1>

        <div className="space-y-6">
          <InstagramOAuthConnector
            onSuccess={(profile) => {
              setInstagramConnected(true)
              setInstagramProfile(profile)
              console.log("Instagram connected:", profile)
            }}
            onError={(error) => {
              console.error("Instagram connection failed:", error)
            }}
            isConnected={instagramConnected}
            connectedProfile={instagramProfile}
            onDisconnect={() => {
              setInstagramConnected(false)
              setInstagramProfile(null)
            }}
          />

          <button
            onClick={() => setSpotifyConnected(!spotifyConnected)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
              spotifyConnected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-lg font-medium flex-1 text-left">Spotify</span>
            {spotifyConnected && <Check className="h-6 w-6" />}
          </button>

          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о себе"
            className="min-h-[120px] text-lg border-2 border-gray-200 rounded-2xl resize-none"
          />
        </div>

        <div className="fixed bottom-8 left-6 right-6">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  )
}
