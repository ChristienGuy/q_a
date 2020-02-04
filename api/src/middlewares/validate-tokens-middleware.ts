import { validateRefreshToken } from "../util/validate-tokens";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import { getTokens } from "../util/get-tokens";
import { getCookies } from "../util/get-auth-cookies";

type Token = {
  user: {
    id: number;
  };
};

export async function validateTokensMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies[config.cookieNames.access];
  const refreshToken = req.cookies[config.cookieNames.refresh];

  const decodedRefreshToken = <Token>validateRefreshToken(refreshToken);

  if (decodedRefreshToken && decodedRefreshToken.user) {
    const user = await getRepository(User).findOne(decodedRefreshToken.user.id);
    if (!user) {
      res.clearCookie(config.cookieNames.access);
      res.clearCookie(config.cookieNames.refresh);
      return next();
    }

    const userTokens = getTokens(user);

    req.user = user;

    const { access, refresh } = getCookies(userTokens);
    res.cookie(...access);
    res.cookie(...refresh);
    return next();
  }

  next();
}
