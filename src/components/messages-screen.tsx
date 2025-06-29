"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BottomNavigation from "./bottom-navigation"
import ChatScreen from "./chat-screen"
import type { Screen } from "@/App"
import { Img as Image } from 'react-image';
import { getConversations, saveCurrentProfile, getTempConversations } from "@/lib/telegram-auth"

interface MessagesScreenProps {
  onBack: () => void
  onChatClick: (conversationId: number) => void
  navigateToScreen: (screen: Screen) => void
}

interface Conversation {
  id: number
  name: string
  lastMessage: string
  time: string
  unread: number
  avatar: string
  hasRead?: boolean
}

export default function MessagesScreen({ onBack, onChatClick, navigateToScreen }: MessagesScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showChat, setShowChat] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)

  // Load conversations from backend
    const loadConversations = () => {
      const savedConversations = getConversations()
      const tempConversations = getTempConversations()

      // Combine saved and temporary conversations
      const allConversations = [...savedConversations, ...tempConversations]
      if (allConversations && allConversations.length > 0) {
        // Convert saved conversations to display format
        const displayConversations = allConversations.map((conv: any) => ({
          id: conv.id,
          name: conv.name || conv.profile?.name || "Пользователь",
          lastMessage: conv.lastMessage || "Новое сообщение",
          time: conv.time || "сейчас",
          unread: conv.unread || 0,
          avatar: conv.avatar || conv.profile?.image || "/placeholder.svg?height=60&width=60",
          hasRead: conv.hasRead !== undefined ? conv.hasRead : true,
        }))
        setConversations(displayConversations)
      } else {
        // Fallback to demo data
        setConversations([
        {
          id: 1,
          name: "Анна",
          lastMessage: "Стикер 😍",
          time: "23 мин",
          unread: 4,
          avatar: "/placeholder.svg?height=60&width=60",
          hasRead: false,
        },
        {
          id: 2,
          name: "Валерия",
          lastMessage: "Привет!",
          time: "27 мин",
          unread: 2,
          avatar: "/placeholder.svg?height=60&width=60",
          hasRead: false,
        },
        {
          id: 3,
          name: "Лиза",
          lastMessage: "Ок, увидимся.",
          time: "1 час",
          unread: 0,
          avatar: "/placeholder.svg?height=60&width=60",
          hasRead: true,
        },
      ])
      }
    }
  useEffect(() => {
    loadConversations()
  }, [])

  // Reload conversations when returning from chat
  useEffect(() => {
    if (!showChat) {
      loadConversations()
    }
  }, [showChat])
  const handleChatClick = (conversationId: number) => {
    // Mark conversation as read when clicked
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unread: 0, hasRead: true } : conv)),
    )
    // Save the conversation profile as current profile for chat
    const savedConversations = getConversations()
    const tempConversations = getTempConversations()
    const allConversations = [...savedConversations, ...tempConversations]
    const selectedConversation = allConversations.find((conv) => conv.id === conversationId)

    if (selectedConversation && selectedConversation.profile) {
      saveCurrentProfile(selectedConversation.profile)
    }
    setSelectedConversationId(conversationId)
    setShowChat(true)
  }

  const handleChatBack = () => {
    setShowChat(false)
    setSelectedConversationId(null)
    // Reload conversations when returning from chat
    setTimeout(() => {
      loadConversations()
    }, 100)
  }

  if (showChat) {
    return <ChatScreen onBack={handleChatBack} />
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="flex justify-center items-center p-4">
        <h1 className="text-2xl font-bold">Сообщения</h1>
      </div>

      {/* Conversations List */}
      <div className="px-4">
        {conversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            onClick={() => handleChatClick(conversation.id)}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <Image
                src={conversation.avatar || "/placeholder.svg"}
                alt={conversation.name}
                className="rounded-full object-cover w-[60px] h-[60px]"
              />
            </div>

            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg">{conversation.name}</h3>
              <p className="text-gray-600">{conversation.lastMessage}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-gray-400 text-sm">{conversation.time}</span>
              {conversation.unread > 0 && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{conversation.unread}</span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="messages" onNavigate={navigateToScreen} />
    </div>
  )
}
