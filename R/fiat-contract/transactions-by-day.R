library(readr)

transactions <- read_csv("transactions.csv")

#block.txs <- data.frame(transactions$blocknumber, transactions$transactionindex)
block.dates <- data.frame(transactions$blocknumber, transactions$date)

plot(block.dates)
