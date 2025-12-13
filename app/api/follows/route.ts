// import Notification from '@/database/notification.model'
import User from "@/database/userModel";
import { authOption } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    let { currentUser }: any = await getServerSession(authOption);
    let { userId,currentUserId } = await req.json();
    await User.findByIdAndUpdate(userId, {
      $push: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: userId },
    });
    return NextResponse.json({ message: "Followed" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    let { currentUser }: any = await getServerSession(authOption);
    let { userId,currentUserId } = await req.json();
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId },
    });
    return NextResponse.json({ message: "Followed" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    await connectToDatabase();
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
