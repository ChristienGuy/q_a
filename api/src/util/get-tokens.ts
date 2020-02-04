import { sign } from "jsonwebtoken";
import config from "../config/config";

export function getTokens(user) {
  const sevenDays = 60 * 60 * 24 * 7 * 1000;
  const fifteenMins = 60 * 15 * 1000;

  const accessUser = {
    id: user.id
  };

  const accessToken = sign({ user: accessUser }, config.jwtSecret, {
    expiresIn: fifteenMins
  });

  const refreshUser = {
    id: user.id
  };

  const refreshToken = sign({ user: refreshUser }, config.jwtSecret, {
    expiresIn: sevenDays
  });

  return {
    accessToken,
    refreshToken
  };
}
