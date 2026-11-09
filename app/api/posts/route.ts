import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Post from "@/database/postModel";
import User from "@/database/userModel";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";
import { serializePost } from "@/lib/serializePost";
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
    const { body, image } = await req.json();
    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: "Post matni bo'sh bo'lishi mumkin emas" },
        { status: 400 },
      );
    }
    let post = await Post.create({
      body: body.trim(),
      image: typeof image === "string" ? image : null,
      user: currentUser._id,
    });
    post = await post.populate({
      path: "user",
      model: User,
      select: "name email profileImage _id username",
    });
    return NextResponse.json(serializePost(post, currentUser._id));
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    let { searchParams } = new URL(req.url);
    let limitParam = searchParams.get("limit");
    let pageParam = searchParams.get("page");
    let limit = limitParam
      ? Math.min(Math.max(Number(limitParam), 1), 100)
      : 10;
    let page = pageParam ? Math.max(Number(pageParam), 1) : 1;
    let skip = (page - 1) * limit;

    const userDoc = currentUser?._id
      ? await User.findById(currentUser._id).select("bookmarks")
      : null;
    const userBookmarks = userDoc?.bookmarks || [];

    let posts = await Post.find({})
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    let filteredPosts = posts.map((p) =>
      serializePost(p, currentUser?._id, userBookmarks),
    );
    return NextResponse.json(filteredPosts);
  } catch (error) {
    const result = error as Error;
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
    const { postId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 });
    }
    if (post.user.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Bu postni o'chirish huquqingiz yo'q" },
        { status: 403 },
      );
    }
    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: "Post muvaffaqiyatli o'chirildi" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
