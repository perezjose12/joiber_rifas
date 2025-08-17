import NextAuth, { DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Configuración de NextAuth
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 6 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }: { user: DefaultUser }) {
      const emails = process.env.ALLOWED_EMAILS!.split(",");
      return emails.includes(user.email!);
    },
  },
};

// Handler para App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };