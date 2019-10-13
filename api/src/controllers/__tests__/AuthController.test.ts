/*eslint-env jest */

import AuthController from "../AuthController";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "../../entity/User";
import { Question } from "../../entity/Question";
import { Answer } from "../../entity/Answer";
import { Vote } from "../../entity/Vote";

let authController;
let userRepository;
beforeEach(async () => {
  await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [User, Question, Answer, Vote],
    synchronize: true,
    logging: false
  });
  authController = new AuthController();
  userRepository = getRepository(User);
});

afterEach(async () => {
  const conn = getConnection();
  return conn.close();
});

test("should fail login if no user", async () => {
  expect(authController.login("admin@test.com", "password")).rejects.toThrow(
    "no matching user"
  );
});

test("should login if user exists", async () => {
  // This currently mimics the usercontroller add user method
  // This is a bit fragile since we need to remember to update this
  // every time we update the user controller/auth methods
  // TODO: look into using the controller directly here/moving that logic into
  // a shared service
  const mockCookie = jest.fn();
  const user = await userRepository.create({
    email: "admin@example.com",
    username: "admin",
    password: "admin",
    role: "admin"
  });
  user.hashPassword();
  await userRepository.save(user);

  const response = await authController.login("admin@example.com", "admin", {
    cookie: mockCookie
  });

  expect(mockCookie).toHaveBeenCalledTimes(1);
  expect(response).toBeUndefined();
});
