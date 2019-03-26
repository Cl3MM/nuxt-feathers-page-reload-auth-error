// Initializes the `users` service on path `/users`
const createService = require('feathers-memory')
const hooks = require('./users.hooks')

module.exports = function(app) {
  const paginate = app.get('paginate')

  const options = {
    paginate,
    id: '_id',
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/users', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('users')
  service.hooks(hooks)
  ;['admin', 'user'].map(u =>
    service.create({
      email: `${u}@example.com`,
      password: u,
      name: u,
      dob: new Date()
    })
  )
}
