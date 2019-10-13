/*eslint-env jest */
import {
  createConnection,
  getConnection,
  Entity,
  getRepository
} from "typeorm";
import { User } from "../../entity/User";
import AuthController from "../AuthController";

let authController;

beforeEach(() => {
  authController = new AuthController();

  return createConnection({
    type: "postgres",
    database: ":memory:",
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false
  });
});

afterEach(() => {
  // const conn = getConnection();
  // conn.close();
});

test("should login correctly", async () => {
  const response = await authController.login();
  console.log(response);
});
