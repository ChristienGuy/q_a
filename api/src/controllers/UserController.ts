import { getRepository, Repository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import {
  Get,
  OnUndefined,
  JsonController,
  Delete,
  NotFoundError,
  Param,
  Post,
  BodyParam,
  BadRequestError,
  HttpCode,
  Patch,
  Authorized,
  CurrentUser,
  UnauthorizedError,
  HttpError
} from "routing-controllers";
import { roles } from "../config/roles";

@JsonController("/user")
class UserController {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  @Authorized([roles.ADMIN])
  @Get("/")
  async listAll() {
    return this.userRepository.find({
      select: ["id", "username", "email", "role"] //We dont want to send the passwords on response
    });
  }

  @Authorized([roles.ADMIN])
  @Get("/:id([0-9]+)")
  async getOneById(
    @Param("id") id: number,
    @CurrentUser({ required: true }) user: User
  ) {
    return this.userRepository.findOne(id, {
      select: ["id", "email", "username", "role"]
    });
  }

  @HttpCode(201)
  @Post("/")
  async saveUser(
    @BodyParam("email", { required: true }) email: string,
    @BodyParam("password", { required: true }) password: string,
    @BodyParam("username", { required: true }) username: string
  ) {
    let user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.role = "user";

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestError("invalid data");
    }

    user.hashPassword();
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new HttpError(409);
    }

    //If all ok, send 201 response
    return {
      email,
      username
    };
  }

  @OnUndefined(204)
  @Patch("/:id([0-9]+)")
  async editUser(
    @CurrentUser() user: User,
    @Param("id") id: number,
    @BodyParam("username") username: string
  ) {
    // TODO: convert this 'authorization' into custom decorator (interceptor?)
    // admin roles can edit anything, users can only edit themselves
    if (user.id !== id && user.role !== roles.ADMIN) {
      throw new UnauthorizedError();
    }
    //Try to find user on database
    const userRepository = getRepository(User);
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      throw new NotFoundError();
    }

    //Validate the new values on model
    user.username = username;
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestError();
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      // TODO: replace with http 409 conflict
      throw new BadRequestError();
      // res.status(409).send("username already in use");
    }

    return undefined;
  }

  @OnUndefined(204)
  @Delete("/:id([0-9]+)")
  async deleteUser(@Param("id") id: number, @CurrentUser() user: User) {
    // admin roles can delete anything, users can only delete themselves
    if (user.id !== id && user.role !== roles.ADMIN) {
      throw new UnauthorizedError();
    }

    try {
      await this.userRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError();
    }
    await this.userRepository.delete(id);
    return undefined;
  }
}

export default UserController;
