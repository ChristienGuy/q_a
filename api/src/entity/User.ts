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

  @Column({ select: false })
  @Length(4, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  // TODO: graphql relationship
  @OneToMany(
    () => Question,
    question => question.user
  )
  questions: Question[];

  @Field(type => [Answer], { nullable: true })
  @OneToMany(
    () => Answer,
    answer => answer.user
  )
  answers: Answer[];

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
