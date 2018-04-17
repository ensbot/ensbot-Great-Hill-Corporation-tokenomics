let exampleState = {
  ui: {
    /*
    UI includes everything available to the user. So, if she has monitor groups, show her those she has
    to choose from. Show her monitor group galleries.
    UI is also what type of tables he wants. What columns does he prefer to see? How does he prefer to
    split up tables?
    UI is how many different data sets I can see at the same time, whether on chart or on table/sheet
    UI is monitor additions.
    UI is chart manipulations.
    UI is table vs chart; is summary metrics vs detail rows; and is which ones the user prefers.
    */
    monitorGroups: {

    }
  },
  dataThatGoesToCountBarChart: [
    {
      currencyName: 'RChain',
      data: [
        week1: 30,
        week2: 45,
        week3: 44
      ]
    },
    {
      currencyName: 'Quantstamp',
      data: [
        week1: 40,
        week2: 40,
        week3: 50
      ]
    }
]
}
