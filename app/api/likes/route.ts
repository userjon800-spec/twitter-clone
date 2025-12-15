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
    let { postId, userId } = await req.json();
    let post = await Post.findById(postId);
    await Notification.create({
      user: String(post.user),
      body: "Kimdir sizning postingizni yoqtirdi",
    });
    await User.findOneAndUpdate(
      { _id: String(post.user) },
      { $set: { hasNewNotifications: true } }
    );
    if (!post)
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    await post.populate("user");
    const { currentUser }: any = await getServerSession(authOption);
    return NextResponse.json(serializePost(post, currentUser?._id));
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    let { postId, userId } = await req.json();
    // let post = await Post.findByIdAndUpdate(
    //   postId,
    //   {
    //     $pull: { likes: userId },
    //   },
    //   { new: true }
    // );
    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    post.likes = post.likes.filter(
      (id: any) => id.toString() !== userId.toString()
    );
    await post.save();
    await post.populate("user");
    const { currentUser }: any = await getServerSession(authOption);
    return NextResponse.json(serializePost(post, currentUser?._id));
  } catch (error) {
    let result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
