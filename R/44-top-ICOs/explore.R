
require(tidyverse)
require(shiny)
require(magrittr)

list.files(path = "./jsondata", pattern = NULL, all.files = FALSE,
           full.names = FALSE, recursive = FALSE,
           ignore.case = FALSE, include.dirs = FALSE, no.. = FALSE)

jsonInput <- list(
  newbium = "jsondata/00_newbium-0xc9d7fec9889690bbff0a0df758d13e5a55dd7822.json"
)

data <- read_json(path = jsonInput$newbium, simplifyVector=T, simplifyDataFrame=T) %>%
  jsonlite::flatten() %>%
  as_data_frame() %>%
  mutate(price = as.double(price)) %>%
  mutate(fn.name = map_chr(articulatedTx, 'name', .default = NA)) %>%
  mutate(date = as.POSIXct(timestamp, origin = '1970-01-01') %>% as.Date()) 

data %>%
  ggplot(aes(x=date, fill=fn.name)) +
  geom_histogram() +
  facet_wrap(facets = 'fn.name')


data %>% 
  mutate(date = as.POSIXct(timestamp, origin = '1970-01-01') %>% as.Date()) %>%
  mutate(datebin = ntile(timestamp, 10)) %>%
  group_by(datebin) %>%
  summarize(sumEth = sum(ether)) %>%
  ggplot(aes(x=datebin,y=sumEth)) +
  geom_bar(stat="identity")

data %>% 
  mutate(date = as.POSIXct(timestamp, origin = '1970-01-01') %>% as.Date()) %>%
  group_by(date) %>%
  summarize(sumEth = sum(ether)) %>%
  View()

data %>% mutate(fn.name = map_chr(articulatedTx, 'name', .default = NA)) %>%
  select(fn.name)

data %>% mutate(fn.args = map(articulatedTx, c(2, 1, 1))) %>% select(fn.args)
data %>% mutate(fn.args = map(articulatedTx, list('inputs', 1, 'name'))) %>% select(fn.args)
data %>%
  mutate(fn.args = map(articulatedTx, list('inputs', 1))) %>%
  mutate() %>%
  select(fn.args) %>% View()



