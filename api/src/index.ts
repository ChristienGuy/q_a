import "reflect-metadata";
import { createConnection } from "typeorm";
import * as morgan from "morgan";

import { app } from "./server";

// TODO: allow ssl: https://github.com/typestack/routing-controllers/issues/253
// create express server as usual either createExpressServer or useExpressServer
// this.app = createExpressServer(someOptions);
// // configure  other middlewares or swaggers as on usually on app
// // create https server
// this.app = https.createServer({key,cert}, this.app);
// this.app.listen(433,()=>console.log('https server on 433'));

createConnection()
  .then(async () => {
    app.use(morgan("combined"));

    app.listen(8888, () => {
      console.log("Express server has started on port 8888.");
    });
  })
  .catch(error => console.log(error));
