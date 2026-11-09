import Post from "@/database/postModel";
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { serializePost } from "@/lib/serializePost";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const user = await User.findById(currentUser._id);
    if (!user || !user.bookmarks || user.bookmarks.length === 0) {
      return NextResponse.json([]);
    }

    const posts = await Post.find({ _id: { $in: user.bookmarks } })
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .sort({ createdAt: -1 });

    const serializedPosts = posts.map((p) =>
      serializePost(p, currentUser._id, user.bookmarks),
    );

    return NextResponse.json(serializedPosts);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

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

    const user = await User.findById(currentUser._id);
    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 },
      );
    }

    const isBookmarked = (user.bookmarks || []).some(
      (id: any) => id.toString() === postId.toString(),
    );

    if (isBookmarked) {
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { bookmarks: postId },
      });
      return NextResponse.json({
        hasBookmarked: false,
        message: "Xatcho'plardan olib tashlandi",
      });
    } else {
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { bookmarks: postId },
      });
      return NextResponse.json({
        hasBookmarked: true,
        message: "Xatcho'plarga saqlandi",
      });
    }
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
