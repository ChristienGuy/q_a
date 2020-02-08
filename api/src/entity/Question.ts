import {
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";

import { User } from "./User";
import { Vote } from "./Vote";
import { Answer } from "./Answer";
import { MaxLength } from "class-validator";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Lazy } from "../resolvers/helpers";
import { AnswersResponse } from "../resolvers/types/PaginatedResponse";

@Entity()
@ObjectType()
export class Question {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @MaxLength(70)
  title: string;

  @Field()
  @Column()
  body: string;

  // TODO: graphql type
  @OneToMany(
    () => Vote,
    vote => vote.question
  )
  votes: Vote[];

  @Field(type => AnswersResponse)
  @OneToMany(
    () => Answer,
    answer => answer.question,
    { lazy: true }
  )
  answers: Lazy<Answer[]>;

  @Field(type => User)
  @ManyToOne(
    () => User,
    user => user.questions,
    { lazy: true }
  )
  user: Lazy<User>;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
