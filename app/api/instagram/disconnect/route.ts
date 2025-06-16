import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Here you would typically remove the Instagram connection from your database
    // For now, we'll just simulate a successful disconnection

    // Example database removal:
    // await db.userInstagramConnection.deleteMany({
    //   where: {
    //     userId: getCurrentUserId(), // Get from auth
    //   }
    // })

    console.log("Instagram profile disconnected")

    return NextResponse.json({
      success: true,
      message: "Instagram account disconnected successfully",
    })
  } catch (error) {
    console.error("Instagram disconnection error:", error)
    return NextResponse.json({ error: "Failed to disconnect Instagram account" }, { status: 500 })
  }
}
