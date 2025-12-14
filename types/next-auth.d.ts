import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    currentUser: {
      username: ReactNode;
      _id: string;
      email: string;
      name: string;
      profileImage: string;
    } | null;
  }
}