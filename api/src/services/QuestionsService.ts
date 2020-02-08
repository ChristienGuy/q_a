import {
  UserPaginationArgs,
  PaginationArgs
} from "../resolvers/types/PaginationArgs";
import { Repository, getRepository } from "typeorm";
import { QuestionsResponse } from "../resolvers/types/PaginatedResponse";
import { Question } from "../entity/Question";

export class QuestionsService {
  private readonly questionRepository: Repository<Question>;
  constructor() {
    this.questionRepository = getRepository(Question);
  }

  private async getQuestionsWhere({ page, perPage, where }) {
    return this.questionRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      where
    });
  }

  async getQuestions({ page, perPage }: PaginationArgs) {
    const [items, total] = await this.getQuestionsWhere({
      page,
      perPage,
      where: {}
    });

    return {
      items,
      total
    };
  }

  async getQuestionsByUserId({
    page,
    perPage,
    userId
  }: UserPaginationArgs): Promise<QuestionsResponse> {
    const [items, total] = await this.getQuestionsWhere({
      page,
      perPage,
      where: {
        userId
      }
    });

    return {
      items,
      total
    };
  }
}
