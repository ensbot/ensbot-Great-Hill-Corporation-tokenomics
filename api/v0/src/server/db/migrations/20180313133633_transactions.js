exports.up = (knex, Promise) => {
  return knex.schema.createTable('transactions', (table) => {
    table.charset('utf8mb4');
    table.collate('utf8mb4_bin');
    table.increments();
    table.datetime('dateTime').notNullable();
    table.integer('blockNumber').unsigned().notNullable(); // max val: 4294967295
    table.integer('transactionIndex').unsigned().notNullable();
    table.string('from', 42).notNullable();
    table.string('to', 42).notNullable();
    table.bigInteger('value').unsigned().notNullable().defaultTo(0); // max val: 	2^64-1
    table.decimal('gasCost', 21, 18).unsigned().notNullable(); // expects that gasCost will never be more specific than XXX.XXXXXXXXXXXXXXXXXX
    table.boolean('isError').notNullable().defaultTo(false);
    // table.boolean('isFnCall').notNullable().defaultTo(false);
    table.boolean('isFinalized').notNullable().defaultTo(false);
    table.text('articulated', 'longtext');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('transactions');
};
