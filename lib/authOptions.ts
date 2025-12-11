import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/userModel";
export const authOption: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({
          email: credentials?.email,
        });

        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GIT_HUB_CLIENT_ID!,
      clientSecret: process.env.GIT_HUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDatabase();
      let user = await User.findOne({ email: session.user?.email });
      if (!user) {
        user = await User.create({
          email: session.user?.email,
          name: session.user?.name,
          profileImage: session.user?.image,
        });
      }
      session.currentUser = user;
      return session;
    },
  },
  // debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET!,
};
