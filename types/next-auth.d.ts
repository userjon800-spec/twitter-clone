import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    currentUser: {
      _id: string;
      email: string;
      name: string;
      profileImage: string;
    } | null;
  }
}