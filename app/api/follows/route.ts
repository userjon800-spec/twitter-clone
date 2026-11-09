import Notification from "@/database/notificationModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { serializeUser } from "../users/serializeUser";

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
    let { userId } = await req.json();
    const currentUserId = currentUser._id;
    if (userId.toString() === currentUserId.toString()) {
      return NextResponse.json(
        { error: "O'zingizga obuna bo'la olmaysiz" },
        { status: 400 },
      );
    }
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userId },
    });
    await Notification.create({
      user: userId,
      body: "Kimdir sizga obuna bo'ldi",
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { hasNewNotifications: true } },
    );
    return NextResponse.json({ message: "Followed" });
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
    let { userId } = await req.json();
    const currentUserId = currentUser._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId },
    });
    return NextResponse.json({ message: "Unfollowed" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    let { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId");
    let state = searchParams.get("state");
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json([]);
    }
    if (state === "following") {
      let following = await User.find({ _id: { $in: user.following || [] } });
      return NextResponse.json(following.map(serializeUser));
    } else if (state === "followers") {
      let followers = await User.find({ _id: { $in: user.followers || [] } });
      return NextResponse.json(followers.map(serializeUser));
    }
    return NextResponse.json([]);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
