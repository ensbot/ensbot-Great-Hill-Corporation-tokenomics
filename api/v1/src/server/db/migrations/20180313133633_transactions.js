const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

exports.up = (knex, Promise) => {
  let knexCreateTables = knex.schema
    .createTable('price', (table) => {
    table.timestamp('timeStamp').notNullable();
    table.string('currencyFrom', 10).notNullable();
    table.string('currencyTo', 10).notNullable();
    table.enum('exchangeName', ['coinbase', 'poloniex', 'bittrex']).notNullable();
    table.decimal('exchangeRate', 21, 18).unsigned().notNullable(); // arbitrary; research me

  }).createTable('block', (table) => {
    table.integer('blockNumber').unsigned().primary().notNullable();
    table.integer('timeStamp', 11).unsigned().notNullable();
    table.boolean('isFinalized').notNullable().defaultTo(false);

  }).createTable('abi_spec', (table) => {
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

  }).createTable('monitor', (table) => {
    table.string('monitorAddress', 42).primary().notNullable();
    table.string('nickname', 100);
    table.integer('firstBlock').unsigned();
    table.boolean('monitorStatus').defaultTo(true);

  }).createTable('monitor_group', (table) => {
    table.integer('monitorGroupID').primary().unsigned().notNullable();
    table.string('nickname', 100);

  }).createTable('monitor_monitor_group', (table) => {
    table.integer('monitorGroupId').unsigned().notNullable().references('monitorGroupId').inTable('monitor_group').onDelete('CASCADE');
    table.string('monitorAddress', 42).references('monitorAddress').inTable('monitor').notNullable().onDelete('CASCADE');
    table.primary(['monitorGroupID', 'monitorAddress']);

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
    .dropTable('monitor_monitor_group')
    .dropTable('monitor_transaction')
    .dropTable('monitor')
    .dropTable('monitor_group')
    .dropTable('transaction')
    .dropTable('abi_spec')
    .dropTable('block')
    .dropTable('price');
};
