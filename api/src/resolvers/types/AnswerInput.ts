import { InputType, Field, ID } from "type-graphql";
import { Answer } from "../../entity/Answer";

@InputType()
export class AnswerInput implements Partial<Answer> {
  @Field()
  body: string;

  @Field(type => ID)
  questionId: number;
}
