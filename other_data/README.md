#### Other Data

We can use this to collect together some data I've gathered over the last few months:

1. [Contracts.csv](./Contracts.csv) - A list of all Ethereum contracts as of block 4,750,000 along with how many other contracts that contract deployed sorted by number of sub-contracts.

2. [Transactions.xlsx](./Transactions.xlsx) - Transactions per 50,000 blocks by nTraces to block 5,000,000

3. [Traces.xlsx](./Traces.xlsx) - Traces per 50,000 blocks by nTraces to block 5,000,000

4. [tokensByWeek.txt](./tokensByWeek.txt) - Token related transactions by week since inception  
    **fields:** blockNum, date, nBlocks, nTrans, nTraces, nTransfers, nApproves, nTransferFroms, nTTransfers, nTApproves, nTTransferFroms

5. [countsByWeek.txt](./countsByWeek.txt) - Counts related to full vs. empty blocks, transaction counts by week  
    **fields:** blockNum, date, nEmpty, nFull, pctFull, nTrans, tx/full blk, tx/all blks, nTraces

6. [countsPer10000.txt](./countsPer10000.txt) - Counts related to full vs. empty blocks, transaction counts by 10,000 blocks  
    **fields:** blockNum, date, nEmpty, nFull, pctFull, nTrans, tx/full blk, tx/all blks, nTraces

7. [countsPer10000.xlsx](./countsPer10000.xlsx) - Spreadsheet with same data

8. [AEBFilters.xlsx](./AEBFilters.xlsx) - Adaptive Enhanced Bloom Filters (charts)

<img src="./Blocks Per Week 09-08.png">
