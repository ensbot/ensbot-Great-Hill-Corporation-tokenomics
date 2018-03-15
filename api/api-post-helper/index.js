const request = require('request-promise-native');

const reqBody = [
  {
    dateTime: '1980-10-3 12:10:11',
    blockNumber: 40381503,
    transactionIndex: 1,
    from: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    to: '0x04w32cncgf7bead5deac2370m0f5587d8e7a2123',
    value: 1.1,
    gasCost: 0.59135831,
    isError: false,
    isFinalized: false,
    articulated: 'execute("random stuff", "other random", 301)'
  }, {
    dateTime: '1980-10-3 12:10:11',
    blockNumber: 40381503,
    transactionIndex: 1,
    from: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    to: '0x04w32cncgf7bead5deac2370m0f5587d8e7a2123',
    value: 1.1,
    gasCost: 0.59135831,
    isError: false,
    isFinalized: false,
    articulated: 'execute("random stuff", "other random", 301)'
  }
];

const config = {
  method: 'POST',
  uri: 'http://localhost:3000/api/v0/transactions',
  body: reqBody,
  json: true
};

request.post(config).then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});
