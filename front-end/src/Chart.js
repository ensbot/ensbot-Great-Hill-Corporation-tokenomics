import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';

class Chart extends Component {
  constructor(props)  {
  super(props);

  this.state = {

  };
}

componentDidMount = () => {
  fetch('/api/v1/transactions')
    .then(res => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
}


  render() {
    return (
      <p></p>
    );
  }
}

export default Chart;
