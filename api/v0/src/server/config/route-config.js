(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const transactionRoutes = require('../routes/transactions');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/api/v0/transactions', transactionRoutes);
  };

})(module.exports);
