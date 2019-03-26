// Initializes the `secrets` service on path `/secrets`
const createService = require('feathers-memory')
const hooks = require('./secrets.hooks')
const loremIpsum = require('lorem-ipsum')

const rndAr = (n = 100, len = 10) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * n))

module.exports = function(app) {
  const paginate = app.get('paginate')

  const options = {
    paginate,
    id: '_id',
    multi: true,
    store: rndAr(10, 20).reduce(
      (h, val, idx) => (
        (h[idx] = {
          _id: idx,
          title: loremIpsum({
            count: 1,
            sentenceLowerBound: 4,
            sentenceUpperBound: 10,
            units: 'sentences'
          }),
          message: loremIpsum({
            units: 'paragraphs'
          }),
          userId: idx % 4 === 0 ? 0 : idx % 4 === 1 ? 1 : null
        }),
        h
      ),
      {}
    )
  }

  // Initialize our service with any options it requires
  app.use('/secrets', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('secrets')

  service.hooks(hooks)
}
