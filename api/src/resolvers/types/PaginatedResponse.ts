import { Answer } from "../../entity/Answer";
import { Int, ObjectType, Field, ClassType } from "type-graphql";
import { Question } from "../../entity/Question";

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(type => [TItemClass])
    items: TItem[];

    @Field(type => Int)
    total: number;

    // TODO: work out how to set a "hasMore" field for consumers
  }
  return PaginatedResponseClass;
}

@ObjectType()
export class AnswersResponse extends PaginatedResponse(Answer) {}

@ObjectType()
export class QuestionsResponse extends PaginatedResponse(Question) {}
