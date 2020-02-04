import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  FieldResolver,
  Root,
  ObjectType,
  Field
} from "type-graphql";
import { Question } from "../entity/Question";
import { Repository, getRepository } from "typeorm";
import { QuestionInput } from "./types/QuestionInput";
import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";

@ObjectType()
class QuestionsResponse {
  @Field(type => [Question])
  items: Question[];

  @Field(type => Int)
  totalCount: number;
}

@Resolver(Question)
export class QuestionResolver {
  private readonly questionRepository: Repository<Question>;
  constructor() {
    this.questionRepository = getRepository(Question);
  }

  @FieldResolver(type => Int)
  async count(@Root() question: Question) {
    return this.questionRepository.count();
  }

  @Query(returns => Question, { nullable: true })
  async question(
    @Arg("questionId", type => Int) questionId: number
  ): Promise<Question> {
    return this.questionRepository.findOne(questionId);
  }

  @Query(returns => QuestionsResponse)
  async questions(
    @Arg("page", { nullable: true }) page: number,
    @Arg("perPage", { nullable: true, defaultValue: 10 }) perPage: number
  ): Promise<QuestionsResponse> {
    const [items, totalCount] = await this.questionRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage
    });

    return {
      items,
      totalCount
    };
  }

  @Mutation(returns => Question)
  async addQuestion(
    @Arg("question") questionInput: QuestionInput,
    @Ctx() { req }: { req: Request }
  ): Promise<Question> {
    if (!req.user) {
      throw new AuthenticationError("no account");
    }
    const answer = this.questionRepository.create({
      ...questionInput,
      user: req.user
    });
    return this.questionRepository.save(answer);
  }
}
