import Notification from "@/database/notificationModel";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { serializePost } from "@/lib/serializePost";
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
    let { postId } = await req.json();
    let post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    }
    const alreadyLiked = post.likes.some(
      (id: any) => id.toString() === currentUser._id.toString(),
    );
    if (!alreadyLiked) {
      post.likes.push(currentUser._id);
      await post.save();
      if (post.user && post.user.toString() !== currentUser._id.toString()) {
        await Notification.create({
          user: String(post.user),
          body: "Kimdir sizning postingizni yoqtirdi",
        });
        await User.findOneAndUpdate(
          { _id: String(post.user) },
          { $set: { hasNewNotifications: true } },
        );
      }
    }
    await post.populate("user");
    return NextResponse.json(serializePost(post, currentUser._id));
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
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
    let { postId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    }
    post.likes = post.likes.filter(
      (id: any) => id.toString() !== currentUser._id.toString(),
    );
    await post.save();
    await post.populate("user");
    return NextResponse.json(serializePost(post, currentUser._id));
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
