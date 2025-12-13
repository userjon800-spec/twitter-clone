"use server";
import User from "@/database/userModel";
import { connectToDatabase } from "../mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "../authOptions";
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    let user = await User.findById(userId);
    const { currentUser }: any = await getServerSession(authOption);
    const filteredUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
      username: user.username,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      isFollowing: user.followers?.includes(currentUser._id) || false,
    };
    return filteredUser
  } catch (error) {
    throw error;
  }
}
