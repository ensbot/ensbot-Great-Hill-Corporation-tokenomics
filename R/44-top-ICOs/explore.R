require(jsonlite)
require(dplyr)
require(ggplot2)
require(shiny)
require(magrittr)

# runExample("01_hello")

list.files(path = "./jsondata", pattern = NULL, all.files = FALSE,
           full.names = FALSE, recursive = FALSE,
           ignore.case = FALSE, include.dirs = FALSE, no.. = FALSE)

jsonInput <- list(
  newbium = "jsondata/00_newbium-0xc9d7fec9889690bbff0a0df758d13e5a55dd7822.json"
)

data <- read_json(path = jsonInput$newbium, simplifyVector=T, simplifyDataFrame=T) %>%
  flatten() %>%
  as_data_frame() %>%
  mutate(price = as.double(price))

data %>%
  rowwise() %>%
  mutate(fn.call = articulatedTx[['name']]) %>%
  select(fn.call)


data %>%
  ggplot(aes(x=timestamp, y=price)) +
  geom_point()

data[3,c(14,18,22:25)]

data[5:10,c(14,15)]

data[[8,14]][['name']]
data[[8,14]] %$% inputs %>% purrr::flatten_dfc()

data

data %>% select(price) %>% arrange()

data %>% View()



