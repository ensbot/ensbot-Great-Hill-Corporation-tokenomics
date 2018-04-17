import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import MonitorSelector from './MonitorSelector';
import ChartAndTable from './03-bar-chart/ChartAndTable';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

// const Links = () => {
//   return (
//     <nav>
//       <Link to="/"><button className='btn btn-primary'>Home</button></Link>
//       <Link to={{pathname: '/tipjar'}}><button className='btn btn-primary'>Tip Jar</button></Link>
//       <Link to={{pathname: '/tipjar2'}}><button className='btn btn-primary'>Tip Jar Failed Multipanel</button></Link>
//       <Link to={{pathname: '/tipjar3'}}><button className='btn btn-primary'>Tip Jar Brush-filtered data</button></Link>
//     </nav>
//   )
// }

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <MonitorSelector />
            <Route exact path="/" />
            <Route path="/monitor/:monitorAddress" component={ChartAndTable} />
            {/* <Route path="/tipjar" render={() => <ChartAndTable monitorAddress='0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'/>} />
            <Route path="/tipjar2" render={() => <ChartAndTable2 monitorAddress='0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'/>} />
            <Route path="/tipjar3" render={() => <ChartAndTableDataFiltersToo monitorAddress='0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'/>} /> */}
          </div>
        </Router>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get acclimated, edit <code>src/App.js</code> and save to reload.
        </p> */}

      </div>
    );
  }
}

export default App;
