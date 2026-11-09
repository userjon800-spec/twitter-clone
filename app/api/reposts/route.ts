import Notification from "@/database/notificationModel";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID topilmadi" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    }

    const isReposted = (post.reposts || []).some(
      (id: any) => id.toString() === currentUser._id.toString(),
    );

    if (isReposted) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { reposts: currentUser._id },
      });
      const updatedPost = await Post.findById(postId);
      return NextResponse.json({
        hasReposted: false,
        reposts: updatedPost?.reposts?.length || 0,
        message: "Repost bekor qilindi",
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { reposts: currentUser._id },
      });
      if (post.user && post.user.toString() !== currentUser._id.toString()) {
        await Notification.create({
          user: String(post.user),
          body: "Kimdir sizning postingizni repost qildi",
        });
        await User.findOneAndUpdate(
          { _id: String(post.user) },
          { $set: { hasNewNotifications: true } },
        );
      }
      const updatedPost = await Post.findById(postId);
      return NextResponse.json({
        hasReposted: true,
        reposts: updatedPost?.reposts?.length || 0,
        message: "Post repost qilindi",
      });
    }
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
