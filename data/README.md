For QuickBlocks => mysql workflow, let's figure out what data gets inserted when.

iterate through each transaction row (`tx`):
- check if `tx.block_number` is in block table.
  - if yes, good
  - if no, insert into **block**: `tx.block_number`, `tx.date_time`.
- check if `BINARY(tx.to)`, `BINARY(tx.from)`, `BINARY(tx.monitor_address)` is in address table.
  - if yes, grab `address_id` and store for later
  - if no, insert one/many of the following into **address**: `BINARY(tx.to)`, `BINARY(tx.from)`, `BINARY(tx.monitor_address)`; store inserted ids
- insert `tx` into **transaction** with `address.address_id` in `to` and `from` columns.
- insert rows into **monitor_transaction**: `tx.block_number`, `tx.tx_index`, `tx.trace_id`, and monitor's `address_id` (do we need to insert rows with monitor address in `tx.to`/`tx.from`, or could this table be renamed **hidden_monitor_transaction**)
