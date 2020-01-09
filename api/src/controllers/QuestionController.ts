import { getRepository, Repository } from "typeorm";
import {
  JsonController,
  Get,
  Post,
  Body,
  CurrentUser,
  Param,
  Patch
} from "routing-controllers";

import { Question } from "../entity/Question";
import { User } from "../entity/User";
import { Vote } from "../entity/Vote";

@JsonController("/question")
class QuestionController {
  questionRepository: Repository<Question>;
  constructor() {
    this.questionRepository = getRepository(Question);
  }

  @Get("/")
  async find() {
    return this.questionRepository
      .createQueryBuilder("question")
      .select(["question", "user.email", "user.username"])
      .innerJoin("question.user", "user")
      .getMany();
  }

  @Get("/:id([0-9]+)")
  async findOne(@Param("id") id: number) {
    // TODO: use query builder to optimize the data being returned
    return this.questionRepository.findOneOrFail(id, {
      select: ["id", "body"],
      relations: ["votes", "user", "answers"]
    });
    // return this.questionRepository
    //   .createQueryBuilder("question")
    //   .select(["question", "user.email", "user.username"])
    //   .leftJoin("question.user", "user")
    //   .getMany();
  }

  @Post("/")
  async add(
    @CurrentUser({ required: true }) currentUser: User,
    @Body() questionBody: Question
  ) {
    const question = this.questionRepository.create({
      ...questionBody,
      user: currentUser
    });
    await this.questionRepository.save(question);
    return question;
  }

  @Patch("/:id([0-9]+)")
  async update(@Param("id") id: number, @Body() updatedQuestion: Question) {
    const question = await this.questionRepository.findOne(id);
    await this.questionRepository.merge(question, updatedQuestion);
    return this.questionRepository.save(question);
  }

  // TODO: Do we even want to delete a question?
  // @Delete("/:id([0-9]+)")
  // async delete(@Param("id") id: number) {
  //   await this.questionRepository.delete(id);
  //   return HttpCode(203);
  // }
}

export default QuestionController;
