"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Send, Clock, ChevronDown } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import ComplaintModal, { type ComplaintReason } from "./complaint-modal"
import ChatProfileView from "./chat-profile-view"

interface ChatScreenProps {
  onBack: () => void
}

interface Message {
  id: number
  text?: string
  image?: string
  time: string
  sender: "anna" | "me"
  status?: "sent" | "read"
}

export default function ChatScreen({ onBack }: ChatScreenProps) {
  const [newMessage, setNewMessage] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Привет, Кирилл! Видела в приложении, что мы уже несколько раз пересекались 😊",
      time: "2:55",
      sender: "anna",
    },
    {
      id: 2,
      text: "Ахах, приятно познакомиться, Анна! Может, выпьем кофе сегодня вечером? ☕",
      time: "3:02",
      sender: "me",
      status: "read",
    },
    {
      id: 3,
      text: "Давай! 😊",
      time: "3:10",
      sender: "anna",
    },
    {
      id: 4,
      text: "Чуть позже напишу. До скорого!",
      time: "3:12",
      sender: "me",
      status: "read",
    },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate message read status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatMessages((prev) =>
        prev.map((msg) => (msg.sender === "me" && msg.status === "sent" ? { ...msg, status: "read" } : msg)),
      )
    }, 2000)

    return () => clearTimeout(timer)
  }, [chatMessages])

  const handleComplaint = (reason: ComplaintReason, description: string) => {
    console.log("Complaint submitted:", { reason, description })
    alert("Жалоба отправлена. Спасибо за обращение!")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImageMessage: Message = {
          id: chatMessages.length + 1,
          image: e.target?.result as string,
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          sender: "me",
          status: "sent",
        }
        setChatMessages((prev) => [...prev, newImageMessage])
      }
      reader.readAsDataURL(file)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: chatMessages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        sender: "me",
        status: "sent",
      }
      setChatMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const diff = currentY - startY
    if (diff > 0) {
      setDragY(diff)
    }
  }

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setIsClosing(true)
      setTimeout(() => {
        onBack()
      }, 300)
    } else {
      setDragY(0)
    }
  }

  if (showProfile) {
    return (
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <ChatProfileView onBack={() => setShowProfile(false)} />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: isClosing ? "100%" : 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{ y: dragY }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag indicator */}
      <div className="flex justify-center py-2 bg-white">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronDown className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3 flex-1" onClick={() => setShowProfile(true)}>
          <div className="relative cursor-pointer">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Anna"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="cursor-pointer">
            <h2 className="font-semibold text-lg">Анна</h2>
            <p className="text-blue-500 text-sm">● У вас мэтч</p>
          </div>
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal className="h-6 w-6" />
          </Button>

          {showMenu && (
            <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg border p-2 min-w-[150px] z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl">Заблокировать</button>
              <button
                onClick={() => {
                  setShowComplaintModal(true)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl"
              >
                Пожаловаться
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date Separator */}
      <div className="flex justify-center py-4">
        <span className="bg-gray-200 px-4 py-1 rounded-full text-sm text-gray-600">Вчера</span>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[80%]">
              <div
                className={`p-4 rounded-2xl ${
                  message.sender === "me"
                    ? "bg-gray-200 text-gray-900 rounded-br-md"
                    : "bg-blue-100 text-gray-900 rounded-bl-md"
                }`}
              >
                {message.text && <p>{message.text}</p>}
                {message.image && (
                  <Image
                    src={message.image || "/placeholder.svg"}
                    alt="Sent image"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div className={`flex items-center gap-1 mt-1 ${message.sender === "me" ? "justify-end" : ""}`}>
                <span className="text-xs text-gray-500">{message.time}</span>
                {message.sender === "me" && (
                  <div className="flex">
                    <div className={`w-3 h-3 ${message.status === "read" ? "text-blue-500" : "text-gray-400"}`}>✓</div>
                    <div className={`w-3 h-3 -ml-1 ${message.status === "read" ? "text-blue-500" : "text-gray-400"}`}>
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение"
            className="border-0 bg-transparent p-0 focus-visible:ring-0"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Clock className="h-5 w-5 text-gray-400" />
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
        <Button size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600" onClick={sendMessage}>
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        onSubmit={handleComplaint}
      />
    </motion.div>
  )
}
