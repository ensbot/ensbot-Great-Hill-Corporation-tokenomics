const databaseName = 'quickblocks_test';

module.exports = {
  development: {
    client: 'mysql',
    connection: `mysql://localhost:5432/${databaseName}`,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  test: {
    client: 'mysql',
    connection: `mysql://localhost:5432/${databaseName}_testing`,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  }
};
