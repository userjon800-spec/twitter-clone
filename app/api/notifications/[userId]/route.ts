import Notification from "@/database/notificationModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const { userId } = route.params;
    let notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    await User.findByIdAndUpdate(userId, {
      $set: { hasNewNotifications: false },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const notification = await Notification.create({
      body: body.body,
      user: body.userId,
    });
    return NextResponse.json(notification);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
export async function DELETE(
  req: Request,
  route: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = route.params;
    await Notification.deleteMany({ user: userId });
    await User.findByIdAndUpdate(
      userId,
      { $set: { hasNewNotifications: false } },
      { new: true }
    );
    return NextResponse.json({message: "Notifications o'chirildi"});
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
