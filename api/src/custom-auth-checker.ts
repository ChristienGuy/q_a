import { AuthChecker } from "type-graphql";
import { Context } from "./context.interface";

export const authChecker: AuthChecker<Context> = (
  { context: { req } },
  roles
) => {
  if (!req.user) {
    return false;
  }
  console.log("ROLES", roles);

  if (!roles.includes(req.user.role)) {
    return false;
  }

  return true;
};