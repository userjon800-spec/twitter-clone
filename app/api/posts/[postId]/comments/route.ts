import Comment from "@/database/commentModel";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    await connectToDatabase();
    const { postId } = await params;
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    const post = await Post.findById(postId).populate({
      path: "comments",
      model: Comment,
      populate: {
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      },
      options: { sort: { createdAt: -1 } },
    });
    if (!post) {
      return NextResponse.json([]);
    }
    const filteredComments = (post.comments || []).map((item: any) => ({
      _id: item._id,
      body: item.body,
      createdAt: item.createdAt,
      user: item.user
        ? {
            _id: item.user._id,
            name: item.user.name,
            username: item.user.username,
            profileImage: item.user.profileImage,
            email: item.user.email,
          }
        : null,
      likes: Array.isArray(item.likes) ? item.likes.length : 0,
      hasLiked:
        currentUser?._id && Array.isArray(item.likes)
          ? item.likes.some(
              (id: any) => id.toString() === currentUser._id.toString(),
            )
          : false,
    }));
    return NextResponse.json(filteredComments);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
