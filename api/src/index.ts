import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";

// express middlewares
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { validateTokensMiddleware } from "./middlewares/validate-tokens-middleware";

import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Context } from "./context.interface";
import { authChecker } from "./custom-auth-checker";

async function bootstrap() {
  try {
    const app = express();
    app.use(morgan("combined"));
    app.use(cookieParser());
    app.use(validateTokensMiddleware);

    await createConnection();
    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.{ts,js}"],
      emitSchemaFile: true,
      authChecker: authChecker
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }): Context => ({ req, res }),
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
