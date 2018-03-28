# tokenomics/monitors

This folder contains the transactional data for each monitored account. Currently, it stores all transactional data for each account. In the future, it will store a separate transaction database (including both external and internal transactions at equal status) and only the block.txid.traceid lists per account.

- Used `sed '/------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/d; /^[[:space:]]*$/d' etherTip_data.txt > etherTip_data_edited.txt` to format the original etherTip data.
