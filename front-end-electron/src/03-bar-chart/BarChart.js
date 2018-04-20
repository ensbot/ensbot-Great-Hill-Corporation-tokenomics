import React, {Component} from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.updateCycle = 0;

    this.state = {
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    let shouldIt;
    if(this.props.myData[0] === undefined) {
      console.log('first load');
      this.updateCycle = 1;
      shouldIt = true;
    } else {
    if(this.props.myData[0].monitorAddress != nextProps.myData[0].monitorAddress) {
      console.log('addresses don\'t match... rerendering');
      shouldIt = true;
    } else {
      shouldIt = false;
    }
  }
  console.log(shouldIt);
  return shouldIt;
  }

  formatDataForChart = (data) => {
    console.log(data);
    const parseDate = d3.timeParse("%Y %W"),
    formatDate = d3.timeFormat("%Y %W");
    return Object.entries(
      data
      .map((datum) => {
        datum.monthYear = formatDate(new Date(datum.blockTimeStamp * 1000));
        return datum;
      })
      .reduce((acc, cur) => {
        acc[cur.monthYear] = (acc[cur.monthYear] || 0) +1;
        return acc;
      }, {}))
      .map((datum) => {// XXX:
        return {
          date: parseDate(datum[0]),
          // price is count
          price: +datum[1]
        }
      });
  }

  componentDidUpdate = () => {
    if (this.props.myData.length) {

      let data = this.formatDataForChart(this.props.myData);

      console.log(data);
      let formatDate = d3.timeFormat("%Y %W");
      const svg = d3.select("svg"),
        margin = {
          top: 20,
          right: 20,
          bottom: 110,
          left: 40
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05),
        y = d3.scaleLinear().range([height, 0]);

      svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

      let focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      let ticks = d3.timeWeek.range(data[0].date, data.slice(-1)[0].date).map((d)=> {
        return new Date(d.setDate(d.getDate() + 1));
        });
      console.log(ticks);
      x.domain(ticks);
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.price;
        })
      ]);

      const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%Y-%W"))
        .tickValues(ticks.filter((tick, i) => {return i % 4 === 0}))
        ,
        yAxis = d3.axisLeft(y);

        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

      focus.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar-rect")
      .attr("x", (d) => x(d.date))
      .attr("width", x.bandwidth())
      .attr("y", (d) =>y(d.price))
      .attr("height", (d) => height - y(d.price))
      .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Week of <strong>${d.date.toDateString()}</strong><br/> ${d.price} Transactions`)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
      });


      focus.append("g").attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      focus.append("g").attr("class", "axis axis--y").call(yAxis);

      }
  }

  // anim = () => {
  //   let data = this.formatDataForChart(this.props.myData);
  //   console.log(data);
  //   d3.select("svg")
  //     .selectAll('*')
  // }

  render() {
    return (
      <div>
        <svg width="960" height="500"></svg>
      </div>
    );
  }
}

export default BarChart;
