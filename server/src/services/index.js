const users = require('./users/users.service.js');
const secrets = require('./secrets/secrets.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(secrets);
};
