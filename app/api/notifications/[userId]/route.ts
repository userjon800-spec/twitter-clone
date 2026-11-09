import Notification from "@/database/notificationModel";
import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
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
    const { userId } = await params;
    if (currentUser._id.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          error:
            "Boshqa foydalanuvchining bildirishnomalarini ko'rish taqiqlanadi",
        },
        { status: 403 },
      );
    }
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
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 },
      );
    }
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
  { params }: { params: Promise<{ userId: string }> },
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
    const { userId } = await params;
    if (currentUser._id.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          error:
            "Boshqa foydalanuvchining bildirishnomalarini o'chirish taqiqlanadi",
        },
        { status: 403 },
      );
    }
    await Notification.deleteMany({ user: userId });
    await User.findByIdAndUpdate(
      userId,
      { $set: { hasNewNotifications: false } },
      { new: true },
    );
    return NextResponse.json({ message: "Notifications o'chirildi" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
