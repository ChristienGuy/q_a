import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index
} from "typeorm";
import { Min, Max, IsInt } from "class-validator";

import { Question } from "./Question";
import { User } from "./User";
import { Answer } from "./Answer";

@Entity()
@Unique("answer_user", ["answer", "user"])
@Unique("question_user", ["question", "user"])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Answer, answer => answer.votes)
  answer: Answer;

  @ManyToOne(type => Question, question => question.votes)
  question: Question;

  @ManyToOne(type => User, user => user.votes)
  user: User;

  @Column()
  @IsInt()
  @Min(-1)
  @Max(1)
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
