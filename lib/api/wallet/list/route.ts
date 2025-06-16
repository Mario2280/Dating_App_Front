import { type NextRequest, NextResponse } from "next/server"
import { getTelegramUser } from "@/lib/telegram-auth"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const telegramUser = getTelegramUser()
    if (!telegramUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Here you would typically fetch the user's wallets from your database
    // For now, we'll just return mock data

    // Example database query:
    // const wallets = await db.userWallet.findMany({
    //   where: {
    //     userId: telegramUser.id,
    //   }
    // })

    // Mock data
    const wallets = [
      {
        id: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        type: "ton",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        chain: "-239",
        name: "TON Wallet",
        connected_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json(wallets)
  } catch (error) {
    console.error("Wallet list fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 })
  }
}
