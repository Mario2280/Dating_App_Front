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
  console.log(filters);
  
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


// Conversation management
export interface ConversationMessage {
  id: number
  text?: string
  image?: string
  time: string
  sender: "me" | "other"
  status?: "sent" | "read"
}

export interface ConversationData {
  id: number
  partnerId: number
  partnerName: string
  partnerAvatar: string
  partnerAge?: number
  partnerOccupation?: string
  partnerLocation?: string
  partnerDistance?: string
  messages: ConversationMessage[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  createdAt: string
}

export interface MatchData {
  id: number
  name: string
  age: number
  image: string
  occupation?: string
  location?: string
  distance?: string
  matchedAt: string
  isRejected?: boolean
}

// Save conversation
export function saveConversation(conversation: ConversationData): void {
  if (!storage) return

  const conversations = getConversations()
  const existingIndex = conversations.findIndex((c) => c.id === conversation.id)

  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation
  } else {
    conversations.push(conversation)
  }

  storage.setItem("conversations", JSON.stringify(conversations))
}

// Get all conversations
export function getConversations(): ConversationData[] {
  if (!storage) return []

  try {
    const conversationsData = storage.getItem("conversations")
    return conversationsData ? JSON.parse(conversationsData) : []
  } catch {
    return []
  }
}

// Get specific conversation
export function getConversation(conversationId: number): ConversationData | null {
  const conversations = getConversations()
  return conversations.find((c) => c.id === conversationId) || null
}

// Add message to conversation
export function addMessageToConversation(conversationId: number, message: ConversationMessage): void {
  const conversation = getConversation(conversationId)
  if (!conversation) return

  conversation.messages.push(message)
  conversation.lastMessage = message.text || "Изображение"
  conversation.lastMessageTime = message.time

  // Update unread count if message is from other person
  if (message.sender === "other") {
    conversation.unreadCount += 1
  }

  saveConversation(conversation)
}

// Mark conversation as read
export function markConversationAsRead(conversationId: number): void {
  const conversation = getConversation(conversationId)
  if (!conversation) return

  conversation.unreadCount = 0
  conversation.messages = conversation.messages.map((msg) =>
    msg.sender === "me" && msg.status === "sent" ? { ...msg, status: "read" } : msg,
  )

  saveConversation(conversation)
}

// Create new conversation from match
export function createConversationFromMatch(match: MatchData): ConversationData {
  const newConversation: ConversationData = {
    id: Date.now(), // Use timestamp as unique ID
    partnerId: match.id,
    partnerName: match.name,
    partnerAvatar: match.image,
    partnerAge: match.age,
    partnerOccupation: match.occupation,
    partnerLocation: match.location,
    partnerDistance: match.distance,
    messages: [],
    lastMessage: "",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  }

  saveConversation(newConversation)
  return newConversation
}

// Match management
export function saveMatch(match: MatchData): void {
  if (!storage) return

  const matches = getMatches()
  const existingIndex = matches.findIndex((m) => m.id === match.id)

  if (existingIndex >= 0) {
    matches[existingIndex] = match
  } else {
    matches.push(match)
  }

  storage.setItem("matches", JSON.stringify(matches))
}

// Get all matches
export function getMatches(): MatchData[] {
  if (!storage) return []

  try {
    const matchesData = storage.getItem("matches")
    return matchesData ? JSON.parse(matchesData) : []
  } catch {
    return []
  }
}

// Reject match
export function rejectMatch(matchId: number): void {
  const matches = getMatches()
  const matchIndex = matches.findIndex((m) => m.id === matchId)

  if (matchIndex >= 0) {
    matches[matchIndex].isRejected = true
    storage.setItem("matches", JSON.stringify(matches))
  }
}

// Save current chat partner
export function saveCurrentChatPartner(partner: {
  id: number
  name: string
  avatar: string
  age?: number
  occupation?: string
  location?: string
  distance?: string
}): void {
  if (!storage) return
  storage.setItem("current_chat_partner", JSON.stringify(partner))
}