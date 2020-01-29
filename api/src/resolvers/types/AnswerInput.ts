import { InputType, Field } from "type-graphql";
import { Answer } from "../../entity/Answer";

@InputType()
export class AnswerInput implements Partial<Answer> {
  @Field()
  body: string;
}
