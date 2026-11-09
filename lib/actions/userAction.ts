"use server";
import User from "@/database/userModel";
import { connectToDatabase } from "../mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "../authOptions";
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    let user = await User.findById(userId);
    if (!user) return null;
    const session: any = await getServerSession(authOption);
    const currentUser = session?.currentUser;
    const isFollowing = currentUser?._id
      ? user.followers?.some(
          (f: any) => f.toString() === currentUser._id.toString(),
        )
      : false;
    const filteredUser = {
      _id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      coverImage: user.coverImage || "",
      profileImage: user.profileImage || "",
      username: user.username || "",
      bio: user.bio || "",
      location: user.location || "",
      createdAt: user.createdAt,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      isFollowing: Boolean(isFollowing),
    };
    return filteredUser;
  } catch (error) {
    throw error;
  }
}
