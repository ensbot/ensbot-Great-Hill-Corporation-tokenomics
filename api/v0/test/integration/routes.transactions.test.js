process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

describe('routes : transactions', () => {

  beforeEach((done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        })
      });
    });
  });

  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });

  describe('GET /api/v0/transactions', () => {
    it('should respond with all transactions', (done) => {
      chai.request(server).get('/api/v0/transactions').end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [10 transaction objects]}
        res.body.data.length.should.eql(10);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys('id', 'dateTime', 'blockNumber', 'transactionIndex', 'from', 'to', 'value', 'gasCost', 'isError', 'isFinalized', 'articulated', 'created_at',);
        done();
      });
    });
  });

  describe('POST /api/v0/transactions', () => {
    it('should respond with a success message and an id when a single transaction is added', (done) => {
      chai.request(server).post('/auth/login').send({username: 'realuser', password: 'doingstuff'}).end((err, res) => {
        should.not.exist(err);
        chai.request(server).post('/api/v0/transactions').set('authorization', 'Bearer ' + res.body.token).send([
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
          }
        ]).end((err, res) => {

          // there should be no errors
          should.not.exist(err);
          // there should be a 201 status code
          // (indicating that something was "created")
          res.status.should.equal(201);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 user object}
          res.body.data.length.should.eql(1);
          // the JSON response body should be a number
          res.body.data[0].map(id => id.should.be.a('number'));
          done();
        });
      });
    });
    it('should respond with a success message and an array of ids when multiple transactions are added', (done) => {
      chai.request(server).post('/auth/login').send({username: 'realuser', password: 'doingstuff'}).end((err, res) => {
        should.not.exist(err);
        chai.request(server).post('/api/v0/transactions').set('authorization', 'Bearer ' + res.body.token).send(Array(5).fill({
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
        })).end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 201 status code
          // (indicating that something was "created")
          res.status.should.equal(201);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 user object}
          res.body.data.length.should.eql(5);
          // the JSON response body should be an array of numbers
          res.body.data[0].map(id => id.should.be.a('number'));
          done();
        });
      });
    });
    it('should reject all transactions when 1 is wrong', (done) => {
      chai.request(server).post('/auth/login').send({username: 'realuser', password: 'doingstuff'}).end((err, res) => {
        chai.request(server).post('/api/v0/transactions')
          .set('authorization', 'Bearer ' + res.body.token)
          .send(Array(5).fill({
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
        }).concat({notRightAtAll: 'this is not a valid field', blockNumber: 'q'})).end((err, res) => {
          // there should be an error
          should.exist(err);
          chai.request(server).get('/api/v0/transactions').end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"status": "success"}
            res.body.status.should.eql('success');
            // the JSON response body should have a
            // key-value pair of {"data": [10 transaction objects]}
            res.body.data.length.should.eql(10);
            // the first object in the data array should
            // have the right keys
            res.body.data[0].should.include.keys('id', 'dateTime', 'blockNumber', 'transactionIndex', 'from', 'to', 'value', 'gasCost', 'isError', 'isFinalized', 'articulated', 'created_at',);
            done();
          });
        });
      });
    });
  });
});
