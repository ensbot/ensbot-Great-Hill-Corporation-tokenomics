exports.up = (knex, Promise) => {
  return knex.schema.createTable('transactions', (table) => {
    table.increments();
    table.dateTime('dateTime').notNullable();
    table.integer('blockNumber').unsigned().notNullable(); // max val: 4294967295
    table.integer('transactionIndex').unsigned().notNullable();
    table.string('from', 42).notNullable();
    table.string('to', 42).notNullable();
    table.bigInteger('value').unsigned().notNullable().defaultTo(0); // max val: 	2^64-1
    table.integer('gasCost').unsigned().notNullable();
    table.boolean('isError').notNullable().defaultTo(F);
    // table.boolean('isFnCall').notNullable().defaultTo(F);
    table.boolean('isFinalized').notNullable().defaultTo(F);
    table.text('articulated', 'longtext');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('transactions');
};
