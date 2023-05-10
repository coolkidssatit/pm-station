import { internal_createCSRFToken } from "./internal/csrf-token";
import { internal_defaultCookies } from "./internal/cookie";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { parse } from "cookie";

const csrfCookie = (secure: boolean) =>
  internal_defaultCookies(secure).csrfToken;

/**
 * Create a CSRF Token for the current session
 */

export const createCSRFToken = async (
  cookies: RequestCookies,
  secure: boolean
) => {
  const cookie = csrfCookie(secure);
  const csrfToken = await internal_createCSRFToken({
    isPost: false,
    options: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    cookieValue: cookies.get(cookie.name)?.value,
  });
  return {
    name: cookie.name,
    value: csrfToken.cookie,
    options: cookie.options,
  };
};

/**
 * Gets the CSRF Token for the current session. Doesn't perform any validation.
 */

export const getCSRFToken = (headers: ReadonlyHeaders) => {
  const secure = headers.get("x-forwarded-proto") === "https";
  // Using the Next.js `cookies` function doesn't return the latest update from the middleware.
  const cookies = parse(
    headers.get("cookie") ?? headers.get("set-cookie") ?? ""
  );
  const cookie = csrfCookie(secure);
  const [csrfToken] = cookies[cookie.name]?.split("|") ?? [];
  if (csrfToken) {
    return csrfToken;
  }
  throw new Error(
    "CSRF Token not found. Check if the middleware is functioning."
  );
};
