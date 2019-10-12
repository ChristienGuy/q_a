import { EntityRepository, Repository } from "typeorm";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import config from "../config/config";

const { jwtSecret } = config;

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByToken(token: string) {
    let jwtPayload;

    try {
      jwtPayload = jwt.verify(token, jwtSecret);
    } catch (error) {
      throw new Error("not a valid token");
    }
    const { userId } = jwtPayload;

    return this.findOne(userId, {
      select: ["id", "email", "username"]
    });
  }
}
