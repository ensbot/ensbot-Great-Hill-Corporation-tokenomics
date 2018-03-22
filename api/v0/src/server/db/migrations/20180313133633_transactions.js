exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('address', (table) => {
      table.increments('id');
      table.bigInteger('address').notNullable();
      table.boolean('is_monitored').notNullable().defaultTo(false);
      table.boolean('known_contract').notNullable().defaultTo(false);
      table.string('nickname');
    })
    .createTable('transaction', (table) => {
      table.charset('utf8mb4');
      table.collate('utf8mb4_bin');
      table.increments();
      table.datetime('date_time').notNullable();
      table.integer('block_number').unsigned().notNullable(); // max val: 4294967295
      table.integer('transaction_index').unsigned().notNullable();
      table.integer('trace_id').unsigned().notNullable();
      table.integer('from', 42).unsigned().references('id').inTable('address').notNullable();
      table.integer('to', 42).unsigned().references('id').inTable('address').notNullable();
      table.bigInteger('value_wei').unsigned().notNullable().defaultTo(0); // max val: 	2^64-1
      table.decimal('gas_cost', 21, 18).unsigned().notNullable(); // expects that gasCost will never be more specific than XXX.XXXXXXXXXXXXXXXXXX
      table.boolean('is_error').notNullable().defaultTo(false);
      table.boolean('is_finalized').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      //table.primary(['block_number', 'transaction_index', 'trace_id']);
    })
    .createTable('abi_spec', (table) => {
      table.increments();
      table.integer('contract_address_id').unsigned().references('id').inTable('address').notNullable();
      table.string('fn_name').notNullable();
      table.string('arg_name').notNullable();
      table.integer('arg_index').unsigned().notNullable();
    })
    .createTable('input_data', (table) => {
      table.increments();
      //table.integer('block_number').unsigned().references('block_number').inTable('transaction').notNullable();
      //table.integer('transaction_index').unsigned().references('transaction_index').inTable('transaction').notNullable();
      //table.integer('trace_id').unsigned().references('trace_index').inTable('transaction').notNullable();
      table.integer('transaction_id').unsigned().references('id').inTable('transaction').notNullable();
      table.integer('abi_id').unsigned().references('id').inTable('abi_spec').notNullable();
      table.text('arg_value');
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('address')
    .dropTable('transactions')
    .dropTable('abi_spec')
    .dropTable('input_data');
};
