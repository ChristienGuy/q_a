import "reflect-metadata";
import { createConnection, getCustomRepository } from "typeorm";
import { createExpressServer, Action, CookieParam } from "routing-controllers";
import * as morgan from "morgan";
import * as jwt from "jsonwebtoken";

import { UserRepository } from "./repository/UserRepository";
import { Response } from "express";
import config from "./config/config";

const getCookies = (cookieString: string): { jwt?: string } => {
  return cookieString.split(";").reduce((res, c) => {
    const [key, val] = c
      .trim()
      .split("=")
      .map(decodeURIComponent);
    try {
      return Object.assign(res, { [key]: JSON.parse(val) });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {});
};

function getNewTokenForUser({ id, email }) {
  return jwt.sign({ userId: id, email }, config.jwtSecret, {
    expiresIn: "1h"
  });
}

// TODO: allow ssl: https://github.com/typestack/routing-controllers/issues/253
// create express server as usual either createExpressServer or useExpressServer
// this.app = createExpressServer(someOptions);
// // configure  other middlewares or swaggers as on usually on app
// // create https server
// this.app = https.createServer({key,cert}, this.app);
// this.app.listen(433,()=>console.log('https server on 433'));

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function(origin, callback) {
    console.log("ORIGIN", origin);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

createConnection()
  .then(async connection => {
    // create express app
    const app = createExpressServer({
      cors: corsOptions,
      controllers: [__dirname + "/controllers/*.ts"],
      authorizationChecker: async (action: Action, roles: string[]) => {
        let authorized = false;
        const response: Response = action.response;

        const cookies = getCookies(action.request.headers["cookie"]);

        const token = cookies["jwt"];

        const userRepository = getCustomRepository(UserRepository);

        let user;
        try {
          user = await userRepository.findByToken(token);
        } catch (error) {
          return false;
        }

        if (user && !roles) {
          authorized = true;
        }
        if (user && roles.includes(user.role)) {
          authorized = true;
        }

        // if authorized refresh the token
        if (authorized) {
          const newToken = getNewTokenForUser(user);
          response.cookie("jwt", newToken, {
            httpOnly: true
          });
        }
        return authorized;
      },
      currentUserChecker: async (action: Action) => {
        const { jwt } = getCookies(action.request.headers["cookie"]);
        const userRepository = getCustomRepository(UserRepository);

        let user;
        try {
          user = await userRepository.findByToken(jwt);
        } catch (error) {
          return;
        }

        // refresh token for the user for another hour
        const newToken = getNewTokenForUser(user);
        action.response.cookie("jwt", newToken, {
          httpOnly: true
        });
        return user;
      }
    });

    app.use(morgan("combined"));

    app.listen(8888, () => {
      console.log("Express server has started on port 8888.");
    });
  })
  .catch(error => console.log(error));
