import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection, getRepository } from "typeorm";
import { ApolloServer } from "apollo-server";
import { AnswerResolver } from "./resolvers/AnswerResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { User } from "./entity/User";
import { Context } from "./resolvers/types/Context";
import { QuestionResolver } from "./resolvers/QuestionResolver";

// TODO: allow ssl: https://github.com/typestack/routing-controllers/issues/253
// create express server as usual either createExpressServer or useExpressServer
// this.app = createExpressServer(someOptions);
// // configure  other middlewares or swaggers as on usually on app
// // create https server
// this.app = https.createServer({key,cert}, this.app);
// this.app.listen(433,()=>console.log('https server on 433'));

async function bootstrap() {
  try {
    await createConnection();
    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.{ts,js}"]
    });

    const user = await getRepository(User).findOne(1);

    const context: Context = {
      user
    };

    const server = new ApolloServer({
      schema,
      context
    });

    const { url } = await server.listen(8888);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (e) {
    console.log(e);
  }
}

bootstrap();

// createConnection()
//   .then(async () => {
//     app.use(morgan("combined"));

//     app.listen(8888, () => {
//       console.log("Express server has started on port 8888.");
//     });
//   })
//   .catch(error => console.log(error));
