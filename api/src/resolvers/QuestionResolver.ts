import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  FieldResolver,
  Root
} from "type-graphql";
import { Question } from "../entity/Question";
import { Repository, getRepository } from "typeorm";
import { QuestionInput } from "./types/QuestionInput";
import { Context } from "vm";

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

  @Query(returns => [Question])
  async questions(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  @Mutation(returns => Question)
  async addQuestion(
    @Arg("question") questionInput: QuestionInput,
    @Ctx() { user }: Context
  ): Promise<Question> {
    const answer = this.questionRepository.create({
      ...questionInput,
      user
    });
    return this.questionRepository.save(answer);
  }
}
