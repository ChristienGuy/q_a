import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const { DATABASE_URL } = process.env;

// TODO: setup url to use DATABASE_URL env var so it works with heroku
// TODO: rest of the heroku config
const base: PostgresConnectionOptions = {
  type: "postgres",
  url: DATABASE_URL
    ? DATABASE_URL
    : "postgresql://postgres:gretter@localhost:54320/qa",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};

const config = {
  test: {},
  dev: {},
  production: {
    // url: process.env.DATABASE_URL
  }
};

export = {
  ...base,
  ...config[process.env.NODE_ENV || "production"]
};
