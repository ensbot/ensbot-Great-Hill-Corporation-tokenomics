const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

exports.up = (knex, Promise) => {
  let knexCreateTables = knex.schema
  // .createTable('exchange', (table) => {
  //   table.string('name', 25).notNullable();
  //   table.string('nicename', 25).notNullable();
  // })
    .createTable('price', (table) => {
    table.timestamp('timeStamp').notNullable();
    // NOTE:
    //  Purposely not cascading deletions of blockNumber price in this table.
    // table.integer('blockNumber').unsigned().notNullable();
    table.string('currencyFrom', 10).notNullable();
    table.string('currencyTo', 10).notNullable();
    table.enum('exchangeName', ['coinbase', 'poloniex', 'bittrex']).notNullable();
    // choosing arbitrary decimal precision
    table.decimal('exchangeRate', 21, 18).unsigned().notNullable();
  }).createTable('block', (table) => {
    table.integer('blockNumber').unsigned().primary().notNullable(); // max val: 4294967295
    table.integer('timeStamp', 11).unsigned().notNullable();
    table.boolean('isFinalized').notNullable().defaultTo(false);
  })
.createTable('user', (table) => {
    table.increments('userID');
    table.string('userName', 40);
  }).createTable('monitor_group', (table) => {
    // `userID` nullable because some views might be shared between users
    table.integer('userID').unsigned().references('userID').inTable('user')
      // delete user's monitorGroup if the user is deleted.
      .onDelete('CASCADE');
    table.integer('monitorGroupID').unsigned().notNullable();
    table.string('monitorAddress', 42);
    table.string('nickname', 50);
    table.primary(['userID', 'monitorAddress', 'monitorGroupID']);
  }).createTable('abi_spec', (table) => {
    //table.integer('abiAddress').unsigned().references('id').inTable('address').notNullable()
    //  .onDelete('RESTRICT'); // prevent address deletion if we have its ABI spec
    table.binary('encoding', 10).primary().notNullable();
    table.specificType('fnDefinition', 'JSON').notNullable();
  }).createTable('transaction', (table) => {
    table.charset('utf8mb4');
    table.collate('utf8mb4_bin');
    table.integer('blockNumber').unsigned().references('blockNumber').inTable('block').notNullable().onDelete('CASCADE'); // delete the transaction if the block gets deleted.
    table.integer('transID').unsigned().notNullable();
    table.integer('traceID').unsigned().notNullable();
    table.string('fromAddress', 42).notNullable();
    table.string('toAddress', 42).notNullable();
    table.decimal('valueWei', 38, 0).unsigned().notNullable();
    table.bigInteger('gasUsed').unsigned().notNullable();
    table.bigInteger('gasPrice').unsigned().notNullable();
    table.boolean('isError').notNullable().defaultTo(false);
    table.string('encoding', 10)
    //.references('encoding').inTable('abi_spec')
      .notNullable();
    table.specificType('articulated', 'JSON');
    table.primary(['blockNumber', 'transID', 'traceID']);
  }).createTable('monitor_transaction', (table) => {
    table.string('monitorAddress', 42).notNullable();
    table.integer('blockNumber').unsigned().notNullable();
    table.integer('transID').unsigned().notNullable();
    table.integer('traceID').unsigned().notNullable();
    table.foreign(['blockNumber', 'transID', 'traceID']).references(['blockNumber', 'transID', 'traceID']).inTable('transaction')
      // Delete the address-transaction mapping if the block or tx gets deleted.
      .onDelete('CASCADE');
    table.primary(['monitorAddress', 'blockNumber', 'transID', 'traceID']);
  });
  const createTableSqlCode = knexCreateTables.toSQL().map((knexCode) => {
    return knexCode.sql;
  }).join(';\n').concat(';\n');
  return writeFile('./src/server/db/migrations/20180313133633_transactions.sql', createTableSqlCode).then(() => {
    return knexCreateTables;
  })
  .catch((err) => {
    console.log(err);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('monitor_transaction')
    .dropTable('transaction')
    .dropTable('abi_spec')
    .dropTable('monitor_group')
    .dropTable('block')
    .dropTable('user')
    .dropTable('price');
};
