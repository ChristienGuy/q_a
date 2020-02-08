import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  Authorized,
  Args
} from "type-graphql";
import { Answer } from "../entity/Answer";
import { Repository, getRepository } from "typeorm";
import { AnswerInput } from "./types/AnswerInput";
import { Question } from "../entity/Question";
import { Context } from "../context.interface";
import { AnswersResponse } from "./types/PaginatedResponse";
import { PaginationArgs } from "./types/PaginationArgs";
import { AnswersService } from "../services/AnswersService";

@Resolver(Answer)
export class AnswerResolver {
  private readonly answerRepository: Repository<Answer>;
  private readonly questionRepository: Repository<Question>;
  private readonly answersService: AnswersService;
  constructor() {
    this.answerRepository = getRepository(Answer);
    this.questionRepository = getRepository(Question);
    this.answersService = new AnswersService();
  }

  @Query(returns => Answer, { nullable: true })
  async answer(
    @Arg("answerId", type => Int) answerId: number
  ): Promise<Answer> {
    return this.answerRepository.findOne(answerId);
  }

  @Query(returns => AnswersResponse)
  async answers(@Args() args: PaginationArgs): Promise<AnswersResponse> {
    return this.answersService.getAnswers(args);
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
