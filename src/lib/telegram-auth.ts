import { PaymentMethod } from "@stripe/stripe-js"
import AuthService, { type CompleteProfileData } from "./auth.service"
import type { TelegramUser, ProfileData } from "./types"
import { cloudStorage } from "@telegram-apps/sdk-react"

let storage : Storage | any | null = null
if (
  cloudStorage.isSupported() &&
  cloudStorage.getItem.isAvailable() &&
  cloudStorage.setItem.isAvailable() &&
  cloudStorage.deleteItem.isAvailable()
) {
  storage = cloudStorage
} else {
  storage = localStorage
}

// Check if user is authenticated via Telegram
export function getTelegramUser(): TelegramUser | null {
  if (!storage) return null

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

export function saveStripe(paymentMethod:PaymentMethod): void{
  if (!storage) return
  storage.setItem("payment_type", "stripe")
  storage.setItem("payment_method", paymentMethod)

}

export function getPaymentInfo(): PaymentMethod | null{
  

  return storage?.getItem("payment_method") ?? null
}

export function getPaymentType(): string | null {

  return storage?.getItem("payment_type") ?? null
}

// Save Telegram user data
export function saveTelegramUser(user: TelegramUser): void {
  if (!storage) return
  storage.setItem("telegram_user", JSON.stringify(user))
}

// Clear authentication
export function clearTelegramAuth(): void {
  if (!storage) return
  if (storage.deleteItem) {
    storage.deleteItem("telegram_user")
    storage.deleteItem("profile_data")
    storage.deleteItem("search_filters")
    storage.deleteItem("payment_type")
    storage.deleteItem("payment_method")
  } else {
    storage.removeItem("telegram_user")
    storage.removeItem("profile_data")
    storage.removeItem("search_filters")
    storage.deleteItem("payment_type")
    storage.deleteItem("payment_method")
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
  if (!storage) return 
  storage.setItem("profile_data", JSON.stringify(profile))
}

// Get current profile data
export function getProfileData(): ProfileData | null {
  if (!storage) return null

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
  if (!storage) return
  console.log(filters)

  storage.setItem("search_filters", JSON.stringify(filters))
}

// Get search filters
export function getSearchFilters(): any | null {
  if (!storage) return null

  try {
    const filtersData = storage.getItem("search_filters")
    return filtersData ? JSON.parse(filtersData) : null
  } catch {
    return null
  }
}

// Save chats data
export function saveChatsData(chats: any[]): void {
  if (!storage) return
  storage.setItem("chats_data", JSON.stringify(chats))
}

// Get chats data
export function getChatsData(): any[] | null {
  if (!storage) return null

  try {
    const chatsData = storage.getItem("chats_data")
    return chatsData ? JSON.parse(chatsData) : []
  } catch {
    return []
  }
}

// Save likes data
export function saveLikesData(likes: any[]): void {
  if (!storage) return
  storage.setItem("likes_data", JSON.stringify(likes))
}

// Get likes data
export function getLikesData(): any[] | null {
  if (!storage) return null

  try {
    const likesData = storage.getItem("likes_data")
    return likesData ? JSON.parse(likesData) : []
  } catch {
    return []
  }
}

// Save conversations data
export function saveConversations(conversations: any[]): void {
  if (!storage) return
  storage.setItem("conversations_data", JSON.stringify(conversations))
}

// Get conversations data
export function getConversations(): any[] {
  if (!storage) return []

  try {
    const conversationsData = storage.getItem("conversations_data")
    return conversationsData ? JSON.parse(conversationsData) : []
  } catch {
    return []
  }
}

// Add or update a conversation
export function saveConversation(conversationData: any): void {
  if (!storage) return

  const conversations = getConversations()
  const existingIndex = conversations.findIndex((conv) => conv.id === conversationData.id)

  if (existingIndex >= 0) {
    conversations[existingIndex] = { ...conversations[existingIndex], ...conversationData }
  } else {
    conversations.unshift(conversationData) // Add to beginning for recent conversations
  }

  saveConversations(conversations)
}

// Add message to conversation
export function addMessageToConversation(conversationId: number, message: any): void {
  if (!storage) return

  const conversations = getConversations()
  const conversationIndex = conversations.findIndex((conv) => conv.id === conversationId)

  if (conversationIndex >= 0) {
    if (!conversations[conversationIndex].messages) {
      conversations[conversationIndex].messages = []
    }
    conversations[conversationIndex].messages.push(message)

    // Update last message and time
    conversations[conversationIndex].lastMessage = message.text || "Фото"
    conversations[conversationIndex].time = message.time
    conversations[conversationIndex].hasRead = false

    // Move conversation to top
    const updatedConversation = conversations.splice(conversationIndex, 1)[0]
    conversations.unshift(updatedConversation)

    saveConversations(conversations)
  }
}

// Get conversation by ID
export function getConversationById(conversationId: number): any | null {
  const conversations = getConversations()
  return conversations.find((conv) => conv.id === conversationId) || null
}

// Save matches data
export function saveMatches(matches: any[]): void {
  if (!storage) return
  storage.setItem("matches_data", JSON.stringify(matches))
}

// Get matches data
export function getMatches(): any[] {
  if (!storage) return []

  try {
    const matchesData = storage.getItem("matches_data")
    return matchesData ? JSON.parse(matchesData) : []
  } catch {
    return []
  }
}

// Add a new match
export function addMatch(matchData: any): void {
  if (!storage) return

  const matches = getMatches()
  const newMatch = {
    ...matchData,
    id: Date.now(), // Use timestamp as unique ID
    matchedAt: new Date().toISOString(),
    section: "today",
  }

  matches.unshift(newMatch) // Add to beginning
  saveMatches(matches)

  // Also create a conversation for this match
  const conversation = {
    id: newMatch.id,
    name: matchData.name,
    avatar: matchData.image,
    lastMessage: "У вас мэтч! Начните беседу",
    time: "сейчас",
    unread: 0,
    hasRead: true,
    messages: [],
    profile: matchData,
  }

  saveConversation(conversation)
}

// Create conversation from current profile
export function createConversationFromCurrentProfile(): number | null {
  const currentProfile = getCurrentProfile()
  if (!currentProfile) return null

  const conversationId = Date.now()
  const conversation = {
    id: conversationId,
    name: currentProfile.name,
    avatar: currentProfile.image,
    lastMessage: "Начните беседу",
    time: "сейчас",
    unread: 0,
    hasRead: true,
    messages: [],
    profile: currentProfile,
  }

  saveConversation(conversation)
  return conversationId
}

// Save current active profile data
export function saveCurrentProfile(profile: any): void {
  if (!storage) return
  storage.setItem("current_profile", JSON.stringify(profile))
}

// Get current active profile data
export function getCurrentProfile(): any | null {
  if (!storage) return null

  try {
    const profileData = storage.getItem("current_profile")
    return profileData ? JSON.parse(profileData) : null
  } catch {
    return null
  }
}

// Clear current profile
export function clearCurrentProfile(): void {
  if (!storage) return
  if (storage.deleteItem) {
    storage.deleteItem("current_profile")
  } else {
    storage.removeItem("current_profile")
  }
}
