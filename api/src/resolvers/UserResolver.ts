import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { Repository, getRepository } from "typeorm";
import { AuthenticationError } from "apollo-server-express";
import { Response, Request } from "express";
import { getTokens } from "../get-tokens";
import { getCookies } from "../get-auth-cookies";
import config from "../config/config";

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
    const user: User = await this.userRepository.findOneOrFail({
      where: { email }
    });

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new AuthenticationError("incorrect");
    }

    // TODO: set token cookies
    const tokens = getTokens(user);
    const { access, refresh } = getCookies(tokens);
    res.cookie(...refresh);
    res.cookie(...access);

    return user;
  }

  @Mutation(returns => Boolean)
  async logout(@Ctx() { res }: { res: Response }): Promise<boolean> {
    console.log("hello");

    res.clearCookie(config.cookieNames.access);
    res.clearCookie(config.cookieNames.refresh);
    return true;
  }
}
