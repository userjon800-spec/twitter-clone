import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Post from "@/database/postModel";
import User from "@/database/userModel";
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    let { body, userId } = await req.json();
    let post = await Post.create({ body, user: userId });
    post = await post.populate({
      path: "user",
      model: User,
      select: "name email profileImage _id username",
    });
    return NextResponse.json(post);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    let { searchParams } = new URL(req.url);
    let limit = searchParams.get("limit");
    let posts = await Post.find({})
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { postId } = await req.json();
    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: "Post muaffaqiyatli" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
