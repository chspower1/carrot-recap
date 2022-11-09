import { getIronSession } from "iron-session/edge";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!,
  });
  if (!session.user && !req.url.includes("/enter")) {
    return NextResponse.redirect(new URL("/enter", req.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
