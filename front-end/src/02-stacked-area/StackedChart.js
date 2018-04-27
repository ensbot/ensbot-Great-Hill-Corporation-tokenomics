import React, {Component} from 'react';
import * as d3 from 'd3';

class StackedChart extends Component {
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
    if(this.props.myData[0].monitor_address != nextProps.myData[0].monitor_address) {
      console.log('addresses don\'t match... rerendering');
      shouldIt = true;
    } else {
      console.log('shouldn\'t update');
      shouldIt = false;
    }
  }
  console.log(shouldIt);
  return shouldIt;
  }

  formatDataForChart = (data) => {
    const parseDate = d3.timeParse("%Y %W"),
    formatDate = d3.timeFormat("%Y %W");

    // data => get weeks => for each week, how many per fn

    const getFnType = (string) => {
      if(string.trim() === '0x') {
        return 'none';
      } else if (string.trim().slice(0,2) === '0x') {
        return 'unknown';
      } else {
        return string;
      }
    }

    //console.log(data);
      return Object.entries(
        data
          .map((datum) => {
            datum.chartDate = formatDate(new Date(datum.block_timestamp * 1000));
            datum.fnType = getFnType(datum.articulated[0]);
            return datum;
          })
          .reduce((acc, cur) => {
            if(acc[cur.fnType] === undefined) {
              acc[cur.fnType] = {
                txCounts: [],
              };
            }
            acc[cur.fnType].txCounts[cur.chartDate] = (acc[cur.fnType].txCounts[cur.chartDate] || 0) +1;
            return acc;
          }, {})
      )
      .map((fnTypeArr) => {
        return {
          name: fnTypeArr[0],
          values: Object.entries(fnTypeArr[1].txCounts).map((datum) => {
            return {
              date: parseDate(datum[0]),
              // price is count
              price: +datum[1]
              };
            })
          };
      })
  }

  componentDidMount = () => {
    console.log('hit here');
    if (this.props.myData.length) {

      let data = this.formatDataForChart(this.props.myData);

      console.log(data);

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



      const x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

      const xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

      svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

      let focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      let allDates = [...new Set([].concat.apply([], data.map(fnObj => fnObj.values)).map(obj => obj.date))]
        .sort((a,b) => {return a - b}),
        dateSoFarStore = [];

       allDates.map((date) => {
         return dateSoFarStore[date.valueOf()] = 0;
       });

      x.domain(d3.extent([].concat.apply([], data.map(fnObj => fnObj.values)), (d) => {
        return d.date;
      }));
      y.domain([
        0,
        Math.max(...Object.values([].concat.apply([], data.map(obj => obj.values)).map((obj) => {obj.date = obj.date.valueOf(); return obj}).reduce((acc, cur) => {acc[cur.date] = acc[cur.date] === undefined ? cur.price : acc[cur.date] + cur.price; return acc}, {})))
      ]);

      let drawCurve = (fnObj, prevData) => {
        let newData = [];

        fnObj.values.map((d, i) => {
          newData[d.date.valueOf()] = d.price;
        });

        let curveMapping = allDates.map((date) => {
          date = date.valueOf();
          let newDataVal = newData[date] === undefined ? 0 : newData[date];
          return {
            date: new Date(date),
            priceStart: +prevData[date],
            priceEnd: +prevData[date] + newDataVal
          }
        });

        let fnAreaCurve = d3.area()
          .x(d => x(d.date))
          .y0(d => y(d.priceStart))
          .y1(d => y(d.priceEnd))
          //.curve(d3.curveBasis)
          .curve(d3.curveMonotoneX)
          ;

        return focus
          .append("path")
            .attr("id", `${fnObj.name}`)
            .attr("class", "area")
            .attr("d", fnAreaCurve(curveMapping))
            .attr("fill", d => `rgb(0, 0, ${100+Math.floor(Math.random()*100)})`)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", function(d) {
               //Update the tooltip position and value
               d3.select("#tooltip")
                 .select("#fnName")
                 .text(this.id);

               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false);

              })
              .on("mouseout", function() {

               //Hide the tooltip
               d3.select("#tooltip").classed("hidden", true);

             });
        }



     data.map((fnObj) => {
       drawCurve(fnObj, dateSoFarStore);
       fnObj.values.map((d) => {
         return dateSoFarStore[d.date.valueOf()] = dateSoFarStore[d.date.valueOf()] === undefined ? d.price : dateSoFarStore[d.date.valueOf()] + d.price;
       });
     });


      //focus.append("path").datum(data).attr("class", "area").attr("d", area);

      focus.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(xAxis);

      focus.append("g").attr("class", "axis axis--y").call(yAxis);
    }
  }

  anim = () => {
    let svg = d3.select("svg"),
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
    let data = this.formatDataForChart(this.props.myData)
      .map((datum) => {
        datum.price = datum.price + 3000;
        return datum;
      });

      const x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);


      const area = d3.area().curve(d3.curveMonotoneX).x((d) => {
        return x(d.date);
      }).y0(height).y1(function(d) {
        return y(d.price);
      });

      console.log(area);

      const area2 = d3.area().curve(d3.curveMonotoneX).x((d) => {
        return x2(d.date);
      }).y0(height2).y1(function(d) {
        return y2(d.price);
      });

      svg
      .selectAll('path')
      .transition()
      .attr('d', area(data));

  }

  render() {
    return (
      <div>
        <div id="tooltip" className="hidden">
          <p>That's...</p>
          <p><span id="fnName"></span> input data</p>
        </div>
        <svg width="960" height="500"></svg>
      </div>
    );
  }
}

export default StackedChart;
