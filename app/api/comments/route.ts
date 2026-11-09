import Comment from "@/database/commentModel";
import Notification from "@/database/notificationModel";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
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
    let { body, postId } = await req.json();
    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: "Izoh bo'sh bo'lishi mumkin emas" },
        { status: 400 },
      );
    }
    let comment = await Comment.create({
      body: body.trim(),
      post: postId,
      user: currentUser._id,
    });
    let post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    if (
      post &&
      post.user &&
      post.user.toString() !== currentUser._id.toString()
    ) {
      await Notification.create({
        user: String(post.user),
        body: "Kimdir sizning postingizga sharh qoldirdi",
      });
      await User.findOneAndUpdate(
        { _id: String(post.user) },
        { $set: { hasNewNotifications: true } },
      );
    }
    return NextResponse.json(comment);
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    let { commentId } = await req.json();
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
    let comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Sharh topilmadi" }, { status: 404 });
    }
    const alreadyLiked = comment.likes?.some(
      (id: any) => id.toString() === currentUser._id.toString(),
    );
    if (!alreadyLiked) {
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: currentUser._id },
      });
      if (
        comment.user &&
        comment.user.toString() !== currentUser._id.toString()
      ) {
        await Notification.create({
          user: String(comment.user),
          body: "Kimdir sizning sharhingizni yoqtirdi",
        });
        await User.findOneAndUpdate(
          { _id: String(comment.user) },
          { $set: { hasNewNotifications: true } },
        );
      }
    }
    return NextResponse.json({ message: "Comment liked" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    let { commentId } = await req.json();
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: currentUser._id },
    });
    return NextResponse.json({ message: "Comment unliked" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
