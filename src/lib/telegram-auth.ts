import AuthService, { CompleteProfileData } from "./auth.service"
import type { TelegramUser, ProfileData } from "./types"
import { cloudStorage } from '@telegram-apps/sdk-react'

let storage = null
if(cloudStorage.isSupported() && cloudStorage.getItem.isAvailable() && cloudStorage.setItem.isAvailable() && cloudStorage.deleteItem.isAvailable()) {
  storage = cloudStorage
} else {
  storage = localStorage
}

// Check if user is authenticated via Telegram
export function getTelegramUser(): TelegramUser | null {

  if(!storage) return null
  
  try {
    const userData = storage.getItem("telegram_user")
    if (!userData) return null

    const user = JSON.parse(userData) as TelegramUser

    // Check if auth is still valid (3 months = 90 days)
    const authAge = Date.now() / 1000 - user.auth_date
    if (authAge > 7776000) {
      // 90 days in seconds
      clearTelegramAuth()
      return null
    }

    return user
  } catch {
    return null
  }
}

// Save Telegram user data
export function saveTelegramUser(user: TelegramUser): void {
  if(!storage) return
  storage.setItem("telegram_user", JSON.stringify(user))
}

// Clear authentication
export function clearTelegramAuth(): void {
  if(!storage) return
  if(storage.deleteItem){
    storage.deleteItem("telegram_user")
    storage.deleteItem("profile_data")
    storage.deleteItem("search_filters")
  } else {
    storage.removeItem("telegram_user")
    storage.removeItem("profile_data")
    storage.removeItem("search_filters")
  }
  
}

// Check user registration with backend validation
export async function checkUserRegistration(telegramUser: TelegramUser): Promise<ProfileData | null> {
  try {
    const response = await AuthService.validateTelegramAuth(telegramUser)

    if (!response.isValid) {
      clearTelegramAuth()
      return null
    }

    // Save complete profile data including chats and likes
    if (response.profile) {
      saveProfileData(response.profile)
      
      // Save additional data if available
      if (response.chats) {
        saveChatsData(response.chats)
      }
      if (response.likes) {
        saveLikesData(response.likes)
      }
    }

    return response.profile || null
  } catch (error) {
    console.error("Registration check failed:", error)
    clearTelegramAuth()
    return null
  }
}

// Save profile data locally
export function saveProfileData(profile: Partial<CompleteProfileData>): void {
  if(!storage) return null
  storage.setItem("profile_data", JSON.stringify(profile))
}

// Get current profile data
export function getProfileData(): ProfileData | null {
  if(!storage) return

  try {
    const profileData = storage.getItem("profile_data")
    return profileData ? JSON.parse(profileData) : null
  } catch {
    return null
  }
}

// Update profile data locally
export function updateProfileData(updates: Partial<ProfileData>): void {
  const currentProfile = getProfileData()
  if (currentProfile) {
    const updatedProfile = { ...currentProfile, ...updates }
    saveProfileData(updatedProfile)
  }
}

// Save search filters
export function saveSearchFilters(filters: any): void {
  if(!storage) return
  storage.setItem("search_filters", JSON.stringify(filters))
}

// Get search filters
export function getSearchFilters(): any | null {
  if(!storage) return null

  try {
    const filtersData = storage.getItem("search_filters")
    return filtersData ? JSON.parse(filtersData) : null
  } catch {
    return null
  }
}

// Save chats data
export function saveChatsData(chats: any[]): void {
  if(!storage) return
  storage.setItem("chats_data", JSON.stringify(chats))
}

// Get chats data
export function getChatsData(): any[] | null {
  if(!storage) return null

  try {
    const chatsData = storage.getItem("chats_data")
    return chatsData ? JSON.parse(chatsData) : []
  } catch {
    return []
  }
}

// Save likes data
export function saveLikesData(likes: any[]): void {
  if(!storage) return
  storage.setItem("likes_data", JSON.stringify(likes))
}

// Get likes data
export function getLikesData(): any[] | null {
  if(!storage) return null

  try {
    const likesData = storage.getItem("likes_data")
    return likesData ? JSON.parse(likesData) : []
  } catch {
    return []
  }
}
