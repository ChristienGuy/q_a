import { Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport-jwt";
import { getRepository, Repository } from "typeorm";
import { validate } from "class-validator";
import {
  Post,
  Res,
  BadRequestError,
  UnauthorizedError,
  BodyParam,
  JsonController,
  OnUndefined
} from "routing-controllers";

import { User } from "../entity/User";
import config from "../config/config";

// TODO: move shared auth logic into service
@JsonController("/auth")
class AuthController {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  @OnUndefined(203)
  @Post("/login")
  async login(
    @BodyParam("email") email: string,
    @BodyParam("password") password: string,
    @Res() res: Response
  ) {
    if (!(email && password)) {
      // Throw 400 bad request
      throw new BadRequestError("Bad request");
    }
    let user: User;

    try {
      user = await this.userRepository.findOneOrFail({
        where: { email },
        select: ["id", "email", "password"]
      });
    } catch (error) {
      // unauthorized so throw 401
      throw new UnauthorizedError("no matching user");
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      // unauthorized so throw 401
      throw new UnauthorizedError("invalid password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true });
    return;
  }

  @Post("/change-password")
  async changePassword(
    @BodyParam("oldPassword") oldPassword: string,
    @BodyParam("newPassword") newPassword: string,
    @Res() res: Response
  ) {
    const id = res.locals.jwtPayload.userId;

    if (!(oldPassword && newPassword)) {
      // Throw 400 bad request
      throw new BadRequestError("Bad request");
    }

    let user: User;

    try {
      user = await this.userRepository.findOneOrFail(id);
    } catch (id) {
      throw new UnauthorizedError();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      throw new UnauthorizedError();
    }

    user.password = newPassword;
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new BadRequestError();
    }

    user.hashPassword();
    this.userRepository.save(user);

    return 204;
  }
}

export default AuthController;
