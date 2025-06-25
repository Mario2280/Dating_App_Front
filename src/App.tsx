"use client"

import { useState, useEffect } from "react"
import AuthCheckScreen from "@/components/auth-check-screen"
//import WelcomeScreen from "@/components/welcome-screen"
import GenderSelectionScreen from "@/components/gender-selection-screen"
import ProfileDetailsScreen from "@/components/profile-details-screen"
import BirthdayScreen from "@/components/birthday-screen"
import InterestsScreen from "@/components/interests-screen"
import AboutMeScreen from "@/components/about-me-screen"
import NotificationScreen from "@/components/notification-screen"
import MainScreen from "@/components/main-screen"
import ProfileViewScreen from "@/components/profile-view-screen"
import MatchesScreen from "@/components/matches-screen"
import MessagesScreen from "@/components/messages-screen"
import ChatScreen from "@/components/chat-screen"
import FiltersScreen from "@/components/filters-screen"
import MatchCelebrationScreen from "@/components/match-celebration-screen"
import PhotoFullscreenScreen from "@/components/photo-fullscreen-screen"
import PhotoUploadScreen from "@/components/photo-upload-screen"
import InstagramFullscreen from "@/components/instagram-fullscreen"
import ProfileEditScreen from "@/components/profile-edit-screen"
import WalletSettingsScreen from "@/components/wallet-settings-screen"
import { saveProfileData, getProfileData } from "@/lib/telegram-auth"
import ProfileDetailsExtendedScreen from "@/components/profile-details-extended-screen"
import type { TelegramUser, ProfileData } from "@/lib/types"
import ProfileCompletionScreen from "@/components/profile-completion-screen"
import ModerationPanelScreen from "@/components/moderator-panel-screen"
import WelcomeScreenComp from "@/components/welcome-screen"
import { ThemeProvider } from "@/components/theme-provider"
import { LocationProvider } from "@/contexts/location-context"
import { CompleteProfileData } from './lib/auth.service'

export type Screen =
  | "auth-check"
  | "welcome"
  | "gender"
  | "profile-details"
  | "birthday"
  | "interests"
  | "about-me"
  | "notifications"
  | "profile-completion"
  | "main"
  | "profile-view"
  | "matches"
  | "messages"
  | "chat"
  | "filters"
  | "match-celebration"
  | "photo-fullscreen"
  | "photo-upload"
  | "instagram-fullscreen"
  | "profile-edit"
  | "profile-details-extended"
  | "wallet-settings"
  | "moderator-panel"

export default function DatingApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(import.meta.env.VITE_NODE_ENV === "prod" ? "auth-check" : "welcome")
  const [instagramPhotoIndex, setInstagramPhotoIndex] = useState(0)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<ProfileData | null>(null)
  const [authenticatedTelegramUser, setAuthenticatedTelegramUser] = useState<TelegramUser | null>(null)

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = getProfileData()
    if (savedProfile) {
      setCurrentUser(savedProfile)
    }
  }, [])

  const navigateToScreen = (screen: Screen, data?: any) => {
    setCurrentScreen(screen)
  }

  const handleAuthenticated = (profile: ProfileData) => {
    setCurrentUser(profile)
    saveProfileData(profile)

    // Check if user is moderator and redirect accordingly
    if (profile.isModerator) {
      navigateToScreen("moderator-panel")
    } else {
      navigateToScreen("main")
    }
  }

  const handleNotAuthenticated = () => {
    navigateToScreen("welcome")
  }

  const handleWelcomeForNewUser = (telegramUser: TelegramUser) => {
    setAuthenticatedTelegramUser(telegramUser)
    navigateToScreen("welcome")
  }

  const handleTelegramAuth = (telegramUser: TelegramUser) => {
    const profileData: ProfileData = {
      telegram_id: telegramUser.id,
      name: `${telegramUser.first_name}${telegramUser.last_name ? ` ${telegramUser.last_name}` : ""}`,
      age: 18,
      location:  "",
    }

    setCurrentUser(profileData)
    saveProfileData(profileData)
    navigateToScreen("gender")
  }

  const handleProfileUpdate = (updates: Partial<CompleteProfileData>) => {
    if (currentUser) {
      const updatedProfile = { ...currentUser, ...updates }
      setCurrentUser(updatedProfile)
      saveProfileData(updatedProfile) // Save the complete profile, not just updates
      console.log("Profile updated and saved:", updatedProfile) // Debug log
    }
    // Don't navigate to main here - let each screen handle its own navigation
  }

  const handleProfileComplete = () => {
    if (currentUser) {
      const updatedProfile = { ...currentUser }
      setCurrentUser(updatedProfile)
      saveProfileData(updatedProfile)
    }
    navigateToScreen("profile-completion")
  }

  const handleInstagramPhotoClick = (photoIndex: number) => {
    setInstagramPhotoIndex(photoIndex)
    navigateToScreen("instagram-fullscreen")
  }

  const handleChatClick = (conversationId: number) => {
    setSelectedConversationId(conversationId)
    navigateToScreen("chat")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "auth-check":
        return (
          <AuthCheckScreen
            onAuthenticated={handleAuthenticated}
            onNotAuthenticated={handleNotAuthenticated}
            onWelcomeForNewUser={handleWelcomeForNewUser}
          />
        )
      case "welcome":
        return (
          <WelcomeScreenComp
            onNext={() => navigateToScreen("gender")}
            onAuthenticated={handleTelegramAuth}
            setCurrentUser={import.meta.env.VITE_NODE_ENV === "prod" ? undefined : setCurrentUser}
            authenticatedUser={authenticatedTelegramUser || undefined}
          />
        )
      case "gender":
        return (
          <GenderSelectionScreen
            onNext={() => navigateToScreen("profile-details")}
            onBack={() => navigateToScreen("welcome")}
            onUpdate={(updates) => {
              handleProfileUpdate(updates)
              // Don't auto-navigate here, let the component handle it
            }}
            currentUser={currentUser}
          />
        )
      case "profile-details":
        return (
          <ProfileDetailsScreen
            onNext={() => navigateToScreen("profile-details-extended")}
            onBack={() => navigateToScreen("gender")}
            onUpdate={handleProfileUpdate}
            currentUser={currentUser}
          />
        )
      case "birthday":
        return (
          <BirthdayScreen
            onNext={() => navigateToScreen("interests")}
            onBack={() => navigateToScreen("profile-details")}
          />
        )
      case "interests":
        return (
          <InterestsScreen
            onNext={() => navigateToScreen("about-me")}
            onBack={() => navigateToScreen("profile-details-extended")}
            onUpdate={handleProfileUpdate}
            currentUser={currentUser}
          />
        )
      case "about-me":
        return (
          <AboutMeScreen
            onNext={() => navigateToScreen("notifications")}
            onBack={() => navigateToScreen("interests")}
            onUpdate={handleProfileUpdate}
            currentUser={currentUser}
          />
        )
      case "notifications":
        return <NotificationScreen onNext={handleProfileComplete} onBack={() => navigateToScreen("about-me")} onUpdate={handleProfileUpdate} currentUser={currentUser} />
      case "main":
        return (
          <MainScreen onProfileClick={() => navigateToScreen("profile-view")} navigateToScreen={navigateToScreen} />
        )
      case "profile-view":
        return (
          <ProfileViewScreen
            onBack={() => navigateToScreen("main")}
            onPhotoClick={handleInstagramPhotoClick}
            navigateToScreen={navigateToScreen}
          />
        )
      case "matches":
        return (
          <MatchesScreen
            onBack={() => navigateToScreen("main")}
            onChatClick={() => navigateToScreen("chat")}
            navigateToScreen={navigateToScreen}
          />
        )
      case "messages":
        return (
          <MessagesScreen
            onBack={() => navigateToScreen("main")}
            onChatClick={handleChatClick}
            navigateToScreen={navigateToScreen}
          />
        )
      case "chat":
        return <ChatScreen onBack={() => navigateToScreen("messages")} />
      case "filters":
        return <FiltersScreen onBack={() => navigateToScreen("main")} navigateToScreen={navigateToScreen} />
      case "match-celebration":
        return (
          <MatchCelebrationScreen
            onMessage={() => navigateToScreen("chat")}
            onContinue={() => navigateToScreen("main")}
          />
        )
      case "photo-fullscreen":
        return <PhotoFullscreenScreen onBack={() => navigateToScreen("profile-view")} />
      case "photo-upload":
        return <PhotoUploadScreen onBack={() => navigateToScreen("main")} onSave={() => navigateToScreen("main")} />
      case "profile-edit":
        return (
          <ProfileEditScreen
            onBack={() => navigateToScreen("main")}
            onSave={() => {}}
            navigateToScreen={navigateToScreen}
          />
        )
      case "instagram-fullscreen":
        return (
          <InstagramFullscreen
            onBack={() => navigateToScreen("profile-view")}
            initialPhotoIndex={instagramPhotoIndex}
          />
        )
      case "profile-details-extended":
        return (
          <ProfileDetailsExtendedScreen
            onNext={() => navigateToScreen("interests")}
            onBack={() => navigateToScreen("profile-details")}
            onUpdate={handleProfileUpdate}
            currentUser={currentUser}
          />
        )
      case "wallet-settings":
        return <WalletSettingsScreen onBack={() => navigateToScreen("profile-edit")} />
      case "profile-completion":
        return <ProfileCompletionScreen onComplete={() => navigateToScreen("main")} />
      case "moderator-panel":
        return <ModerationPanelScreen onBack={() => navigateToScreen("main")} />
      default:
        return <WelcomeScreenComp onNext={() => navigateToScreen("gender") } />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LocationProvider>
        <div className="max-w-md mx-auto bg-white min-h-screen">{renderScreen()}</div>
      </LocationProvider>
    </ThemeProvider>
  )
}
