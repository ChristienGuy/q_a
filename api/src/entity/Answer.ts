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
import { ObjectType, Field, ID } from "type-graphql";

@Unique(["question", "user"])
@Entity()
@ObjectType()
export class Answer {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.answers
  )
  user: User;

  @ManyToOne(
    type => Question,
    question => question.answers
  )
  question: Question;

  @OneToMany(
    type => Vote,
    vote => vote.answer
  )
  votes: Vote[];

  @Field()
  @Column()
  body: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
