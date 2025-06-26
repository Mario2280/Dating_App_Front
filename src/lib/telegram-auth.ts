import AuthService, { type CompleteProfileData } from "./auth.service"
import type { TelegramUser, ProfileData } from "./types"
import { cloudStorage } from "@telegram-apps/sdk-react"

let storage = null
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
  if (!storage) return null
  storage.setItem("profile_data", JSON.stringify(profile))
}

// Get current profile data
export function getProfileData(): ProfileData | null {
  if (!storage) return

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


// Save chat messages for current profile
export function saveChatMessages(messages: any[]): void {
  const currentProfile = getCurrentProfile()
  if (!storage || !currentProfile) return

  const key = `chat_messages_${currentProfile.id}`
  storage.setItem(key, JSON.stringify(messages))

  // Also update the conversation's last message if messages exist
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    updateConversationLastMessage(currentProfile.id, lastMessage.text || "Фото", lastMessage.time)
  }
}
// Delete conversation and messages by match ID
export function deleteConversationByMatchId(matchId: number): void {
  if (!storage) return

  // Remove from conversations list
  const conversations = getConversations()
  const conversationToDelete = conversations.find((conv) => conv.id === matchId)

  if (conversationToDelete) {
    // Remove chat messages
    const profileId = conversationToDelete.profile?.id || matchId
    const key = `chat_messages_${profileId}`
    if (storage.deleteItem) {
      storage.deleteItem(key)
    } else {
      storage.removeItem(key)
    }
  }

  // Remove conversation from list
  const filteredConversations = conversations.filter((conv) => conv.id !== matchId)
  saveConversations(filteredConversations)
}

// Get chat messages for current profile
export function getChatMessages(): any[] {
  const currentProfile = getCurrentProfile()
  if (!storage || !currentProfile) return []

  try {
    const key = `chat_messages_${currentProfile.id}`
    const messagesData = storage.getItem(key)
    return messagesData ? JSON.parse(messagesData) : []
  } catch {
    return []
  }
}

// Delete conversation and messages by profile ID
export function deleteConversationByProfileId(profileId: number): void {
  if (!storage) return

  // Remove from conversations list
  const conversations = getConversations()
  const filteredConversations = conversations.filter((conv) => conv.profile?.id !== profileId)
  saveConversations(filteredConversations)

  // Remove chat messages
  const key = `chat_messages_${profileId}`
  if (storage.deleteItem) {
    storage.deleteItem(key)
  } else {
    storage.removeItem(key)
  }
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


// Update conversation with last message
export function updateConversationLastMessage(profileId: number, lastMessage: string, time: string): void {
  if (!storage) return

  const conversations = getConversations()
  const conversationIndex = conversations.findIndex((conv) => conv.profile && conv.profile.id === profileId)

  if (conversationIndex >= 0) {
    conversations[conversationIndex].lastMessage = lastMessage
    conversations[conversationIndex].time = time
    conversations[conversationIndex].hasRead = false

    // Move conversation to top
    const updatedConversation = conversations.splice(conversationIndex, 1)[0]
    conversations.unshift(updatedConversation)

    saveConversations(conversations)
  }
}

// Save likes count
export function saveLikesCount(count: number): void {
  if (!storage) return
  storage.setItem("likes_count", count.toString())
}

// Get likes count
export function getLikesCount(): number {
  if (!storage) return 50 // Default value

  try {
    const likesData = storage.getItem("likes_count")
    return likesData ? Number.parseInt(likesData, 10) : 50
  } catch {
    return 50
  }
}

// Save temporary conversations (for message button clicks)
export function saveTempConversations(conversations: any[]): void {
  if (!storage) return
  storage.setItem("temp_conversations", JSON.stringify(conversations))
}

// Get temporary conversations
export function getTempConversations(): any[] {
  if (!storage) return []

  try {
    const tempData = storage.getItem("temp_conversations")
    return tempData ? JSON.parse(tempData) : []
  } catch {
    return []
  }
}

// Remove temporary conversation by profile ID
export function removeTempConversation(profileId: number): void {
  if (!storage) return

  const tempConversations = getTempConversations()
  const filtered = tempConversations.filter((conv) => conv.profile?.id !== profileId)
  saveTempConversations(filtered)
}

// Get conversation by profile ID
export function getConversationByProfileId(profileId: number): any | null {
  const conversations = getConversations()
  return conversations.find((conv) => conv.profile && conv.profile.id === profileId) || null
}

// Create conversation from current profile with consistent ID
export function createConversationFromCurrentProfile(): number | null {
  const currentProfile = getCurrentProfile()
  if (!currentProfile) return null

   // Use profile ID as conversation ID for consistency
   const conversationId = currentProfile.id || Date.now()

   // Check if conversation already exists
   const existingConversation = getConversationByProfileId(conversationId)
   if (existingConversation) {
     return existingConversation.id
   }
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
// Get or create conversation for current profile
export function getOrCreateConversationForCurrentProfile(): any | null {
  const currentProfile = getCurrentProfile()
  if (!currentProfile) return null

  // Try to find existing conversation by profile ID
  let conversation = getConversationByProfileId(currentProfile.id)

  if (!conversation) {
    // Create new conversation if doesn't exist
    const conversationId = createConversationFromCurrentProfile()
    conversation = getConversationById(conversationId)
  }

  return conversation
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
