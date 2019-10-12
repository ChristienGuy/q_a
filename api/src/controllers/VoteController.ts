import {
  JsonController,
  Post,
  BodyParam,
  CurrentUser,
  HttpCode,
  NotFoundError
} from "routing-controllers";
import { Repository, getRepository } from "typeorm";
import { Question } from "../entity/Question";
import { Vote } from "../entity/Vote";
import { User } from "../entity/User";
import { Answer } from "../entity/Answer";

@JsonController("/vote")
class VoteController {
  questionRepository: Repository<Question>;
  answerRepository: Repository<Answer>;
  voteRepository: Repository<Vote>;

  constructor() {
    this.questionRepository = getRepository(Question);
    this.answerRepository = getRepository(Answer);
    this.voteRepository = getRepository(Vote);
  }

  @Post("/")
  async addVote(
    @BodyParam("questionId") questionId: number,
    @BodyParam("answerId") answerId: number,
    @BodyParam("value") value: number,
    @CurrentUser({ required: true }) user: User
  ) {
    if (questionId) {
      let question;
      try {
        question = await this.questionRepository.findOneOrFail(questionId);
      } catch (error) {
        throw new NotFoundError(`no question with id: ${questionId}`);
      }

      const vote = this.voteRepository.create({
        question,
        user,
        value
      });
      this.voteRepository.save(vote);
      return HttpCode(203);
    }

    if (answerId) {
      // vote for answer
      let answer: Answer;
      try {
        answer = await this.answerRepository.findOneOrFail(answerId);
      } catch {
        throw new NotFoundError(`no answer with id: ${answerId}`);
      }
      const vote = this.voteRepository.create({
        answer,
        user,
        value
      });
      this.voteRepository.save(vote);
      return HttpCode(203);
    }
  }

  // TODO: add patch to update a vota (e.g with a different value etc.)
  // TODO: add delete to remove a vote completely
}

export default VoteController;
