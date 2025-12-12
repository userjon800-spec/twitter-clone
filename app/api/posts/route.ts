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
     let { currentUser }: any = await getServerSession(authOption);
    let { body, userId } = await req.json();
    let post = await Post.create({ body, user: userId });
    post = await post.populate({
      path: "user",
      model: User,
      select: "name email profileImage _id username",
    });
    return NextResponse.json(serializePost(post, currentUser?._id));
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    let { currentUser }: any = await getServerSession(authOption);
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
    let filteredPosts = posts.map((p) => serializePost(p, currentUser?._id));
    return NextResponse.json(filteredPosts);
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
