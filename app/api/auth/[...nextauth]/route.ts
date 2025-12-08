import { authOption } from "@/lib/authOptions";
import NextAuth from "next-auth";
let handler = NextAuth(authOption);
export { handler as GET, handler as POST };