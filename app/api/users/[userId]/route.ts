import User from "@/database/userModel";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
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
        { error: "Boshqa foydalanuvchi profilini tahrirlash taqiqlanadi" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "updateImage") {
      const allowedUpdates: { profileImage?: string; coverImage?: string } = {};
      if (typeof body.profileImage === "string")
        allowedUpdates.profileImage = body.profileImage;
      if (typeof body.coverImage === "string")
        allowedUpdates.coverImage = body.coverImage;

      await User.findByIdAndUpdate(userId, allowedUpdates, { new: true });
      revalidatePath(`/profile/${userId}`);
      return NextResponse.json({ message: "Rasm muvaffaqiyatli yangilandi" });
    } else if (type === "updateFields") {
      const existUser = await User.findById(userId);
      if (!existUser) {
        return NextResponse.json(
          { error: "Foydalanuvchi topilmadi" },
          { status: 404 },
        );
      }
      const newUsername = body.username
        ? String(body.username).trim()
        : existUser.username;
      if (newUsername !== existUser.username) {
        const usernameExist = await User.exists({ username: newUsername });
        if (usernameExist) {
          return NextResponse.json(
            { error: "Bu username allaqachon band" },
            { status: 400 },
          );
        }
      }
      const allowedUpdates = {
        name: body.name ? String(body.name).trim() : existUser.name,
        username: newUsername,
        bio: typeof body.bio === "string" ? body.bio.trim() : existUser.bio,
        location:
          typeof body.location === "string"
            ? body.location.trim()
            : existUser.location,
      };

      await User.findByIdAndUpdate(userId, allowedUpdates, { new: true });
      revalidatePath(`/profile/${userId}`);
      return NextResponse.json({
        message: "Ma'lumotlar muvaffaqiyatli yangilandi",
      });
    }
    return NextResponse.json(
      { error: "Noma'lum update turi" },
      { status: 400 },
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
