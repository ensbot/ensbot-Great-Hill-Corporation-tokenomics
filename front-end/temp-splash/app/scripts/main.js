//Width and height
const w = 600;
const h = 250;

const colors = '#ffffbd,#ffb714,#32c3b4,#cf2614,#fbdc72,#eb7822,#e6f2ba,#cee4b9'.split(',');

let dataset = [...'tokenomics'].map((letter) =>
  {
    return {
      letter: letter,
      val: 0 + Math.floor(Math.random()*30)
    }
  });

const xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05);

const yScale = d3.scaleLinear()
        .domain([0,
          //d3.max(dataset.map(d => d.val))
        30
      ])
        .range([0 + 80, h - 80]);

//Create SVG element
const svg = d3.select('#chart')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

//Create bars
svg.selectAll('rect')
   .data(dataset)
   .enter()
   .append('rect')
   .attr('x', function(d, i) {
      return xScale(i);
   })
   .attr('y', function(d) {
      return h - yScale(d.val);
   })
   .attr('width', xScale.bandwidth())
   .attr('height', function(d) {
      return yScale(d.val);
   })
   .attr('fill', function(d, i) {
    return colors[i % colors.length];
   });

//Create labels
svg.selectAll('text')
   .data(dataset)
   .enter()
   .append('text')
   .text(function(d) {
      return d.letter;
   })
   .attr('text-anchor', 'middle')
   .attr('x', function(d, i) {
      return xScale(i) + xScale.bandwidth() / 2;
   })
   .attr('y', function(d) {
      return h - yScale(d.val) - 20;
   });




let timeout = (n) => {
  setTimeout(() => {
    //New values for dataset
    dataset = [...'tokenomics'].map((letter) =>
      {
        return {
          letter: letter,
          val: 0 + Math.floor(Math.random()*30)
        }
      });


    //Update all rects
    svg.selectAll('rect')
       .data(dataset)
       .transition()
       .delay(function(d, i) {
         return i / dataset.length * 1000;
       })
       .duration(1500)
       .attr('y', function(d) {
          return h - yScale(d.val);
       })
       .attr('height', function(d) {
          return yScale(d.val);
       })
       .attr('fill', function(d, i) {
        return colors[(i + n) % colors.length];
       });

    //Update all labels
    svg.selectAll('text')
       .data(dataset)
       .transition()
       .delay(function(d, i) {
         return i / dataset.length * 1000;
       })
       .duration(1500)
       .text(function(d) {
          return d.letter;
       })
       .attr('x', function(d, i) {
          return xScale(i) + xScale.bandwidth() / 2;
       })
       .attr('y', function(d) {
          return h - yScale(d.val) - 20;
       });
       timeout(n+1);
    }, 3000);
  }

timeout(1);
