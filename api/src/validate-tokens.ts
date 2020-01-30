import { verify } from "jsonwebtoken";
import config from "./config/config";

export function validateAccessToken(token) {
  try {
    return verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

export function validateRefreshToken(token) {
  try {
    return verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}
