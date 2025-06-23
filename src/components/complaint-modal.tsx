"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export enum ComplaintReason {
  INAPPROPRIATE_CONTENT = "inappropriate_content",
  HARASSMENT = "harassment",
  FAKE_PROFILE = "fake_profile",
  SPAM = "spam",
  UNDERAGE = "underage",
  OTHER = "other",
}

const complaintReasons = {
  [ComplaintReason.INAPPROPRIATE_CONTENT]: "Неприемлемый контент",
  [ComplaintReason.HARASSMENT]: "Домогательства",
  [ComplaintReason.FAKE_PROFILE]: "Фальшивый профиль",
  [ComplaintReason.SPAM]: "Спам",
  [ComplaintReason.UNDERAGE]: "Несовершеннолетний",
  [ComplaintReason.OTHER]: "Другое",
}

interface ComplaintModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: ComplaintReason, description: string) => void
}

export default function ComplaintModal({ isOpen, onClose, onSubmit }: ComplaintModalProps) {
  const [selectedReason, setSelectedReason] = useState<ComplaintReason | null>(null)
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, description)
      setSelectedReason(null)
      setDescription("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Пожаловаться</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h3 className="font-medium mb-3">Причина жалобы:</h3>
            <div className="space-y-2">
              {Object.entries(complaintReasons).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedReason(key as ComplaintReason)}
                  className={`w-full p-3 text-left rounded-xl border transition-colors ${
                    selectedReason === key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Описание (необязательно):</h3>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите подробнее причину жалобы..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Отправить жалобу
          </Button>
        </div>
      </div>
    </div>
  )
}
