import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { nullable: true })
  page = 1;

  @Field(type => Int, { nullable: true })
  perPage = 10;
}

@ArgsType()
export class QuestionPaginationArgs extends PaginationArgs {
  @Field(type => Int)
  questionId;
}

@ArgsType()
export class UserPaginationArgs extends PaginationArgs {
  @Field(type => Int)
  userId;
}
