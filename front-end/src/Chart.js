import React, {Component} from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';
import './App.css';

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {myData: props.myData};
  }

  componentDidUpdate = () => {
    if (this.props.myData.length) {

      const parseDate = d3.timeParse("%Y %b");

      const myData = Object.entries(
        this.props.myData
        // .filter((data, index) => {
        //   if(index < 5) console.log(data.is_error);
        //   return !data.is_error;
        // })
        .map((datum) => {
          datum.monthYear = moment.unix(datum.block_timestamp).format('YYYY MMM');
          return datum;
        })
        .reduce((acc, cur) => {
          acc[cur.monthYear] = (acc[cur.monthYear] || 0) +1;
          return acc;
        }, {}))
        .map((datum) => {
          return {
            date: parseDate(datum[0]),
            price: +datum[1]
          }
        });

      const svg = d3.select("svg"),
        margin = {
          top: 20,
          right: 20,
          bottom: 110,
          left: 40
        },
        margin2 = {
          top: 430,
          right: 20,
          bottom: 30,
          left: 40
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;

      const x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

      const xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

      const brush = d3.brushX().extent([
        [
          0, 0
        ],
        [width, height2]
      ]).on("brush end", brushed);

      const zoom = d3.zoom().scaleExtent([1, Infinity]).translateExtent([
        [
          0, 0
        ],
        [width, height]
      ]).extent([
        [
          0, 0
        ],
        [width, height]
      ]).on("zoom", zoomed);

      const area = d3.area().curve(d3.curveMonotoneX).x(function(d) {
        return x(d.date);
      }).y0(height).y1(function(d) {
        return y(d.price);
      });

      const area2 = d3.area().curve(d3.curveMonotoneX).x(function(d) {
        return x2(d.date);
      }).y0(height2).y1(function(d) {
        return y2(d.price);
      });

      svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

      const focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const context = svg.append("g").attr("class", "context").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      let data = myData;

      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.price;
        })
      ]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      focus.append("path").datum(data).attr("class", "area").attr("d", area);

      focus.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(xAxis);

      focus.append("g").attr("class", "axis axis--y").call(yAxis);

      context.append("path").datum(data).attr("class", "area").attr("d", area2);

      context.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

      context.append("g").attr("class", "brush").call(brush).call(brush.move, x.range());

      svg.append("rect").attr("class", "zoom").attr("width", width).attr("height", height).attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(zoom);

      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
          return; // ignore brush-by-zoom
        const s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
      }

      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
          return; // ignore zoom-by-brush
        const t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      }
    }
  }

  render() {
    return (
      <div>
        <svg width="960" height="500"></svg>
      </div>
    );
  }
}

export default Chart;
