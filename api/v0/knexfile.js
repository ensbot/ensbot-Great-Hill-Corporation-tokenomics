require('dotenv').config();
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PW;
const databaseName = 'tokenomics_test';

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: username,
      password: password,
      database: databaseName,
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: username,
      password: password,
      database: databaseName + '_testing',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  }
};
