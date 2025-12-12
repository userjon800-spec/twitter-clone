import Comment from "@/database/commentModel";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { postId: string } }) {
  try {
    await connectToDatabase();
    const { postId } = route.params;

    const { currentUser }: any = await getServerSession(authOption);

    const post = await Post.findById(postId).populate({
      path: "comments",
      model: Comment,
      populate: {
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      },
      options: { sort: { likes: -1 } },
    });

    const filteredComments = post.comments.map((item: any) => ({
      body: item.body,
      createdAt: item.createdAt,
      user: {
        _id: item.user._id,
        name: item.user.name,
        username: item.user.username,
        profileImage: item.user.profileImage,
        email: item.user.email,
      },
      likes: item.likes.length,
      hasLiked: item.likes.includes(currentUser._id),
      _id: item._id,
    }));

    return NextResponse.json(filteredComments);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
