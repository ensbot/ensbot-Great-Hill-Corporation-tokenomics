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
      table.string('nickname');
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
      table.decimal('gas_cost', 21, 18).unsigned().notNullable(); // expects that gasCost will never be more specific than XXX.XXXXXXXXXXXXXXXXXX
      table.boolean('is_error').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.primary(['block_number', 'tx_index', 'trace_id']);
    })
    .createTable('address_transaction', (table) => {
      table.integer('address_id').unsigned().references('id').inTable('address').notNullable()
        .onDelete('RESTRICT'); // Prevent address deletion if we have a transaction for it
      table.integer('block_number').unsigned().notNullable();
      table.integer('tx_index').unsigned().notNullable();
      table.integer('trace_id').unsigned().notNullable();
      table.foreign(['block_number', 'tx_index', 'trace_id']).references(['block_number', 'tx_index', 'trace_id']).inTable('transaction')
        .onDelete('CASCADE'); // Delete the address-transaction mapping if the block or tx gets deleted.
      table.primary(['address_id', 'block_number', 'tx_index', 'trace_id']);
    })
    .createTable('abi_spec', (table) => {
      table.integer('abi_address_id').unsigned().references('id').inTable('address').notNullable()
        .onDelete('RESTRICT'); // prevent address deletion if we have its ABI spec
      table.string('fn_name').notNullable();
      table.string('arg_name').notNullable();
      table.string('arg_type').notNullable();
      table.integer('arg_index').unsigned().notNullable();
      table.primary(['abi_address_id', 'fn_name', 'arg_index']);
    })
    .createTable('input_data', (table) => {
      table.integer('block_number').unsigned().notNullable();
      table.integer('tx_index').unsigned().notNullable();
      table.integer('trace_id').unsigned().notNullable();
      table.integer('abi_address_id').unsigned();
      table.string('fn_name').notNullable();
      table.integer('arg_index').unsigned().notNullable();
      table.text('arg_value');
      table.foreign(['block_number', 'tx_index', 'trace_id']).references(['block_number', 'tx_index', 'trace_id']).inTable('transaction')
        .onDelete('CASCADE'); // If a block or tx is deleted, delete its input data.
      // it is ok to use this next set of 3 as a compound foreign key.
      // in the event of input data that we do not know, we will set the fields as:
      //    abi_address_id: ${tx 'to' address}
      //    fn_name: 'unknown'
      //    arg_index: null
      //    data: garbled
      // what if the input data comes in but it's not a function call?
      table.foreign(['abi_address_id', 'fn_name', 'arg_index']).references(['abi_address_id', 'fn_name', 'arg_index']).inTable('abi_spec')
        .onDelete('RESTRICT'); // Prevent ABI deletion if input data exists for it.
      table.primary(['block_number', 'tx_index', 'trace_id', 'abi_address_id', 'fn_name', 'arg_index']);
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('input_data')
    .dropTable('abi_spec')
    .dropTable('address_transaction')
    .dropTable('transaction')
    .dropTable('address')
    .dropTable('block')
    .dropTable('price');
};
