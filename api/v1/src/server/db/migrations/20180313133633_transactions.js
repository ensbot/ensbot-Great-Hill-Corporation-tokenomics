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
    table.timestamp('timestamp').notNullable();
    // NOTE:
    //  Purposely not cascading deletions of block_number price in this table.
    // table.integer('block_number').unsigned().notNullable();
    table.string('currencyFrom', 10).notNullable();
    table.string('currencyTo', 10).notNullable();
    table.enum('exchangeName', ['coinbase', 'poloniex', 'bittrex']).notNullable();
    // choosing arbitrary decimal precision
    table.decimal('exchangeRate', 21, 18).unsigned().notNullable();
  }).createTable('block', (table) => {
    table.integer('block_number').unsigned().primary().notNullable(); // max val: 4294967295
    table.integer('timestamp', 11).unsigned().notNullable();
    table.boolean('is_finalized').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
.createTable('user', (table) => {
    table.increments('user_id');
    table.string('user_name', 40);
  }).createTable('monitor_group', (table) => {
    // `user_id` nullable because some views might be shared between users
    table.integer('user_id').unsigned().references('user_id').inTable('user')
      // delete user's monitor_group if the user is deleted.
      .onDelete('CASCADE');
    table.integer('monitor_group_id').unsigned().notNullable();
    table.string('monitor_address', 42);
    table.string('nickname', 50);
    table.primary(['user_id', 'monitor_address', 'monitor_group_id']);
  }).createTable('abi_spec', (table) => {
    //table.integer('abi_address').unsigned().references('id').inTable('address').notNullable()
    //  .onDelete('RESTRICT'); // prevent address deletion if we have its ABI spec
    table.binary('abi_encoding', 10).primary().notNullable();
    table.specificType('fn_definition', 'JSON').notNullable();
  }).createTable('transaction', (table) => {
    table.charset('utf8mb4');
    table.collate('utf8mb4_bin');
    table.integer('block_number').unsigned().references('block_number').inTable('block').notNullable().onDelete('CASCADE'); // delete the transaction if the block gets deleted.
    table.integer('tx_index').unsigned().notNullable();
    table.integer('trace_id').unsigned().notNullable();
    table.string('from_address', 42).notNullable();
    table.string('to_address', 42).notNullable();
    table.decimal('value_wei', 38, 0).unsigned().notNullable();
    table.bigInteger('gas_used').unsigned().notNullable();
    table.bigInteger('gas_price').unsigned().notNullable();
    table.boolean('is_error').notNullable().defaultTo(false);
    table.string('abi_encoding', 10)
    //.references('abi_encoding').inTable('abi_spec')
      .notNullable();
    table.specificType('input_articulated', 'JSON');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.primary(['block_number', 'tx_index', 'trace_id']);
  }).createTable('monitor_transaction', (table) => {
    table.string('monitor_address', 42).notNullable();
    table.integer('block_number').unsigned().notNullable();
    table.integer('tx_index').unsigned().notNullable();
    table.integer('trace_id').unsigned().notNullable();
    table.foreign(['block_number', 'tx_index', 'trace_id']).references(['block_number', 'tx_index', 'trace_id']).inTable('transaction')
      // Delete the address-transaction mapping if the block or tx gets deleted.
      .onDelete('CASCADE');
    table.primary(['monitor_address', 'block_number', 'tx_index', 'trace_id']);
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
