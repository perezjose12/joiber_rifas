import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DefaultUser } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 horas
  },
  callbacks: {
    async signIn({ user }: { user: DefaultUser }) {
      const emails = process.env.ALLOWED_EMAILS!.split(",");
      return emails.includes(user.email!);
    },
  },
};