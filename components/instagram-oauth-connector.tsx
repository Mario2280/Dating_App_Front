"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Check, ExternalLink, Unlink } from "lucide-react"

interface InstagramProfile {
  id: string
  username: string
  account_type: string
  media_count: number
  followers_count?: number
  following_count?: number
  profile_picture_url?: string
}

interface InstagramOAuthConnectorProps {
  onSuccess: (profile: InstagramProfile) => void
  onError: (error: string) => void
  isConnected?: boolean
  connectedProfile?: InstagramProfile | null
  onDisconnect?: () => void
}

export default function InstagramOAuthConnector({
  onSuccess,
  onError,
  isConnected = false,
  connectedProfile = null,
  onDisconnect,
}: InstagramOAuthConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [authWindow, setAuthWindow] = useState<Window | null>(null)

  // Instagram App credentials (replace with your actual credentials)
  const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || "your_instagram_app_id"
  const REDIRECT_URI = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || "https://your-domain.com/auth/instagram"

  useEffect(() => {
    // Listen for messages from the OAuth popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
        handleAuthSuccess(event.data.code)
      } else if (event.data.type === "INSTAGRAM_AUTH_ERROR") {
        handleAuthError(event.data.error)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleConnect = () => {
    setIsConnecting(true)

    // Instagram OAuth URL
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&scope=user_profile,user_media&response_type=code`

    // Open popup window
    const popup = window.open(
      authUrl,
      "instagram-auth",
      "width=600,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
    )

    setAuthWindow(popup)

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        setIsConnecting(false)
        setAuthWindow(null)
      }
    }, 1000)
  }

  const handleAuthSuccess = async (code: string) => {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch("/api/instagram/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token")
      }

      const { access_token } = await tokenResponse.json()

      // Get user profile
      const profileResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${access_token}`,
      )

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile")
      }

      const profile: InstagramProfile = await profileResponse.json()

      // Save the connection
      await fetch("/api/instagram/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile, access_token }),
      })

      onSuccess(profile)
      setIsConnecting(false)
      setAuthWindow(null)
      authWindow?.close()
    } catch (error) {
      console.error("Instagram auth error:", error)
      onError("Failed to connect Instagram account")
      setIsConnecting(false)
      setAuthWindow(null)
      authWindow?.close()
    }
  }

  const handleAuthError = (error: string) => {
    onError(`Instagram authentication failed: ${error}`)
    setIsConnecting(false)
    setAuthWindow(null)
    authWindow?.close()
  }

  const handleDisconnect = async () => {
    try {
      await fetch("/api/instagram/disconnect", {
        method: "POST",
      })

      if (onDisconnect) {
        onDisconnect()
      }
    } catch (error) {
      onError("Failed to disconnect Instagram account")
    }
  }

  const openInstagramProfile = () => {
    if (connectedProfile?.username) {
      window.open(`https://instagram.com/${connectedProfile.username}`, "_blank")
    }
  }

  if (isConnected && connectedProfile) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Instagram className="h-5 w-5 text-pink-600" />
            <div className="flex-1">
              <div className="font-medium text-pink-800">Instagram подключен</div>
              <div className="text-sm text-pink-600">@{connectedProfile.username}</div>
            </div>
            <Check className="h-5 w-5 text-pink-600" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-pink-600">
            <div>
              <div className="font-medium">Тип аккаунта</div>
              <div className="capitalize">{connectedProfile.account_type}</div>
            </div>
            <div>
              <div className="font-medium">Публикации</div>
              <div>{connectedProfile.media_count}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={openInstagramProfile}
            variant="outline"
            className="flex-1 h-10 border-pink-500 text-pink-500 hover:bg-pink-50 flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть профиль
          </Button>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="h-10 border-red-500 text-red-500 hover:bg-red-50"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Instagram className="h-6 w-6 text-pink-500" />
        </div>
        <h3 className="font-medium mb-1">Подключить Instagram</h3>
        <p className="text-sm text-gray-600">Покажите свои фотографии из Instagram в профиле</p>
      </div>

      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
      >
        <Instagram className="h-5 w-5" />
        {isConnecting ? "Подключение..." : "Подключить Instagram"}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Мы получим доступ только к вашему публичному профилю и фотографиям
      </div>
    </div>
  )
}
