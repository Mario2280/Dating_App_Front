import { instance } from "./api.interceptor"
import { UrlConfig } from "./url.config"
import { HttpMethod } from "./methods"
import type { TelegramUser, ProfileData } from "./types"

export interface AuthResponse {
  isValid: boolean
  profile?: ProfileData
  chats?: any[]
  likes?: any[]
}

export interface CompleteProfileData extends ProfileData {
  notification_settings?: {
    matches: boolean
    messages: boolean
    likes: boolean
    super_likes: boolean
    promotions: boolean
    updates: boolean
  } | number
  chat_id?: number
  photos?: string[]
  chats?: any[]
  likes?: any[]
}

const AuthService = {
  async validateTelegramAuth(telegramUser: TelegramUser): Promise<AuthResponse> {
    try {
      return instance({
        url: `${UrlConfig.PROFILE}/validate`,
        method: HttpMethod.POST,
        data: telegramUser,
      }).then((response) => response.data)
    } catch (error) {
      console.error("Telegram auth validation failed:", error)
      throw error
    }
  },

  async createCompleteProfile(profileData: CompleteProfileData) {
    try {
      const response = await fetch(`${UrlConfig.PROFILE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to create complete profile:", error)
      throw error
    }
  },

  async updateProfile(profileData: Partial<ProfileData>, photosToDelete?: number[]): Promise<ProfileData> {
    try {
      const updateData = {
        ...profileData,
        photos_to_delete: photosToDelete || [],
      }
      return instance({
        url: `${UrlConfig.PROFILE}/update`,
        method: HttpMethod.PUT,
        data: updateData,
      }).then((response) => response.data)
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  },

  async getProfile(telegramId: number): Promise<ProfileData> {
    try {
      return instance({
        url: `${UrlConfig.PROFILE}/${telegramId}`,
        method: HttpMethod.GET,
      }).then((response) => response.data)
    } catch (error) {
      console.error("Profile fetch failed:", error)
      throw error
    }
  },

  async updateNotificationSettings(
    telegramId: number,
    settings: {
      matches: boolean
      messages: boolean
      likes: boolean
      super_likes: boolean
      promotions: boolean
      updates: boolean
    },
  ): Promise<void> {
    try {
      return instance({
        url: `${UrlConfig.NOTIFICATIONS}/settings/${telegramId}`,
        method: HttpMethod.PUT,
        data: settings,
      }).then((response) => response.data)
    } catch (error) {
      console.error("Notification settings update failed:", error)
      throw error
    }
  },
}

export default AuthService
