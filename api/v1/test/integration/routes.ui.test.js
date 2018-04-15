process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

describe('routes : ui', () => {
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

  describe('GET /api/v1/ui', () => {
    it('should respond with a monitor prop containing all monitors', (done) => {
      chai.request(server).get('/api/v1/ui').end((err, res) => {
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
        // key-value pair of {"data": [5 transaction objects]}
        res.body.data.monitorAddresses.length.should.eql(2);
        // the first object in the data array should
        // have the right keys
        //res.body.data[0].should.include.keys('encoding', 'block_number', 'tx_index', 'trace_id', 'from_address', 'to_address', 'value_wei', 'gas_price', 'gas_used', 'is_error', 'input_articulated', 'created_at',);
        done();
      });
    });
  });
});
