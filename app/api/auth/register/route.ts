import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    let { searchParams } = new URL(req.url);
    let step = searchParams.get("step");
    if (step === "1") {
      let { email } = await req.json();
      let isExistingUser = await User.findOne({ email });
      if (isExistingUser) {
        return NextResponse.json(
          { error: "Bu allaqachon email ro'yxatdan o'tgan" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    } else if (step === "2") {
      let { email, username, name, password } = await req.json();
      let isExistingUsername = await User.findOne({ username });
      if (isExistingUsername) {
        return NextResponse.json(
          { error: "Bu username ro'yxatdan o'tgan" },
          { status: 400 }
        );
      }
      const hashedPassword = await hash(password, 10);
      let user = await User.create({
        email,
        username,
        name,
        password: hashedPassword,
      });
      return NextResponse.json({ success: true, user });
    }
  } catch (error) {
    let result = error as Error;
    console.error("API /api/auth/register error:", error);
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
