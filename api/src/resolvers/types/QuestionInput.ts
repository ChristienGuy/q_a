import { InputType, Field } from "type-graphql";
import { Question } from "../../entity/Question";

@InputType()
export class QuestionInput implements Partial<Question> {
  @Field()
  title: string;

  @Field()
  body: string;
}
