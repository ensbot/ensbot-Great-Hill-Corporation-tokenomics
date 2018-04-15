For QuickBlocks => mysql workflow, let's figure out what data gets inserted when.

Here is the workflow that I imagine right now:

iterate through each transaction row (`tx`):

- insert into **block**: `tx.block_number`, `tx.date_time`.

  - if it's a duplicate, it will have no effect.

- insert all of the following into **address**: `BINARY(tx.to)`, `BINARY(tx.from)`, `BINARY(tx.monitorAddress)`

  - if it's a duplicate, it will have no effect.

  - this table may be obsolete since we are now storing the addresses in binary on each table.

- insert `tx` into **transaction** with `address.address_id` in `to` and `from` columns.

  - if it's a duplicate, it will have no effect.

- insert rows into **monitor_transaction**: `tx.block_number`, `tx.tx_index`, `tx.trace_id`, and monitor's `address_id`

  - duplicates have no effect.

  - right now, rows with explicit address in `tx.to`/`tx.from` are included in this table. Logically, this is easiest. 

However, storage considerations may suggest that we eliminate obvious monitor tx from this table, the effect of which would be renaming this table to **hidden_monitor_transaction**
