import { getTokens } from "./get-tokens";
import { getCookies } from "./get-auth-cookies";
import { Context } from "../context.interface";

export const setAuthCookies = ({ res }: Context, user) => {
  const tokens = getTokens(user);
  const { access, refresh } = getCookies(tokens);

  res.cookie(...refresh);
  res.cookie(...access);
};
