"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import BottomNavigation from "./bottom-navigation"
import ChatScreen from "./chat-screen"
import type { Screen } from "@/app/page"
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
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Анна",
      lastMessage: "Стикер 😍",
      time: "23 мин",
      unread: 1,
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

  const [showChat, setShowChat] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)

  const handleChatClick = (conversationId: number) => {
    // Mark conversation as read when clicked
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unread: 0, hasRead: true } : conv)),
    )
    setSelectedConversationId(conversationId)
    setShowChat(true)
  }

  const handleChatBack = () => {
    setShowChat(false)
    setSelectedConversationId(null)
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
                width={60}
                height={60}
                className="rounded-full object-cover"
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
