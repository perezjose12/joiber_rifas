import { auth } from "@/lib/auth";

export default auth((req) => {
  const url = req.nextUrl

  if (url.pathname.startsWith("/admin") && !req.auth?.user) {
    url.pathname = "/login"
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ["/admin/:path*"],
}