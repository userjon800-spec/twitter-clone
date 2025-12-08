import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    let { email, password } = await req.json();
    let isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return NextResponse.json(
        { error: "Ushbu elektron pochta mavjud emas" },
        { status: 400 }
      );
    }
    let isPasswordValid = await compare(password, isExistingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 400 });
    }
    return NextResponse.json({ success: true , user: isExistingUser});
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
