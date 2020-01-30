import { Resolver, Query, Arg, Int, Mutation, Ctx } from "type-graphql";
import { Answer } from "../entity/Answer";
import { Repository, getRepository } from "typeorm";
import { AnswerInput } from "./types/AnswerInput";
import { Context } from "./types/Context";
import { Question } from "../entity/Question";

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

  @Query(returns => [Answer])
  async answers(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  @Mutation(returns => Answer)
  async addAnswer(
    @Arg("answer") { questionId, body }: AnswerInput,
    @Ctx() { user }: Context
  ): Promise<Answer> {
    const question: Question = await this.questionRepository.findOne(
      questionId
    );

    const answer = this.answerRepository.create({
      body,
      question,
      user
    });
    return this.answerRepository.save(answer);
  }
}
