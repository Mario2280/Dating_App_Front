import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    const clientId = process.env.INSTAGRAM_APP_ID
    const clientSecret = process.env.INSTAGRAM_APP_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ error: "Instagram credentials not configured" }, { status: 500 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error("Instagram token exchange failed:", error)
      return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    return NextResponse.json({
      access_token: tokenData.access_token,
      user_id: tokenData.user_id,
    })
  } catch (error) {
    console.error("Instagram token exchange error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
