import React, {Component} from 'react';

const SimpleDashTable = (props) => {
  console.log(props.data);
  return(
    <div className="simple-dash-table">
      <table>
        <thead>
        <tr><th>Function Name</th><th>Count</th></tr>
        </thead>
        <tbody>
        {props.data.map((row) => {
          return <tr key={row.fnName}><td>{row.fnName}</td><td>{row.tx.length}</td></tr>
        })}
      </tbody>
      </table>
    </div>
)
}

export default SimpleDashTable;
