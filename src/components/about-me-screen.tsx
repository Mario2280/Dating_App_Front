"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Check, X } from "lucide-react"
import type { ProfileData } from "@/lib/types"
import { getProfileData, saveProfileData } from "@/lib/telegram-auth"

interface AboutMeScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

export default function AboutMeScreen({ onNext, onBack, onUpdate, currentUser }: AboutMeScreenProps) {
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [instagramUrl, setInstagramUrl] = useState("")
  const [bio, setBio] = useState("")

  // Load existing data from localStorage
  useEffect(() => {
    const profileData = getProfileData()
    if (profileData) {
      if (profileData.bio) {
        setBio(profileData.bio)
      }
      if (profileData.spotify_url) {
        setSpotifyUrl(profileData.spotify_url)
        setSpotifyConnected(true)
      }
      if (profileData.instagram_url) {
        setInstagramUrl(profileData.instagram_url)
        setInstagramConnected(true)
      }
    }
  }, [])

  const saveCurrentData = () => {
    const updates = {
      bio,
      spotify_url: spotifyConnected ? spotifyUrl : undefined,
      instagram_url: instagramConnected ? instagramUrl : undefined,
    }

    // Save to localStorage
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, ...updates })
    }

    // Also call the parent update function
    onUpdate(updates)
  }

  const handleNext = () => {
    saveCurrentData()
    onNext()
  }

  const handleBack = () => {
    saveCurrentData()
    onBack()
  }

  const handleInstagramConnect = () => {
    if (!instagramConnected) {
      setInstagramConnected(true)
    }
  }

  const handleInstagramDisconnect = () => {
    setInstagramConnected(false)
    setInstagramUrl("")
    // Immediately save the disconnection
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, instagram_url: undefined })
    }
  }

  const handleSpotifyConnect = () => {
    if (!spotifyConnected) {
      setSpotifyConnected(true)
    }
  }

  const handleSpotifyDisconnect = () => {
    setSpotifyConnected(false)
    setSpotifyUrl("")
    // Immediately save the disconnection
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, spotify_url: undefined })
    }
  }

  // Save URLs when they change
  const handleInstagramUrlChange = (url: string) => {
    setInstagramUrl(url)
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, instagram_url: url })
    }
  }

  const handleSpotifyUrlChange = (url: string) => {
    setSpotifyUrl(url)
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, spotify_url: url })
    }
  }

  const handleBioChange = (newBio: string) => {
    setBio(newBio)
    const currentProfile = getProfileData()
    if (currentProfile) {
      saveProfileData({ ...currentProfile, bio: newBio })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">О себе</h1>

        <div className="space-y-6">
          {/* Instagram Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstagramConnect}
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                  instagramConnected
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IG</span>
                </div>
                <span className="text-lg font-medium flex-1 text-left">Instagram</span>
                {instagramConnected && <Check className="h-6 w-6" />}
              </button>
              {instagramConnected && (
                <Button
                  onClick={handleInstagramDisconnect}
                  variant="outline"
                  size="icon"
                  className="text-red-500 border-red-500 hover:bg-red-50 rounded-2xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            {instagramConnected && (
              <Input
                value={instagramUrl}
                onChange={(e) => handleInstagramUrlChange(e.target.value)}
                placeholder="https://instagram.com/username"
                className="text-lg border-2 border-gray-200 rounded-2xl"
              />
            )}
          </div>

          {/* Spotify Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSpotifyConnect}
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                  spotifyConnected
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="text-lg font-medium flex-1 text-left">Spotify</span>
                {spotifyConnected && <Check className="h-6 w-6" />}
              </button>
              {spotifyConnected && (
                <Button
                  onClick={handleSpotifyDisconnect}
                  variant="outline"
                  size="icon"
                  className="text-red-500 border-red-500 hover:bg-red-50 rounded-2xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            {spotifyConnected && (
              <Input
                value={spotifyUrl}
                onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                placeholder="https://open.spotify.com/user/username"
                className="text-lg border-2 border-gray-200 rounded-2xl"
              />
            )}
          </div>

          <Textarea
            value={bio}
            onChange={(e) => handleBioChange(e.target.value)}
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
