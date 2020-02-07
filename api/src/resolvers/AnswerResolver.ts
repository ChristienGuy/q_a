import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  ObjectType,
  Field,
  Authorized
} from "type-graphql";
import { Answer } from "../entity/Answer";
import { Repository, getRepository } from "typeorm";
import { AnswerInput } from "./types/AnswerInput";
import { Question } from "../entity/Question";
import { Context } from "../context.interface";

@ObjectType()
class AnswersResponse {
  @Field(type => [Answer])
  items: Answer[];

  @Field(type => Int)
  totalCount: number;
}

@Resolver(Answer)
export class AnswerResolver {
  private readonly answerRepository: Repository<Answer>;
  private readonly questionRepository: Repository<Question>;
  constructor() {
    this.answerRepository = getRepository(Answer);
    this.questionRepository = getRepository(Question);
  }

  @Query(returns => Answer, { nullable: true })
  async answer(
    @Arg("answerId", type => Int) answerId: number
  ): Promise<Answer> {
    return this.answerRepository.findOne(answerId);
  }

  @Query(returns => AnswersResponse)
  async answers(
    @Arg("page", { nullable: true }) page: number,
    @Arg("perPage", { nullable: true }) perPage: number
  ): Promise<AnswersResponse> {
    const [items, totalCount] = await this.answerRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage
    });

    return {
      items,
      totalCount
    };
  }

  @Authorized()
  @Mutation(returns => Answer)
  async addAnswer(
    @Arg("answer") { questionId, body }: AnswerInput,
    @Ctx() { req }: Context
  ): Promise<Answer> {
    const question: Question = await this.questionRepository.findOne(
      questionId
    );

    const answer = this.answerRepository.create({
      body,
      question,
      user: req.user
    });
    return this.answerRepository.save(answer);
  }
}
