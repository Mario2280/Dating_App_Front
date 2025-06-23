"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Filter, Search, AlertCircle, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Img as Image } from 'react-image';
interface ModerationReportProps {
  id: string
  reporter_id: string
  target_id: string
  content_type: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  created_at: string
  message_content?: string // Add message content for harassment reports
  reporter: {
    name: string
    profile_photo?: string
  }
  target: {
    name: string
    profile_photo?: string
  }
}

interface ModerationPanelScreenProps {
  onBack: () => void
}

// Mock data for reports with message content
const mockReports: ModerationReportProps[] = [
  {
    id: "1",
    reporter_id: "101",
    target_id: "102",
    content_type: "PROFILE",
    reason: "FAKE_PROFILE",
    status: "PENDING",
    created_at: "2025-06-10T14:30:00",
    reporter: {
      name: "Анна Иванова",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
    target: {
      name: "Максим Петров",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: "2",
    reporter_id: "103",
    target_id: "104",
    content_type: "MESSAGE",
    reason: "HARASSMENT",
    status: "PENDING",
    created_at: "2025-06-09T10:15:00",
    message_content: "Ты такая уродливая, никто тебя не полюбит. Лучше удали аккаунт и не позорься.",
    reporter: {
      name: "Елена Смирнова",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
    target: {
      name: "Алексей Козлов",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: "3",
    reporter_id: "105",
    target_id: "106",
    content_type: "MESSAGE",
    reason: "HARASSMENT",
    status: "PENDING",
    created_at: "2025-06-08T16:45:00",
    message_content: "Давай встретимся, я знаю где ты живешь. Не игнорируй меня!",
    reporter: {
      name: "Дмитрий Соколов",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
    target: {
      name: "Ольга Новикова",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: "4",
    reporter_id: "107",
    target_id: "108",
    content_type: "PROFILE",
    reason: "SPAM",
    status: "REJECTED",
    created_at: "2025-06-07T09:30:00",
    reporter: {
      name: "Сергей Морозов",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
    target: {
      name: "Наталья Волкова",
      profile_photo: "/placeholder.svg?height=50&width=50",
    },
  },
]

const reasonLabels: Record<string, string> = {
  FAKE_PROFILE: "Фейковый профиль",
  HARASSMENT: "Домогательство",
  INAPPROPRIATE_CONTENT: "Неприемлемый контент",
  SPAM: "Спам",
  SCAM: "Мошенничество",
  OTHER: "Другое",
}

const contentTypeLabels: Record<string, string> = {
  PROFILE: "Профиль",
  MESSAGE: "Сообщение",
  PHOTO: "Фотография",
}

export default function ModerationPanelScreen({ onBack }: ModerationPanelScreenProps) {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<ModerationReportProps | null>(null)
  const [showReportDetails, setShowReportDetails] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionTarget, setActionTarget] = useState<"reporter" | "target" | "">("")
  const [punishmentType, setPunishmentType] = useState("")
  const [punishmentDuration, setPunishmentDuration] = useState("")
  const [punishmentReason, setPunishmentReason] = useState("")

  const filteredReports = mockReports.filter((report) => {
    // Filter by status
    if (activeTab === "pending" && report.status !== "PENDING") return false
    if (activeTab === "approved" && report.status !== "APPROVED") return false
    if (activeTab === "rejected" && report.status !== "REJECTED") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        report.reporter.name.toLowerCase().includes(query) ||
        report.target.name.toLowerCase().includes(query) ||
        reasonLabels[report.reason].toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewReport = (report: ModerationReportProps) => {
    setSelectedReport(report)
    setShowReportDetails(true)
  }

  const handleTakeAction = () => {
    setShowActionDialog(true)
  }

  const handleRejectReport = () => {
    if (!selectedReport) return

    // In a real app, we would call an API to update the report status
    setShowReportDetails(false)
    setSelectedReport(null)
  }

  const confirmAction = () => {
    if (!selectedReport || !actionTarget || !punishmentType) return

    // In a real app, we would call an API to apply the punishment
    console.log("Applying punishment:", {
      reportId: selectedReport.id,
      target: actionTarget,
      punishmentType,
      duration: punishmentDuration,
      reason: punishmentReason,
    })

    // Close dialogs
    setShowActionDialog(false)
    setShowReportDetails(false)
    setSelectedReport(null)
    setActionTarget("")
    setPunishmentType("")
    setPunishmentDuration("")
    setPunishmentReason("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Ожидает</span>
      case "APPROVED":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Одобрено</span>
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Отклонено</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <h1 className="text-xl font-semibold">Панель модератора</h1>
        <Button variant="ghost" size="icon" className="rounded-2xl opacity-0">
          <Filter className="h-6 w-6" />
        </Button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск жалоб..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pending">Ожидающие</TabsTrigger>
            <TabsTrigger value="approved">Одобренные</TabsTrigger>
            <TabsTrigger value="rejected">Отклоненные</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} onClick={() => handleViewReport(report)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Нет ожидающих жалоб</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} onClick={() => handleViewReport(report)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Нет одобренных жалоб</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            {filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} onClick={() => handleViewReport(report)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Нет отклоненных жалоб</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Details Modal - Fixed responsive design */}
      {showReportDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Детали жалобы</h2>
              <button
                onClick={() => setShowReportDetails(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedReport && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">ID жалобы:</span>
                    <span className="font-medium">{selectedReport.id}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Статус:</span>
                    {getStatusBadge(selectedReport.status)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Дата создания:</span>
                    <span className="font-medium text-sm">{formatDate(selectedReport.created_at)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Тип контента:</span>
                    <span className="font-medium">{contentTypeLabels[selectedReport.content_type]}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Причина:</span>
                    <span className="font-medium">{reasonLabels[selectedReport.reason]}</span>
                  </div>

                  {/* Show message content for harassment reports */}
                  {selectedReport.message_content && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Содержание сообщения</h3>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-medium break-words">{selectedReport.message_content}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Отправитель жалобы</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={selectedReport.reporter.profile_photo || "/placeholder.svg?height=40&width=40"}
                          alt="Reporter"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{selectedReport.reporter.name}</p>
                        <p className="text-sm text-gray-500">ID: {selectedReport.reporter_id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Цель жалобы</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={selectedReport.target.profile_photo || "/placeholder.svg?height=40&width=40"}
                          alt="Target"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{selectedReport.target.name}</p>
                        <p className="text-sm text-gray-500">ID: {selectedReport.target_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedReport?.status === "PENDING" && (
              <div className="p-6 border-t">
                <div className="flex gap-3">
                  <Button onClick={handleTakeAction} className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Принять меры
                  </Button>
                  <Button
                    onClick={handleRejectReport}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Отклонить
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Dialog - Fixed responsive design */}
      {showActionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Принять меры</h2>
              <button
                onClick={() => setShowActionDialog(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Кого наказать?</Label>
                  <Select value={actionTarget} onValueChange={setActionTarget}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="target">Цель жалобы ({selectedReport?.target.name})</SelectItem>
                      <SelectItem value="reporter">Отправитель жалобы ({selectedReport?.reporter.name})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Тип наказания</Label>
                  <Select value={punishmentType} onValueChange={setPunishmentType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите наказание" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">Предупреждение</SelectItem>
                      <SelectItem value="temporary_block">Временная блокировка</SelectItem>
                      <SelectItem value="permanent_block">Постоянная блокировка</SelectItem>
                      <SelectItem value="content_removal">Удаление контента</SelectItem>
                      <SelectItem value="feature_restriction">Ограничение функций</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {punishmentType === "temporary_block" && (
                  <div>
                    <Label className="text-sm font-medium">Длительность блокировки</Label>
                    <Select value={punishmentDuration} onValueChange={setPunishmentDuration}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Выберите длительность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 час</SelectItem>
                        <SelectItem value="6h">6 часов</SelectItem>
                        <SelectItem value="24h">24 часа</SelectItem>
                        <SelectItem value="3d">3 дня</SelectItem>
                        <SelectItem value="7d">7 дней</SelectItem>
                        <SelectItem value="30d">30 дней</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Причина наказания</Label>
                  <Textarea
                    value={punishmentReason}
                    onChange={(e) => setPunishmentReason(e.target.value)}
                    placeholder="Укажите причину наказания..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowActionDialog(false)} className="flex-1">
                  Отмена
                </Button>
                <Button
                  onClick={confirmAction}
                  disabled={!actionTarget || !punishmentType || !punishmentReason}
                  className="bg-orange-500 hover:bg-orange-600 flex-1"
                >
                  Применить наказание
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Report Card Component
function ReportCard({ report, onClick }: { report: ModerationReportProps; onClick: () => void }) {
  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src={report.reporter.profile_photo || "/placeholder.svg?height=32&width=32"}
              alt="Reporter"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium truncate">{report.reporter.name}</span>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div className="flex justify-between items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500 mb-1">Жалоба на: {contentTypeLabels[report.content_type]}</p>
          <p className="font-medium">{reasonLabels[report.reason]}</p>
          {report.message_content && <p className="text-xs text-red-600 mt-1 truncate">"{report.message_content}"</p>}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <span>ID: {report.id}</span>
        <span>{formatDate(report.created_at)}</span>
      </div>
    </div>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex-shrink-0">
          Ожидает
        </span>
      )
    case "APPROVED":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex-shrink-0">
          Одобрено
        </span>
      )
    case "REJECTED":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex-shrink-0">
          Отклонено
        </span>
      )
    default:
      return null
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
