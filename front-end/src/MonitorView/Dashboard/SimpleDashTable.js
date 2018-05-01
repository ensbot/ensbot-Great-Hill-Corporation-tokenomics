import React, {Component} from 'react';

const SimpleDashTable = (props) => {
  let sortedData = props.data.sort((a,b) => b.tx.length - a.tx.length);
  return(
    <div className="simple-dash-table">
      <table>
        <thead>
        <tr><th>Function Name</th><th>Count</th></tr>
        </thead>
        <tbody>
        {sortedData.map((row) => {
          return <tr key={row.fnName}><td>{row.fnName}</td><td>{row.tx.length}</td></tr>
        })}
      </tbody>
      </table>
    </div>
)
}

export default SimpleDashTable;
