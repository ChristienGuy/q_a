import { Resolver, Query, Arg, Int, Mutation, Ctx } from "type-graphql";
import { Answer } from "../entity/Answer";
import { Repository, getRepository } from "typeorm";
import { AnswerInput } from "./types/AnswerInput";
import { Context } from "./types/Context";

@Resolver(Answer)
export class AnswerResolver {
  private readonly answerRepository: Repository<Answer>;
  constructor() {
    this.answerRepository = getRepository(Answer);
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
    @Arg("answer") answerInput: AnswerInput,
    @Ctx() { user }: Context
  ) {
    const answer = this.answerRepository.create({
      ...answerInput,
      user
    });

    return this.answerRepository.save(answer);
  }
}
