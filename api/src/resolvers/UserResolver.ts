import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { Repository, getRepository } from "typeorm";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Response, Request } from "express";
import { getTokens } from "../util/get-tokens";
import { getCookies } from "../util/get-auth-cookies";
import config from "../config/config";
import { validate } from "class-validator";

@Resolver(User)
export class UserResolver {
  private readonly userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Mutation(type => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: { res: Response; req: Request }
  ) {
    // TODO: catch failure
    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({
        where: { email }
      });
    } catch {
      throw new AuthenticationError("no use with those details");
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new AuthenticationError("incorrect");
    }

    const tokens = getTokens(user);
    const { access, refresh } = getCookies(tokens);
    res.cookie(...refresh);
    res.cookie(...access);

    return user;
  }

  @Mutation(returns => Boolean)
  async logout(@Ctx() { res }: { res: Response }): Promise<boolean> {
    res.clearCookie(config.cookieNames.access);
    res.clearCookie(config.cookieNames.refresh);
    return true;
  }

  @Mutation(returns => User)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string
  ): Promise<User> {
    let user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.role = "user";

    const errors = await validate(User);
    if (errors.length > 0) {
      throw new UserInputError("invalid data");
    }

    user.hashPassword();

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new UserInputError("invalid");
    }

    return user;
  }

  // TODO: change password mutation
}
