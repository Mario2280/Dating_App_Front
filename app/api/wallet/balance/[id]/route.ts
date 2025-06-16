import { type NextRequest, NextResponse } from "next/server"
import { getTelegramUser } from "@/lib/telegram-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authenticated user
    const telegramUser = getTelegramUser()
    if (!telegramUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const walletId = params.id

    // Here you would typically fetch the wallet balance from blockchain or payment provider
    // For now, we'll just return mock data

    // Mock data
    const balance = {
      balance: "123.45",
      currency: walletId.startsWith("EQ") ? "TON" : "USD",
    }

    return NextResponse.json(balance)
  } catch (error) {
    console.error("Wallet balance fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet balance" }, { status: 500 })
  }
}
