import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const url = req.nextUrl.clone()
  if (url.pathname.startsWith("/admin") && !token) {
    // Redirige al login si no hay sesión
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}