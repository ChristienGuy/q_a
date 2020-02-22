// TODO: setup url to use DATABASE_URL env var so it works with heroku
// TODO: rest of the heroku config
const base = {
  type: "postgres",
  url: "postgresql://postgres:gretter@localhost:54320/qa",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.[jt]s"],
  subscribers: ["src/subscriber/**/*.[jt]s"],
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
    url: process.env.DATABASE_URL,
    entities: ["entity/**/*.js"],
    migrations: ["migration/**/*.js"],
    subscribers: ["subscriber/**/*.js"]
  }
};

module.exports = {
  ...base,
  ...config[process.env.NODE_ENV || "production"]
};
