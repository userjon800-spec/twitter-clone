import Post from "@/database/postModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { serializePost } from "../serializePosts";
export async function GET(req: Request, route: { params: { postId: string } }) {
  try {
    await connectToDatabase();
    const { postId } = route.params;
    let post = await Post.findById(postId).populate({
        path: 'user',
        model: User,
        select: "name email profileImage _id username  "
    })
    return NextResponse.json(serializePost(post))
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
