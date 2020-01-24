import { Response } from "express";
import * as jwt from "jsonwebtoken";
import { Repository, getCustomRepository } from "typeorm";
import { validate } from "class-validator";
import {
  Post,
  Res,
  BadRequestError,
  UnauthorizedError,
  BodyParam,
  JsonController,
  OnUndefined,
  CookieParam,
  Get
} from "routing-controllers";

import { UserRepository } from "../repository/UserRepository";
import { User } from "../entity/User";
import config from "../config/config";

// TODO: move shared auth logic into service
@JsonController("/auth")
class AuthController {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  @Get("/refresh")
  async refresh(@CookieParam("jwt", { type: "string" }) jwt) {
    // TODO: return error when unauthorised
    let user;
    try {
      user = await this.userRepository.findByToken(jwt);
    } catch (error) {
      throw new UnauthorizedError("invalid token");
    }

    return user;
  }

  @OnUndefined(200)
  @Get("/logout")
  async logout(@Res() res: Response) {
    res.cookie("jwt", null);
    return;
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
        select: ["id", "email", "password", "username"]
      });
    } catch (error) {
      // unauthorized so throw 401
      throw new BadRequestError("could not find user");
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      // unauthorized so throw 401
      throw new BadRequestError("cound not find user");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true });
    console.log(user);

    return {
      email: user.email,
      username: user.username,
      id: user.id
    };
  }

  // TODO: logout to clear cookie

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
