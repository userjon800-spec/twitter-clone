import Post from "@/database/postModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { serializePost } from "@/lib/serializePost";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    await connectToDatabase();
    const { postId } = await params;
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;

    let post = await Post.findById(postId).populate({
      path: "user",
      model: User,
      select: "name email profileImage _id username",
    });
    if (!post) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    }
    return NextResponse.json(serializePost(post, currentUser?._id));
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
