import Post from "@/database/postModel";
import Comment from "@/database/commentModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { serializeUser } from "@/app/api/users/serializeUser";
export async function GET(req: Request, route: { params: { postId: string } }) {
  try {
    await connectToDatabase();
    const { postId } = route.params;
    let post = await Post.findById(postId)
      .populate({
        path: "comments",
        model: Comment,
        populate: {
          path: "user",
          model: User,
          select: "name email profileImage _id username",
        },
        options: { sort: { likes: -1 } },
      })
      .sort({ createdAt: -1 });
    const serializedComments = post.comments.map((c: any) => ({
      _id: c._id.toString(),
      comment: c.comment,
      likes: c.likes ?? [],
      user: serializeUser(c.user),
      createdAt: c.createdAt,
    }));
    return NextResponse.json(serializedComments);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
