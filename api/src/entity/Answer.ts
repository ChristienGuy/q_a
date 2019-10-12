import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { User } from "./User";
import { Vote } from "./Vote";
import { Question } from "./Question";

@Unique(["question", "user"])
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.answers)
  user: User;

  @ManyToOne(type => Question, question => question.answers)
  question: Question;

  @OneToMany(type => Vote, vote => vote.answer)
  votes: Vote[];

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
