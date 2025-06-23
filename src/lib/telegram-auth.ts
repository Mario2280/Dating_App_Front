import AuthService from "./auth.service"
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
  } else {
    storage.removeItem("telegram_user")
    storage.removeItem("profile_data")
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

    return response.profile || null
  } catch (error) {
    console.error("Registration check failed:", error)
    clearTelegramAuth()
    return null
  }
}

// Save profile data locally
export function saveProfileData(profile: ProfileData): void {
  if(!storage) return
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
