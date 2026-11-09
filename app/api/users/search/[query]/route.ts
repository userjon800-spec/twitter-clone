import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ query: string }> },
) {
  try {
    await connectToDatabase();
    const { query } = await params;
    if (!query || !query.trim()) {
      return NextResponse.json([]);
    }
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let users = await User.find({
      $or: [
        { name: { $regex: escapedQuery, $options: "i" } },
        { username: { $regex: escapedQuery, $options: "i" } },
        { email: { $regex: escapedQuery, $options: "i" } },
      ],
    }).select("name username _id profileImage email");
    return NextResponse.json(users);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
