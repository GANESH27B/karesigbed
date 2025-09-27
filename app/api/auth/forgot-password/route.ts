import { type NextRequest, NextResponse } from "next/server"
import { UserModel } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    
    // Email validation
    const isAdminEmail = [
      "admin@smartattend.com", 
      "superadmin@gmail.com",
      "admin1@klu.ac.in",
      "admin2@klu.ac.in",
      "admin3@klu.ac.in",
      "admin4@klu.ac.in",
      "admin@gmail.com"
    ].includes(email)
    const isUserEmail = email.endsWith("@klu.ac.in")

    if (!isAdminEmail && !isUserEmail) {
      return NextResponse.json({ error: "Invalid email domain" }, { status: 400 })
    }

    // Check if user exists
    const userResult = await UserModel.findByEmail(email)
    if (!userResult.success) {
      return NextResponse.json({ error: "Email address not found" }, { status: 404 })
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    // 4. Handle the reset process

    // For now, we'll just return a success message
    return NextResponse.json({
      success: true,
      message: "Password reset instructions have been sent to your email address."
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}