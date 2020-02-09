import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";

import { Question } from "./Question";
import { Vote } from "./Vote";
import { Answer } from "./Answer";
import { ObjectType, Field, ID } from "type-graphql";
import { Lazy } from "../resolvers/helpers";
import {
  AnswersResponse,
  QuestionsResponse
} from "../resolvers/types/PaginatedResponse";

@Entity()
@Unique(["email", "username"])
@ObjectType()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field()
  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Field(type => QuestionsResponse)
  @OneToMany(
    () => Question,
    question => question.user,
    { lazy: true }
  )
  questions: Lazy<Question[]>;

  @Field(type => AnswersResponse)
  @OneToMany(
    () => Answer,
    answer => answer.user,
    { lazy: true }
  )
  answers: Lazy<Answer[]>;

  // TODO: graphql relationship
  @OneToMany(
    () => Vote,
    vote => vote.user
  )
  votes: Vote[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
