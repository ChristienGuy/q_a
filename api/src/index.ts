import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { validateTokensMiddleware } from "./middlewares/validate-tokens-middleware";

async function bootstrap() {
  try {
    const app = express();
    app.use(morgan("combined"));
    app.use(cookieParser());
    app.use(validateTokensMiddleware);

    await createConnection();
    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.{ts,js}"],
      emitSchemaFile: true
    });

    // TODO: replace with actual context fetching with typegraphql
    // const user = await getRepository(User).findOne(1);
    // const context: Context = {
    //   user
    // };

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      playground: {
        settings: {
          "request.credentials": "include"
        }
      }
    });
    apolloServer.applyMiddleware({
      app
    });

    app.listen(8888);
    console.log(
      `Server is running, GraphQL Playground available at localhost:8888${apolloServer.graphqlPath}`
    );
  } catch (e) {
    console.log(e);
  }
}

bootstrap();
