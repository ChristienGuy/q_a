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

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(70)
  title: string;

  @Column()
  body: string;

  @OneToMany(() => Vote, vote => vote.question)
  votes: Vote[];

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];

  @ManyToOne(() => User, user => user.questions)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
