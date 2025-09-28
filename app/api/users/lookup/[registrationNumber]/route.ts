
import { NextResponse } from "next/server";
import { UserModel } from "@/lib/models/User";

export async function GET(
  request: Request,
  { params }: { params: { registrationNumber: string } }
) {
  try {
    const { registrationNumber } = params;
    const result = await UserModel.findByRegistrationNumber(registrationNumber);

    if (result.success && result.data) {
        const user = result.data;
        // Rename keys to match what the frontend expects
        const formattedUser = {
            id: user.id,
            name: user.full_name,
            registrationNumber: user.registration_number,
            avatar: user.profile_image,
        };
      return NextResponse.json(formattedUser);
    } else {
      return new NextResponse("User not found", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
