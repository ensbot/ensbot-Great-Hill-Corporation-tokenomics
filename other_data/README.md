### Types of Reports

These are the higher level types of data we can collect (there are probably more--feel free to add):

#### Block / Transaction level

- Number of blocks/transactions/traces/logs per min/hour/day/week/month/10,000/100,000/1,000,000
- Number of transactions/traces/logs per block
- Number of traces/logs per transaction
- Percentage of value transfers to contract executions to contract creations to suicides
- Average 'input' data size per min/hour/day/week/month/10,000/100,000/1,000,000
- Average value of transactions over time (including and excluding zero value transactions)
- Analysis of Eth bloom filters (how full, how many false positives?)

#### Account level

- New account creations per min/hour/day/week/month/10,000/100,000/1,000,000
- Total number of accounts (by regular vs. contract)
- Percentages of regular accounts to smart contract accounts
- Most active regular vs. smart contract
- Largest holdings regular vs. smart contract
- Distribution by number of external transactions involved in
- Distribution by number of internal transactions initiated
- Most active creator of smart contracts
- Size of contract storage per address
- Size of contract code per address
- Activity density (most active over day/week/month/year)
- Activity span (longest distance between first and most recent transaction)
- Average life span (average of first vs. most recent transaction)
- History of first event account
- History of Genisis accounts

#### Gas/Ether accounting

- Expenditures on gas per min/hour/day/week/month/10,000/100,000/1,000,000 (in Wei / Ether / US Dollars)
- Contract generating largest all-time gas usage
- Contract with highest per transaction gas cost
- Highest spending on gas by a single non-contract account (and by a smart contract)
- Highest costing individual function call
- Gas price history (Wei / Ether / US dollar)
- gasUsed as percentage of gasAllowed (relative to gasPrice)
- gasUsed as a percentage of gasLimit
- Expentitures on gas per day in US dollars
- Cost of mining rewards in US dollars
- Total transaction volume in US dollars by min/hour/day/week/month/10,000/100,000/1,000,000
- Percent of transaction with more than 21000 gas used (the default for a transfer)
- Percent of transactions with non-default gas price

#### Indiviual account data (i.e. tokenomics)

- Individual history of transactions per account (or group of accounts)
- Gas analysis for individual smart contracts (gas used per function, etc)
- Per block accounting / reconciliation with node
- Extraction of articulated transactions (count by function call)
- Comparison between two (or more) different ERC20 tokens
- Cap tables for ERC20 tokens
- Analysis of ERC721 tokens
- Asset inventories for ERC721 tokens

#### Relationship data

- Number of totally isolated account pairs?
- Can we identify cliques of accounts?
- Can we identify types of contracts by thier relationships with other accounts alone?
- Are there recognizable smart contract structures?

#### Mining data

- Unique miners overal
- Most frequent winner
- Number of unique new miners per week
- Can we find cliques between miners?

#### Quickblocks specific

- Performance analysis
- Usage of adaptive hierarchical blooms filters (size savings, false positives, etc)

### Other Data

Here is some other data that I've already collected. These are not high quality data.

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

9. [./other/forMax_aws/data/](./) - Every smart contract every created along with which account created it

### Various Graphics

<img src="./Blocks Per Week 09-08.png">

### Other source code (not in repo)

    ./other/gasHole/
    ./other/blockCheck/results
    ./other/blockCheck/data/
    ./other/blooms/research/data/
    ./other/blooms/tests/
    ./other/papers.save/
    ./other/traceCounter/data/
    ./other/bytesUsed/tests/
    ./other/valueCheck/
    ./other/ddos/
    ./other/inputSize/
    ./other/internal/tests/
    ./other/docs.save/
    ./other/fixBlocks/
    ./other/inerror/tests/
    ./other/tokenCounter/
    ./other/ddos2/
    ./other/visitor/
    ./other/bloomTester/
    ./other/tokenFactory/
    ./other/sortShit/
    ./other/db/data/
    ./other/bloomDao/tests/
    ./other/countBlocks/
    ./other/bitsTwiddled/
    ./other/miniBlkTst/data/
    ./other/acctIndex/data/
    ./apps/bloomMan/data/
