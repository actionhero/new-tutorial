import { URL } from "url";
import * as path from "path";

const DEFAULT = {
  sequelize: (config) => {
    let dialect = "postgres";
    let host = "127.0.0.1";
    let port = "5432";
    let database = "ahtodotutorial";
    let username = "ymmy";
    let password = "";

    // if your environment provides database information via a single JDBC-style URL like mysql://username:password@hostname:port/default_schema
    if (process.env.DATABASE_URL) {
      const parsed = new URL(process.env.DATABASE_URL);
      if (parsed.username) {
        username = parsed.username;
      }
      if (parsed.password) {
        password = parsed.password;
      }
      if (parsed.hostname) {
        host = parsed.hostname;
      }
      if (parsed.port) {
        port = parsed.port;
      }
      if (parsed.pathname) {
        database = parsed.pathname.substring(1);
      }
    }

    return {
      autoMigrate: true,
      logging: false,
      dialect: dialect,
      port: parseInt(port),
      database: database,
      host: host,
      username: username,
      password: password,
      models: [path.join(__dirname, "..", "models")],
      migrations: [path.join(__dirname, "..", "migrations")],
    };
  },
};

module.exports.DEFAULT = DEFAULT;

// for the sequelize CLI tool
module.exports.development = DEFAULT.sequelize({
  env: "development",
  process: { env: "development" },
});

module.exports.staging = DEFAULT.sequelize({
  env: "staging",
  process: { env: "staging" },
});

module.exports.production = DEFAULT.sequelize({
  env: "production",
  process: { env: "production" },
});
