import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Args,
  Root
} from "type-graphql";
import { User } from "../entity/User";
import { Repository, getRepository } from "typeorm";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import config from "../config/config";
import { validate } from "class-validator";
import { USER_ROLES } from "../constants";
import { Context } from "../context.interface";
import { setAuthCookies } from "../util/set-auth-cookies";
import { AnswersResponse, QuestionsResponse } from "./types/PaginatedResponse";
import { PaginationArgs } from "./types/PaginationArgs";
import { AnswersService } from "../services/AnswersService";
import { QuestionsService } from "../services/QuestionsService";

@Resolver(User)
export class UserResolver {
  private readonly userRepository: Repository<User>;
  private readonly answersService: AnswersService;
  private readonly questionsService: QuestionsService;
  constructor() {
    this.userRepository = getRepository(User);
    this.questionsService = new QuestionsService();
    this.answersService = new AnswersService();
  }

  @FieldResolver(returns => AnswersResponse)
  async answers(
    @Root() user: User,
    @Args() args: PaginationArgs
  ): Promise<AnswersResponse> {
    return this.answersService.getAnswersByUserId({
      ...args,
      userId: user.id
    });
  }

  @FieldResolver(returns => QuestionsResponse)
  async questions(
    @Root() user: User,
    @Args() args: PaginationArgs
  ): Promise<QuestionsResponse> {
    return this.questionsService.getQuestionsByUserId({
      ...args,
      userId: user.id
    });
  }

  @Authorized([USER_ROLES.ADMIN])
  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Authorized([USER_ROLES.ADMIN])
  @Query(returns => User)
  async user(@Arg("userId") userId: number): Promise<User> {
    return this.userRepository.findOne(userId);
  }

  @Mutation(type => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: Context
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

    setAuthCookies(context, user);

    return user;
  }

  @Mutation(returns => Boolean)
  async logout(@Ctx() { res }): Promise<boolean> {
    res.clearCookie(config.cookieNames.access);
    res.clearCookie(config.cookieNames.refresh);
    return true;
  }

  @Mutation(returns => User)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string,
    @Ctx() context: Context
  ): Promise<User> {
    let user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.role = USER_ROLES.USER;

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

    setAuthCookies(context, user);
    return user;
  }
}
