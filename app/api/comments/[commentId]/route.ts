import Comment from "@/database/commentModel";
import Post from "@/database/postModel";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  route: { params: Promise<{ commentId: string }> | { commentId: string } },
) {
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
    const params = await Promise.resolve(route.params);
    const { commentId } = params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Sharh topilmadi" }, { status: 404 });
    }
    if (comment.user.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Bu sharhni o'chirish huquqiga ega emassiz" },
        { status: 403 },
      );
    }
    await Comment.findByIdAndDelete(commentId);
    if (comment.post) {
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId },
      });
    }
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
