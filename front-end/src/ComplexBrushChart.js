import React, {Component} from 'react';
import * as d3 from 'd3';
import './ComplexBrushChart.css';

class ComplexBrushChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate = () => {
    if (this.props.myData.length) {

      const parseDate = d3.timeParse("%Y %W"),
      formatDate = d3.timeFormat("%Y %W");

      const specialAddresses = {
        '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359': 'Contract: Foundation Tip Jar',
        '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7': 'Contract: Unicorn Token'
      };

      const data =
        this.props.myData
        .map((datum) => {
          return {
            //date: datum.block_timestamp,
            gasCost: datum.gasUsed * datum.gasPrice,
            //contract: specialAddresses[datum.toAddress] === undefined ? 'unknown' : specialAddresses[datum.toAddress],
            colorBy: JSON.parse(datum.input_articulated).length > 1 ? JSON.parse(datum.input_articulated)[0] : 'unknown',
            //transferValue: datum.input_articulated[0] === 'transfer' ? data.input_articulated[2] : 0,
            value: datum.value_wei,
            isError: datum.is_error
          }
        });
        console.log(data);

        var width = 1160,
            size = 250,
            padding = 100;

        var x = d3.scaleLinear()
            .range([padding / 2, size - padding / 2]);

        var y = d3.scaleLinear()
            .range([size - padding / 2, padding / 2]);

        var xAxis = d3.axisBottom()
            .scale(x)
            .ticks(6);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(6);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var domainByTrait = {},
            traits = d3.keys(data[0]).filter(function(d) { return d !== "colorBy"; }),
            n = traits.length;

        traits.forEach(function(trait) {
          domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
        });

        xAxis.tickSize(size * n);
        yAxis.tickSize(-size * n);

        var brush = d3.brush()
            .on("start", brushstart)
            .on("brush", brushmove)
            .on("end", brushend)
            .extent([[0,0],[size,size]]);

        var svg = d3.select("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
          .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

        svg.selectAll(".x.axis")
            .data(traits)
          .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
            .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

        svg.selectAll(".y.axis")
            .data(traits)
          .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
            .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

        var cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
          .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
            .each(plot);

        // Titles for the diagonal.
        cell.filter(function(d) { return d.i === d.j; }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) { console.log(d); return d.x; });

        cell.call(brush);

        function plot(p) {
          var cell = d3.select(this);

          x.domain(domainByTrait[p.x]);
          y.domain(domainByTrait[p.y]);

          cell.append("rect")
              .attr("class", "frame")
              .attr("x", padding / 2)
              .attr("y", padding / 2)
              .attr("width", size - padding)
              .attr("height", size - padding);

          cell.selectAll("circle")
              .data(data)
            .enter().append("circle")
              .attr("cx", function(d) { return x(d[p.x]); })
              .attr("cy", function(d) { return y(d[p.y]); })
              .attr("r", 4)
              .style("fill", function(d) { return color(d.colorBy); });
        }

        var brushCell;

        // Clear the previously-active brush, if any.
        function brushstart(p) {
          if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
          x.domain(domainByTrait[p.x]);
          y.domain(domainByTrait[p.y]);
          }
        }

        // Highlight the selected circles.
        function brushmove(p) {
          var e = d3.brushSelection(this);
          svg.selectAll("circle").classed("hidden", function(d) {
            return !e
              ? false
              : (
                e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
                || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
              );
          });
        }

        // If the brush is empty, select all circles.
        function brushend() {
          var e = d3.brushSelection(this);
          if (e === null) svg.selectAll(".hidden").classed("hidden", false);
        }

        function cross(a, b) {
          var c = [], n = a.length, m = b.length, i, j;
          for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
          return c;
        }
      }
  }

  render() {
    return (
      <div>
        <svg width="1160" height="700"></svg>
      </div>
    );
  }
}

export default ComplexBrushChart;
