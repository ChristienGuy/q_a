import { Repository, getRepository } from "typeorm";
import {
  NotFoundError,
  BadRequestError,
  JsonController,
  Post,
  BodyParam,
  CurrentUser,
  Get
} from "routing-controllers";
import { Answer } from "../entity/Answer";
import { Question } from "../entity/Question";
import { User } from "../entity/User";

@JsonController("/answer")
class AnswerController {
  answerRepository: Repository<Answer>;
  questionRepository: Repository<Question>;
  constructor() {
    this.answerRepository = getRepository(Answer);
    this.questionRepository = getRepository(Question);
  }

  @Get("/")
  async getAllAnswers() {
    return this.answerRepository.find({
      relations: ["votes"]
    });
  }

  @Post("/")
  async addAnswer(
    @BodyParam("questionId") questionId: number,
    @BodyParam("body") body: string,
    @CurrentUser({ required: true }) user: User
  ) {
    let question: Question;
    try {
      question = await this.questionRepository.findOneOrFail(questionId);
    } catch {
      throw new NotFoundError(`No question with id ${questionId}`);
    }

    const answer = this.answerRepository.create({
      body,
      question,
      user
    });

    try {
      const savedAnswer = await this.answerRepository.save(answer);
      return savedAnswer;
    } catch (error) {
      throw new BadRequestError("Already answered this question");
    }
  }

  // TODO: delete answer
  // TODO: patch answer
}

export default AnswerController;
