require(tidyverse)
require(shiny)
# require(magrittr)

jsonfiles <- list.files(path = "../jsondata")


# Define UI for app that draws a histogram ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Top 44 ICOs"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: Slider for the number of bins ----
      sliderInput(inputId = "bins",
                  label = "Days per bin:",
                  min = 1,
                  max = 50,
                  value = 30),
      
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
  # output$filePath <- renderText({paste0('../jsondata/',input$dropdown)})
  data.r <- reactive(
    {read_json(path = paste0('../jsondata/',input$dropdown), simplifyVector=T, simplifyDataFrame=T) %>%
    jsonlite::flatten() %>%
    as_data_frame() %>%
    mutate(price = as.double(price)) %>%
    mutate(fn.name = map_chr(articulatedTx, 'name', .default = NA)) %>%
    mutate(date = as.POSIXct(timestamp, origin = '1970-01-01') %>% as.Date()) }
    )
  
  output$distPlot <- renderPlot({
    data <- data.r()
    data %>%
      ggplot(aes(x=date, fill=fn.name)) +
      geom_histogram(binwidth = input$bins) +
      facet_wrap(facets = 'fn.name')
  }, execOnResize = TRUE)
  
}

shinyApp(ui = ui, server = server)