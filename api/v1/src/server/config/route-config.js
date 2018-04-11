(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const authRoutes = require('../routes/auth');
    const transactionRoutes = require('../routes/transactions');
    const uiRoutes = require('../routes/ui');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/transactions', transactionRoutes);
    app.use('/api/v1/ui', uiRoutes);
  };

})(module.exports);
