import { Resolver, Query } from "type-graphql";
import { User } from "../entity/User";
import { Repository, getRepository } from "typeorm";

@Resolver(User)
export class UserResolver {
  private readonly userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }
}
