import {
  QuestionPaginationArgs,
  UserPaginationArgs,
  PaginationArgs
} from "../resolvers/types/PaginationArgs";
import { Answer } from "../entity/Answer";
import { Repository, getRepository } from "typeorm";
import { AnswersResponse } from "../resolvers/types/PaginatedResponse";

export class AnswersService {
  private readonly answerRepository: Repository<Answer>;
  constructor() {
    this.answerRepository = getRepository(Answer);
  }

  private async getAnswersWhere({ page, perPage, where }) {
    const answers = await this.answerRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      where,
      order: {
        updatedAt: "DESC"
      }
    });

    return answers;
  }

  async getAnswers({
    page,
    perPage
  }: PaginationArgs): Promise<AnswersResponse> {
    const [items, total] = await this.getAnswersWhere({
      page,
      perPage,
      where: {}
    });

    return {
      items,
      total
    };
  }

  async getAnswersByQuestionId({
    page,
    perPage,
    questionId
  }: QuestionPaginationArgs): Promise<AnswersResponse> {
    const [items, total] = await this.getAnswersWhere({
      page,
      perPage,
      where: {
        question: questionId
      }
    });

    return {
      items,
      total
    };
  }

  async getAnswersByUserId({
    page,
    perPage,
    userId
  }: UserPaginationArgs): Promise<AnswersResponse> {
    const [items, total] = await this.getAnswersWhere({
      page,
      perPage,
      where: {
        user: userId
      }
    });

    return {
      items,
      total
    };
  }
}
