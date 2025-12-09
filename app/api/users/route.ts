import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    let { searchParams } = new URL(req.url);
    let limit = searchParams.get("limit");
    let users = await User.find({})
      .select("name username _id profileImage email")
      .limit(Number(limit));
    return NextResponse.json(users);
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
