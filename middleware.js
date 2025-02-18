import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(req) {
  const accessToken = cookies().get("token");
  const currentPath = req.nextUrl.pathname;
  if ( currentPath.includes("/dashboard") &&  !accessToken) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  const languageCookie =
    cookies().get("language") 
  const language = languageCookie ? languageCookie.value : null;
  if (language) {
    const currentUrl = req.nextUrl.pathname;

    const currentLanguageInUrl = currentUrl.split("/")[1];

    if (currentLanguageInUrl !== language) {
      const newUrl = currentUrl.replace(/^\/[^/]+/, `/${language}`);
      return NextResponse.redirect(new URL(newUrl, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:lang/dashboard/:path*"],
};
