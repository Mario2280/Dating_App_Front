"use client"

import { useEffect, useRef } from "react"
import type { TelegramUser } from "@/lib/types"

interface TelegramLoginWidgetProps {
  botName: string // Your bot username without @
  onAuth: (user: TelegramUser) => void
  buttonSize?: "large" | "medium" | "small"
  cornerRadius?: number
  requestAccess?: boolean
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void
    }
  }
}

export default function TelegramLoginWidget({
  botName = "SomeDatingBot",
  onAuth,
  buttonSize = "large",
  cornerRadius = 20,
  requestAccess = true,
}: TelegramLoginWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Set up the callback function
    window.TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuth(user)
      },
    }

    // Create the script element
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.setAttribute("data-telegram-login", botName)
    script.setAttribute("data-size", buttonSize)
    script.setAttribute("data-corner-radius", cornerRadius.toString())
    script.setAttribute("data-request-access", requestAccess ? "write" : "read")
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)")
    script.async = true

    ref.current.appendChild(script)

    return () => {
      if (ref.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [botName, buttonSize, cornerRadius, requestAccess, onAuth])

  return <div ref={ref} />
}
