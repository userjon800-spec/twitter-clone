import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/userModel";
import { compare } from "bcrypt";

export const authOption: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email va parol kiritilishi shart");
        }
        await connectToDatabase();
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        });
        if (!user || !user.password) {
          throw new Error(
            "Bunday foydalanuvchi topilmadi yoki parol o'rnatilmagan",
          );
        }
        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Parol noto'g'ri");
        }
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
      if (!session.user?.email) return session;
      await connectToDatabase();
      let user = await User.findOne({
        email: session.user.email.toLowerCase().trim(),
      });
      if (!user) {
        const defaultUsername =
          session.user.email.split("@")[0] +
          "_" +
          Math.floor(Math.random() * 1000);
        user = await User.create({
          email: session.user.email.toLowerCase().trim(),
          name: session.user.name || "User",
          username: defaultUsername,
          profileImage: session.user.image,
        });
      }
      session.currentUser = user;
      return session;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET!,
};
