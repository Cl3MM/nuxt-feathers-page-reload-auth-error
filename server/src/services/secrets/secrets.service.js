// Initializes the `secrets` service on path `/secrets`
const createService = require('feathers-nedb');
const createModel = require('../../models/secrets.model');
const hooks = require('./secrets.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/secrets', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('secrets');

  service.hooks(hooks);
};
