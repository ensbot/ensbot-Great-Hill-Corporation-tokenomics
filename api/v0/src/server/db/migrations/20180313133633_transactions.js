exports.up = (knex, Promise) => {
  return knex.schema
    // .createTable('exchange', (table) => {
    //   table.string('name', 25).notNullable();
    //   table.string('nicename', 25).notNullable();
    // })
    .createTable('price', (table) => {
      table.datetime('date_time').notNullable();
      // NOTE:
      //  Purposely not cascading deletions of block_number price in this table.
      // table.integer('block_number').unsigned().notNullable();
      table.string('currency_from', 10).notNullable();
      table.string('currency_to', 10).notNullable();
      table.enum('exchange_name', ['coinbase', 'poloniex', 'bittrex']).notNullable();
      // choosing arbitrary decimal precision
      table.decimal('exchange_rate', 21, 18).unsigned().notNullable();
    })
    .createTable('block', (table) => {
      table.integer('block_number').unsigned().primary().notNullable(); // max val: 4294967295
      table.datetime('date_time').notNullable();
      table.boolean('is_finalized').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // create an address table so that addresses are only stored once
    .createTable('address', (table) => {
      table.increments('id');
      table.binary('address').notNullable();
      table.boolean('is_monitored').notNullable().defaultTo(false);
      table.boolean('known_contract').notNullable().defaultTo(false);
    })
    .createTable('user', (table) => {
      table.increments('user_id');
      table.string('user_name', 40);
    })
    .createTable('monitor_view', (table) => {
      // `user_id` nullable because some views might be shared between users
      table.integer('user_id').unsigned().references('user_id').inTable('user')
        .onDelete('CASCADE'); // delete user monitors if the user is deleted.
      table.integer('monitor_view_id').unsigned().notNullable();
      table.integer('address_id').unsigned().references('id').inTable('address').notNullable()
        .onDelete('RESTRICT'); // prevent deletion of an address when it's used in a monitor.
      table.string('nickname', 50);
      table.primary(['user_id', 'address_id', 'monitor_view_id']);
    })
    .createTable('abi_spec', (table) => {
      //table.integer('abi_address_id').unsigned().references('id').inTable('address').notNullable()
      //  .onDelete('RESTRICT'); // prevent address deletion if we have its ABI spec
      table.binary('abi_encoding', 20).primary().notNullable();
      table.specificType('fn_definition', 'JSON').notNullable();
    })
    .createTable('transaction', (table) => {
      table.charset('utf8mb4');
      table.collate('utf8mb4_bin');
      table.integer('block_number').unsigned().references('block_number').inTable('block').notNullable()
        .onDelete('CASCADE'); // delete the transaction if the block gets deleted.
      table.integer('tx_index').unsigned().notNullable();
      table.integer('trace_id').unsigned().notNullable();
      table.integer('from', 42).unsigned().references('id').inTable('address').notNullable();
      table.integer('to', 42).unsigned().references('id').inTable('address').notNullable();
      table.bigInteger('value_wei').unsigned().notNullable().defaultTo(0); // max val: 	2^64-1
      table.decimal('gas_used', 21, 18).unsigned().notNullable(); // expects that gasCost will never be more specific than XXX.XXXXXXXXXXXXXXXXXX
      table.decimal('gas_price', 21, 18).unsigned().notNullable();
      table.boolean('is_error').notNullable().defaultTo(false);
      table.binary('abi_encoding', 20).references('abi_encoding').inTable('abi_spec').notNullable();
      table.specificType('input_articulated', 'JSON');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.primary(['block_number', 'tx_index', 'trace_id']);
    })
    .createTable('monitor_transaction', (table) => {
      table.integer('address_id').unsigned().references('id').inTable('address').notNullable()
        .onDelete('RESTRICT'); // Prevent address deletion if we have a transaction for it
      table.integer('block_number').unsigned().notNullable();
      table.integer('tx_index').unsigned().notNullable();
      table.integer('trace_id').unsigned().notNullable();
      table.foreign(['block_number', 'tx_index', 'trace_id']).references(['block_number', 'tx_index', 'trace_id']).inTable('transaction')
        .onDelete('CASCADE'); // Delete the address-transaction mapping if the block or tx gets deleted.
      table.primary(['address_id', 'block_number', 'tx_index', 'trace_id']);
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    // .dropTable('input_data')
    .dropTable('monitor_transaction')
    .dropTable('transaction')
    .dropTable('abi_spec')
    .dropTable('monitor_view')
    .dropTable('address')
    .dropTable('block')
    .dropTable('user')
    .dropTable('price');
};
