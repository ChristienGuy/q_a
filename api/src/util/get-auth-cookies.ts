import { CookieOptions } from "express";
import config from "../config/config";

export function getCookies({
  accessToken,
  refreshToken
}: {
  accessToken: string;
  refreshToken: string;
}): {
  access: [string, string, CookieOptions];
  refresh: [string, string, CookieOptions];
} {
  const cookieOptions: CookieOptions = {
    httpOnly: true
  };

  return {
    access: [config.cookieNames.access, accessToken, cookieOptions],
    refresh: [config.cookieNames.refresh, refreshToken, cookieOptions]
  };
}
