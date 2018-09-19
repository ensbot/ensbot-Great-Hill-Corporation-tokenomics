require(tidyverse)
require(jsonlite)
require(shiny)

jsonfiles <- list.files(path = "../jsondata")


# Define UI for app ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Top 44 ICOs"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: Slider for the number of bins ----
      checkboxGroupInput("addresses.to.show", "Addresses in top 10 to show:",
                         c(1:10), selected=c(1:10)),
      
      selectizeInput(inputId ="dropdown",
                     label="Address:",
                     choices=jsonfiles)
      
    ),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Histogram ----
      plotOutput(outputId = "distPlot")
      # textOutput("filePath")
      
      
    )
  )
)

# Define server logic
server <- function(input, output) {
  
  
  
  
  data.r <- reactive(
    {
      data <- read_json(path = paste0('../jsondata/',input$dropdown),
                        simplifyVector=T,
                        simplifyDataFrame=T) %>%
        jsonlite::flatten() %>%
        as_data_frame() %>%
        mutate(fn.name = map_chr(articulatedTx, 'name', .default = NA))
      
      in.out <- data %>%
        filter(fn.name == 'transfer', !isError) %>%
        mutate(transfer.values = map(articulatedTx, list('inputs',1, 'value'), .default = NA)) %>%
        mutate(transfer.to = map_chr(transfer.values, 1)) %>%
        mutate(transfer.amount = map_chr(transfer.values, 2) %>% as.integer()) %>%
        select(timestamp, from, transfer.to, transfer.amount)
      
      in.out.cum <- in.out %>% 
        gather(key = 'address.type', value = 'address', 2:3) %>%
        mutate(transfer.amount = ifelse(address.type == 'from', -transfer.amount, transfer.amount)) %>%
        group_by(address, timestamp) %>%
        summarize(transfer.amount = sum(transfer.amount)) %>%
        mutate(cumBalance = cumsum(transfer.amount)) %>%
        ungroup()
      
      timestamps <- in.out.cum %>% distinct(timestamp)
      addresses <- in.out.cum %>% distinct(address)
      address.timestamp <- crossing(addresses, timestamps) %>% arrange(address, timestamp)
      
      addInitialSupplyBalance = function(data) {
        data %>%
          rbind(data.frame(
            address = '0xc9d7fec9889690bbff0a0df758d13e5a55dd7822', 
            address.type = 'transfer.to',
            timestamp = 1499459125,
            transfer.amount = 49000000
          )) %>%
          return()
      }
      
      in.out.cum.with.zeroes <- in.out %>%
        gather(key = 'address.type', value = 'address', 2:3) %>%
        addInitialSupplyBalance() %>%
        mutate(transfer.amount = ifelse(address.type == 'from', -transfer.amount, transfer.amount)) %>%
        group_by(address, timestamp) %>%
        summarize(transfer.amount = sum(transfer.amount)) %>%
        full_join(address.timestamp) %>%
        arrange(address, timestamp) %>%
        mutate(transfer.amount = ifelse(is.na(transfer.amount),0,transfer.amount)) %>%
        group_by(address, timestamp) %>%
        summarize(transfer.amount = sum(transfer.amount)) %>%
        mutate(cumBalance = cumsum(transfer.amount)) %>%
        ungroup()

      top.10 <- in.out.cum.with.zeroes %>%
        group_by(address) %>%
        top_n(1, cumBalance) %>%
        distinct(address, .keep_all = T) %>%
        ungroup() %>%
        top_n(10, cumBalance) %>%
        arrange(desc(cumBalance)) %>%
        select(address)
      
      return(list(in.out.cum.with.zeroes = in.out.cum.with.zeroes, top.10 = top.10))
    }
    )
  
  output$distPlot <- renderPlot({
    data <- data.r()
    data$in.out.cum.with.zeroes %>%
      mutate(address = ifelse(address %in% data$top.10$address, address, 'other')) %>%
      filter(address %in% c(data$top.10$address[as.integer(input$addresses.to.show)], 'other')) %>%
      group_by(address, timestamp) %>%
      arrange(address, timestamp) %>%
      summarize(cumBalance = sum(cumBalance)) %>%
      ggplot(aes(x = timestamp, y = cumBalance, fill=address)) +
      geom_area(position='fill')
  }, execOnResize = TRUE)
  
}

shinyApp(ui = ui, server = server)