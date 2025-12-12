import Comment from "@/database/commentModel";
import Post from "@/database/postModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    let { body, postId, userId } = await req.json();
    let comment = await Comment.create({ body, post: postId, user: userId });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
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
    let { currentUser }: any = await getServerSession(authOption);
    await Comment.findByIdAndUpdate(commentId, {
      $push: { likes: currentUser._id },
    });
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
    let { currentUser }: any = await getServerSession(authOption);
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: currentUser._id },
    });
    return NextResponse.json({ message: "Comment liked" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
