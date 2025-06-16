import { type NextRequest, NextResponse } from "next/server"
import { getTelegramUser } from "@/lib/telegram-auth"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const telegramUser = getTelegramUser()
    if (!telegramUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const walletData = await request.json()

    // Validate wallet data
    if (!walletData.id || !walletData.type) {
      return NextResponse.json({ error: "Invalid wallet data" }, { status: 400 })
    }

    // Here you would typically save the wallet connection to your database
    // For now, we'll just simulate a successful save

    // Example database save:
    // await db.userWallet.create({
    //   data: {
    //     userId: telegramUser.id,
    //     walletId: walletData.id,
    //     walletType: walletData.type,
    //     walletAddress: walletData.address,
    //     walletChain: walletData.chain,
    //     walletName: walletData.name,
    //     connectedAt: new Date(),
    //   }
    // })

    console.log("Wallet connected:", walletData)

    // Return the wallet data with additional fields
    return NextResponse.json({
      ...walletData,
      connected_at: walletData.connected_at || new Date().toISOString(),
    })
  } catch (error) {
    console.error("Wallet connection error:", error)
    return NextResponse.json({ error: "Failed to connect wallet" }, { status: 500 })
  }
}
