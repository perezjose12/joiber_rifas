import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    async signIn({ user }) {
      const allowed = process.env.ALLOWED_EMAILS!.split(",")
      return allowed.includes(user.email!)
    },

    authorized({ auth, request }) {
      // si quieres proteger rutas
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return !!auth?.user
      }
      return true
    },
  },
});
