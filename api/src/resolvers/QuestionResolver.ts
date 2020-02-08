import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  FieldResolver,
  Root,
  Authorized,
  Args
} from "type-graphql";
import { Question } from "../entity/Question";
import { Repository, getRepository } from "typeorm";
import { QuestionInput } from "./types/QuestionInput";
import { AuthenticationError } from "apollo-server-express";
import { QuestionsResponse, AnswersResponse } from "./types/PaginatedResponse";
import { QuestionsService } from "../services/QuestionsService";
import { PaginationArgs } from "./types/PaginationArgs";
import { AnswersService } from "../services/AnswersService";
import { Context } from "../context.interface";

@Resolver(Question)
export class QuestionResolver {
  private readonly questionRepository: Repository<Question>;
  private readonly questionsService: QuestionsService;
  private readonly answersService: AnswersService;

  constructor() {
    this.questionRepository = getRepository(Question);
    this.questionsService = new QuestionsService();
    this.answersService = new AnswersService();
  }

  @Query(returns => Question, { nullable: true })
  async question(
    @Arg("questionId", type => Int) questionId: number
  ): Promise<Question> {
    return this.questionRepository.findOne(questionId);
  }

  @Query(returns => QuestionsResponse)
  async questions(@Args() args: PaginationArgs): Promise<QuestionsResponse> {
    return this.questionsService.getQuestions(args);
  }

  @FieldResolver(returns => AnswersResponse)
  async answers(
    @Root() question: Question,
    @Args() args: PaginationArgs
  ): Promise<AnswersResponse> {
    return this.answersService.getAnswersByQuestionId({
      ...args,
      questionId: question.id
    });
  }

  @Authorized()
  @Mutation(returns => Question)
  async addQuestion(
    @Arg("question") questionInput: QuestionInput,
    @Ctx() { req }: Context
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
