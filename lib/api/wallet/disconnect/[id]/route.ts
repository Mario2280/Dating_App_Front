import { type NextRequest, NextResponse } from "next/server"
import { getTelegramUser } from "@/lib/telegram-auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authenticated user
    const telegramUser = getTelegramUser()
    if (!telegramUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const walletId = params.id

    // Here you would typically remove the wallet connection from your database
    // For now, we'll just simulate a successful disconnection

    // Example database removal:
    // await db.userWallet.deleteMany({
    //   where: {
    //     userId: telegramUser.id,
    //     walletId: walletId,
    //   }
    // })

    console.log("Wallet disconnected:", walletId)

    return NextResponse.json({
      success: true,
      message: "Wallet disconnected successfully",
    })
  } catch (error) {
    console.error("Wallet disconnection error:", error)
    return NextResponse.json({ error: "Failed to disconnect wallet" }, { status: 500 })
  }
}
