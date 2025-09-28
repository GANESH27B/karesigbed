import { type NextRequest, NextResponse } from "next/server"
import { UserModel } from "@/lib/models/User"
import { withAuthorization, type AuthorizedHandler } from "@/withAuthorization"

const lookupUserHandler: AuthorizedHandler<{ identifier: string }> = async (
  request,
  context,
) => {
  const { identifier } = context.params

  try {
    // This query will attempt to find a user where the identifier matches
    // the registration_number, student_id, or the primary id.
    const query = `
      SELECT * FROM users 
      WHERE registration_number = ? OR student_id = ? OR id = ?
      LIMIT 1
    `
    const result = await UserModel.executeQuery(query, [identifier, identifier, identifier])

    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      const user = result.data[0]
      // Map to camelCase for a consistent API response
      const responseUser = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        profileImage: user.profile_image,
        studentId: user.student_id,
        registrationNumber: user.registration_number,
        joinDate: user.join_date,
        isActive: !!user.is_active,
      }
      return NextResponse.json({ success: true, user: responseUser })
    } else {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = withAuthorization(lookupUserHandler, ["admin"])
