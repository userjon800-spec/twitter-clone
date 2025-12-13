import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { serializePost } from "@/lib/serializePost";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    let { currentUser }: any = await getServerSession(authOption);
    let { searchParams } = new URL(req.url);
    let limit = searchParams.get("limit");
    let posts = await Post.find({ user: route.params.userId })
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    let filteredPosts = posts.map((p) => serializePost(p, currentUser?._id));
    return NextResponse.json(filteredPosts);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
